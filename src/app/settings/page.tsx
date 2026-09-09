"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { onAuthStateChanged, User } from "firebase/auth";
import AuthModal from "@/components/AuthModal";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import { auth } from "@/lib/firebase";

type SubscriptionPlan = "basic" | "premium" | "premium-plus";

type ConfirmedSubscription = {
  plan: SubscriptionPlan;
  subscriptionStatus: string;
};

async function confirmCheckout(
  user: User,
): Promise<ConfirmedSubscription> {
  const searchParams = new URLSearchParams(window.location.search);
  const isSuccessfulCheckout = searchParams.get("checkout") === "success";
  const idToken = await user.getIdToken();

  const sessionId = isSuccessfulCheckout
    ? searchParams.get("session_id")
    : null;

  if (isSuccessfulCheckout && !sessionId) {
    throw new Error("The Stripe Checkout session is missing.");
  }

  const response = await fetch("/api/subscription/confirm", {
    method: isSuccessfulCheckout ? "POST" : "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    ...(isSuccessfulCheckout && {
      body: JSON.stringify({ sessionId }),
    }),
  });

  const data = (await response.json()) as {
    plan?: SubscriptionPlan;
    subscriptionStatus?: string;
    error?: string;
  };

  if (!response.ok || !data.plan || !data.subscriptionStatus) {
    throw new Error(
      data.error ?? "Unable to confirm your subscription.",
    );
  }

  if (isSuccessfulCheckout) {
    window.history.replaceState({}, "", "/settings");
  }

  return {
    plan: data.plan,
    subscriptionStatus: data.subscriptionStatus,
  };
}

export default function SettingsPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] =
    useState<SubscriptionPlan>("basic");
  const [subscriptionStatus, setSubscriptionStatus] = useState("");
  const [subscriptionError, setSubscriptionError] = useState("");
  const [isConfirmingSubscription, setIsConfirmingSubscription] =
    useState(false);

  useEffect(() => {
    const stopListening = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setIsAuthReady(true);

      if (!user) {
        setSubscriptionPlan("basic");
        setSubscriptionStatus("");
        return;
      }

      setIsConfirmingSubscription(true);
      setSubscriptionError("");

      try {
        const subscription = await confirmCheckout(user);

        setSubscriptionPlan(subscription.plan);
        setSubscriptionStatus(subscription.subscriptionStatus);
      } catch (error) {
        setSubscriptionError(
          error instanceof Error
            ? error.message
            : "Unable to confirm your subscription.",
        );
      } finally {
        setIsConfirmingSubscription(false);
      }
    });

    return stopListening;
  }, []);

  const planLabel =
    subscriptionPlan === "premium-plus"
      ? "Premium Plus"
      : subscriptionPlan === "premium"
        ? "Premium"
        : "Basic";

  return (
    <>
      <Sidebar />

      <div className="md:ml-60">
        <SearchBar />

        <main className="min-h-[calc(100vh-80px)] bg-white px-6 py-12 text-[#032b41]">
          <div className="mx-auto w-full max-w-[1070px]">
            <h1 className="border-b border-[#e1e7ea] pb-6 text-3xl font-bold">
              Settings
            </h1>

            {!isAuthReady ? (
              <div className="mt-8 space-y-5">
                <div className="h-7 w-48 animate-pulse rounded bg-[#e1e7ea]" />
                <div className="h-5 w-72 animate-pulse rounded bg-[#e1e7ea]" />
                <div className="h-10 w-36 animate-pulse rounded bg-[#e1e7ea]" />
              </div>
            ) : currentUser ? (
              <section className="mt-8 max-w-[600px]">
                {subscriptionError && (
                  <p
                    className="mb-6 rounded bg-red-50 p-4 text-red-700"
                    role="alert"
                  >
                    {subscriptionError}
                  </p>
                )}

                <div className="border-b border-[#e1e7ea] pb-6">
                  <h2 className="text-lg font-semibold">
                    Your subscription plan
                  </h2>

                  <p className="mt-2 text-[#394547]">
                    {isConfirmingSubscription
                      ? "Confirming subscription..."
                      : planLabel}
                  </p>

                  {subscriptionStatus && (
                    <p className="mt-1 text-sm capitalize text-[#6b757b]">
                      Status: {subscriptionStatus}
                    </p>
                  )}

                  {subscriptionPlan === "basic" && (
                    <Link
                      href="/choose-plan"
                      className="mt-4 inline-flex h-10 items-center justify-center rounded bg-[#2bd97c] px-6 font-semibold transition-colors hover:bg-[#20ba68]"
                    >
                      Upgrade to Premium
                    </Link>
                  )}
                </div>

                <div className="pt-6">
                  <h2 className="text-lg font-semibold">Email</h2>

                  <p className="mt-2 text-[#394547]">
                    {currentUser.email ?? "Guest account"}
                  </p>
                </div>
              </section>
            ) : (
              <section className="flex flex-col items-center py-12 text-center">
                <Image
                  src="/assets/login.png"
                  alt="Log in to see your account details"
                  width={400}
                  height={276}
                  className="h-auto w-full max-w-[400px]"
                  priority
                />

                <h2 className="mt-8 text-2xl font-bold">
                  Log in to your account to see your details.
                </h2>

                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="mt-5 h-10 rounded bg-[#2bd97c] px-8 font-semibold transition-colors hover:bg-[#20ba68]"
                >
                  Login
                </button>
              </section>
            )}
          </div>
        </main>
      </div>

      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}
    </>
  );
}
