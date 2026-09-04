"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FiBookOpen, FiHeadphones } from "react-icons/fi";
import AuthModal from "@/components/AuthModal";
import { auth } from "@/lib/firebase";

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

  useEffect(() => {
    const stopListening = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthReady(true);
    });

    return stopListening;
  }, []);

  function openBook() {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    if (subscriptionRequired) {
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

      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}
    </>
  );
}