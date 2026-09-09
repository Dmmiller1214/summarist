import Stripe from "stripe";
import { adminAuth } from "@/lib/firebase-admin";

type CheckoutRequest = {
  plan: "monthly" | "annual";
};

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is not configured.");
}

const stripe = new Stripe(stripeSecretKey);

export async function POST(request: Request) {
  const authorization = request.headers.get("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return Response.json(
      { error: "You must be logged in to subscribe." },
      { status: 401 },
    );
  }

  const idToken = authorization.slice("Bearer ".length);

  let firebaseUser;

  try {
    firebaseUser = await adminAuth.verifyIdToken(idToken);
  } catch {
    return Response.json(
      { error: "Your login session is invalid. Please log in again." },
      { status: 401 },
    );
  }

  try {
    const { plan } = (await request.json()) as CheckoutRequest;

    if (plan !== "monthly" && plan !== "annual") {
      return Response.json(
        { error: "Please select a valid subscription plan." },
        { status: 400 },
      );
    }

    const priceId =
      plan === "annual"
        ? process.env.STRIPE_ANNUAL_PRICE_ID
        : process.env.STRIPE_MONTHLY_PRICE_ID;

    if (!priceId) {
      return Response.json(
        { error: "The selected plan is not configured." },
        { status: 500 },
      );
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      client_reference_id: firebaseUser.uid,
      customer_email: firebaseUser.email,
      metadata: {
        firebaseUid: firebaseUser.uid,
        plan,
      },
      subscription_data: {
        metadata: {
          firebaseUid: firebaseUser.uid,
          plan,
        },
        ...(plan === "annual"
          ? {
              trial_period_days: 7,
            }
          : {}),
      },
      success_url: `${appUrl}/settings?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/choose-plan?checkout=canceled`,
    });

    if (!session.url) {
      return Response.json(
        { error: "Stripe did not return a Checkout address." },
        { status: 500 },
      );
    }

    return Response.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Unable to create Stripe Checkout session:", error);

    return Response.json(
      { error: "Unable to start checkout. Please try again." },
      { status: 500 },
    );
  }
}