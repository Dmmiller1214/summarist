"use client";

import { ReactNode, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import AuthModal from "@/components/AuthModal";
import { auth } from "@/lib/firebase";

type PlayerAccessGateProps = {
  subscriptionRequired: boolean;
  children: ReactNode;
};

type AccessState = "checking" | "allowed" | "login" | "redirecting";

export default function PlayerAccessGate({
  subscriptionRequired,
  children,
}: PlayerAccessGateProps) {
  const router = useRouter();
  const [accessState, setAccessState] = useState<AccessState>("checking");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const stopListening = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAccessState("login");
        return;
      }

      if (!subscriptionRequired) {
        setAccessState("allowed");
        return;
      }

      try {
        const idToken = await user.getIdToken();
        const response = await fetch("/api/subscription/confirm", {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        const data = (await response.json()) as { plan?: string };

        if (
          response.ok &&
          (data.plan === "premium" || data.plan === "premium-plus")
        ) {
          setAccessState("allowed");
          return;
        }
      } catch {
        // A failed subscription check is treated as Basic access.
      }

      setAccessState("redirecting");
      router.replace("/choose-plan");
    });

    return stopListening;
  }, [router, subscriptionRequired]);

  if (accessState === "checking" || accessState === "redirecting") {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <p className="text-[#6b757b]">Checking book access...</p>
      </div>
    );
  }

  if (accessState === "login") {
    return (
      <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-6 text-center text-[#032b41]">
        <h1 className="text-2xl font-bold">Log in to play this book</h1>
        <button
          type="button"
          onClick={() => setIsAuthModalOpen(true)}
          className="mt-5 rounded bg-[#2bd97c] px-8 py-3 font-semibold hover:bg-[#20ba68]"
        >
          Login
        </button>

        {isAuthModalOpen && (
          <AuthModal onClose={() => setIsAuthModalOpen(false)} />
        )}
      </div>
    );
  }

  return children;
}
