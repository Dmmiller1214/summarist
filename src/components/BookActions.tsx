"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FiBookmark, FiBookOpen, FiHeadphones } from "react-icons/fi";
import AuthModal from "@/components/AuthModal";
import { auth } from "@/lib/firebase";

type SubscriptionPlan = "basic" | "premium" | "premium-plus";

type BookActionsProps = {
  bookId: string;
  subscriptionRequired: boolean;
};

export default function BookActions({
  bookId,
  subscriptionRequired,
}: BookActionsProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] =
    useState<SubscriptionPlan>("basic");
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const stopListening = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (!user) {
        setSubscriptionPlan("basic");
        setIsAuthReady(true);
        return;
      }

      try {
        const idToken = await user.getIdToken();
        const headers = { Authorization: `Bearer ${idToken}` };
        const [response, savedResponse] = await Promise.all([
          fetch("/api/subscription/confirm", { headers }),
          fetch(`/api/library?bookId=${encodeURIComponent(bookId)}`, { headers }),
        ]);
        const data = (await response.json()) as {
          plan?: SubscriptionPlan;
        };

        setSubscriptionPlan(response.ok && data.plan ? data.plan : "basic");
        if (savedResponse.ok) setIsSaved(((await savedResponse.json()) as { saved: boolean }).saved);
      } catch {
        setSubscriptionPlan("basic");
      } finally {
        setIsAuthReady(true);
      }
    });

    return stopListening;
  }, [bookId]);

  async function toggleSaved() {
    if (!currentUser) { setIsAuthModalOpen(true); return; }
    setIsSaving(true);
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(isSaved ? `/api/library?bookId=${encodeURIComponent(bookId)}` : "/api/library", {
        method: isSaved ? "DELETE" : "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        ...(!isSaved && { body: JSON.stringify({ bookId }) }),
      });
      if (response.ok) setIsSaved(!isSaved);
    } finally { setIsSaving(false); }
  }

  function openBook() {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    if (subscriptionRequired && subscriptionPlan === "basic") {
      router.push("/choose-plan");
      return;
    }

    router.push(`/player/${bookId}`);
  }

  return (
    <>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={openBook}
          disabled={!isAuthReady}
          className="flex h-11 items-center justify-center gap-2 rounded bg-[#032b41] px-8 text-white transition-colors hover:bg-[#17445c] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiBookOpen aria-hidden="true" />
          Read
        </button>

        <button
          type="button"
          onClick={openBook}
          disabled={!isAuthReady}
          className="flex h-11 items-center justify-center gap-2 rounded bg-[#032b41] px-8 text-white transition-colors hover:bg-[#17445c] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiHeadphones aria-hidden="true" />
          Listen
        </button>
      </div>

      <button type="button" onClick={toggleSaved} disabled={!isAuthReady || isSaving} className="mt-4 flex items-center gap-2 font-semibold text-[#0365f2] disabled:opacity-60">
        <FiBookmark className={isSaved ? "fill-current" : ""} />
        {isSaving ? "Saving..." : isSaved ? "Saved in My Library" : "Add title to My Library"}
      </button>

      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}
    </>
  );
}
