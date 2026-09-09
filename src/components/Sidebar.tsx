"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiBookOpen,
  FiEdit3,
  FiHelpCircle,
  FiHome,
  FiLogOut,
  FiSearch,
  FiSettings,
} from "react-icons/fi";
import { onAuthStateChanged, signOut, User } from "firebase/auth";

import { auth } from "@/lib/firebase";
import AuthModal from "@/components/AuthModal";

export default function Sidebar() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const stopListening = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return stopListening;
  }, []);

  async function handleAuthButtonClick() {
    if (currentUser) {
      await signOut(auth);
    } else {
      setIsAuthModalOpen(true);
    }
  }

  return (
    <>
      <aside className="fixed top-0 left-0 hidden h-screen w-60 flex-col border-r border-[#e1e7ea] bg-[#f7faf9] md:flex">
        <div className="flex h-20 items-center px-5">
          <Image
            src="/assets/logo.png"
            alt="Summarist logo"
            width={160}
            height={37}
            priority
          />
        </div>

        <nav className="flex flex-1 flex-col justify-between py-6">
          <ul>
            <li>
              <Link
                href="/for-you"
                className="flex items-center gap-3 border-l-4 border-[#2bd97c] bg-[#eaf9f1] px-5 py-4 font-medium"
              >
                <FiHome className="h-6 w-6" aria-hidden="true" />
                For You
              </Link>
            </li>

            <li>
              <button
                type="button"
                className="flex w-full cursor-not-allowed items-center gap-3 border-l-4 border-transparent px-5 py-4 text-left text-[#394547]"
              >
                <FiBookOpen className="h-6 w-6" aria-hidden="true" />
                My Library
              </button>
            </li>

            <li>
              <button
                type="button"
                className="flex w-full cursor-not-allowed items-center gap-3 border-l-4 border-transparent px-5 py-4 text-left text-[#394547]"
              >
                <FiEdit3 className="h-6 w-6" aria-hidden="true" />
                Highlights
              </button>
            </li>

            <li>
              <button
                type="button"
                className="flex w-full cursor-not-allowed items-center gap-3 border-l-4 border-transparent px-5 py-4 text-left text-[#394547]"
              >
                <FiSearch className="h-6 w-6" aria-hidden="true" />
                Search
              </button>
            </li>
          </ul>

          <ul>
            <li>
              <button
                type="button"
                className="flex w-full cursor-not-allowed items-center gap-3 border-l-4 border-transparent px-5 py-4 text-left text-[#394547]"
              >
                <FiSettings className="h-6 w-6" aria-hidden="true" />
                Settings
              </button>
            </li>

            <li>
              <button
                type="button"
                className="flex w-full cursor-not-allowed items-center gap-3 border-l-4 border-transparent px-5 py-4 text-left text-[#394547]"
              >
                <FiHelpCircle className="h-6 w-6" aria-hidden="true" />
                Help &amp; Support
              </button>
            </li>

            <li>
              <button
                type="button"
                onClick={handleAuthButtonClick}
                className="flex w-full items-center gap-3 border-l-4 border-transparent px-5 py-4 text-left text-[#394547] hover:bg-[#eaf9f1]"
              >
                <FiLogOut className="h-6 w-6" aria-hidden="true" />
                {currentUser ? "Logout" : "Login"}
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}
    </>
  );
}
