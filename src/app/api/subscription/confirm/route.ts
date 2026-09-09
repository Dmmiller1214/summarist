import Stripe from "stripe";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

type ConfirmSubscriptionRequest = {
  sessionId: string;
};

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is not configured.");
}

const stripe = new Stripe(stripeSecretKey);

export async function GET(request: Request) {
  const authorization = request.headers.get("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return Response.json({ error: "You must be logged in." }, { status: 401 });
  }

  try {
    const firebaseUser = await adminAuth.verifyIdToken(
      authorization.slice("Bearer ".length),
    );
    const snapshot = await adminDb.collection("users").doc(firebaseUser.uid).get();
    const subscription = snapshot.data();

    return Response.json({
      plan: subscription?.plan ?? "basic",
      subscriptionStatus: subscription?.subscriptionStatus ?? "",
    });
  } catch {
    return Response.json(
      { error: "Your login session is invalid." },
      { status: 401 },
    );
  }
}

export async function POST(request: Request) {
  const authorization = request.headers.get("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return Response.json(
      { error: "You must be logged in." },
      { status: 401 },
    );
  }

  const idToken = authorization.slice("Bearer ".length);

  let firebaseUser;

  try {
    firebaseUser = await adminAuth.verifyIdToken(idToken);
  } catch {
    return Response.json(
      { error: "Your login session is invalid." },
      { status: 401 },
    );
  }

  try {
    const { sessionId } =
      (await request.json()) as ConfirmSubscriptionRequest;

    if (!sessionId?.startsWith("cs_")) {
      return Response.json(
        { error: "The Checkout session is invalid." },
        { status: 400 },
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.client_reference_id !== firebaseUser.uid) {
      return Response.json(
        { error: "This Checkout session belongs to another user." },
        { status: 403 },
      );
    }

    if (session.status !== "complete") {
      return Response.json(
        { error: "Checkout has not been completed." },
        { status: 400 },
      );
    }

    const selectedPlan = session.metadata?.plan;

    if (selectedPlan !== "monthly" && selectedPlan !== "annual") {
      return Response.json(
        { error: "The subscription plan is invalid." },
        { status: 400 },
      );
    }

    const subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id;

    if (!subscriptionId) {
      return Response.json(
        { error: "Stripe subscription was not found." },
        { status: 400 },
      );
    }

    const subscription =
      await stripe.subscriptions.retrieve(subscriptionId);

    const customerId =
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id ?? null;

    const plan =
      selectedPlan === "annual" ? "premium-plus" : "premium";

    await adminDb.collection("users").doc(firebaseUser.uid).set(
      {
        email: firebaseUser.email ?? null,
        plan,
        subscriptionStatus: subscription.status,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        stripePriceId:
          subscription.items.data[0]?.price.id ?? null,
        updatedAt: FieldValue.serverTimestamp(),
      },
      {
        merge: true,
      },
    );

    return Response.json({
      plan,
      subscriptionStatus: subscription.status,
    });
  } catch (error) {
    console.error("Unable to confirm Stripe subscription:", error);

    return Response.json(
      { error: "Unable to confirm the subscription." },
      { status: 500 },
    );
  }
}
