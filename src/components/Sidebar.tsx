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
  FiMenu,
  FiSearch,
  FiSettings,
  FiX,
} from "react-icons/fi";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { usePathname } from "next/navigation";

import { auth } from "@/lib/firebase";
import AuthModal from "@/components/AuthModal";

export default function Sidebar() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      <button type="button" onClick={() => setIsMenuOpen(true)} aria-label="Open navigation menu" className="fixed top-5 left-4 z-40 flex h-10 w-10 items-center justify-center rounded bg-white shadow md:hidden"><FiMenu className="h-6 w-6" /></button>
      {isMenuOpen && <button type="button" aria-label="Close navigation menu" onClick={() => setIsMenuOpen(false)} className="fixed inset-0 z-40 bg-black/40 md:hidden" />}
      <aside className={`fixed top-0 left-0 z-50 flex h-screen w-60 flex-col border-r border-[#e1e7ea] bg-[#f7faf9] transition-transform md:translate-x-0 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-20 items-center px-5">
          <Image
            src="/assets/logo.png"
            alt="Summarist logo"
            width={160}
            height={37}
            priority
          />
          <button type="button" onClick={() => setIsMenuOpen(false)} aria-label="Close navigation menu" className="ml-auto md:hidden"><FiX className="h-6 w-6" /></button>
        </div>

        <nav className="flex flex-1 flex-col justify-between py-6">
          <ul>
            <li>
              <Link
                href="/for-you"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 border-l-4 px-5 py-4 font-medium ${
                  pathname === "/for-you"
                    ? "border-[#2bd97c] bg-[#eaf9f1]"
                    : "border-transparent text-[#394547] hover:bg-[#eaf9f1]"
                }`}
              >
                <FiHome className="h-6 w-6" aria-hidden="true" />
                For You
              </Link>
            </li>

            <li>
              <Link
                href="/library"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 border-l-4 px-5 py-4 text-[#394547] ${pathname === "/library" ? "border-[#2bd97c] bg-[#eaf9f1] font-medium" : "border-transparent hover:bg-[#eaf9f1]"}`}
              >
                <FiBookOpen className="h-6 w-6" aria-hidden="true" />
                My Library
              </Link>
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
              <Link
                href="/settings"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 border-l-4 px-5 py-4 text-[#394547] ${
                  pathname === "/settings"
                    ? "border-[#2bd97c] bg-[#eaf9f1] font-medium"
                    : "border-transparent hover:bg-[#eaf9f1]"
                }`}
              >
                <FiSettings className="h-6 w-6" aria-hidden="true" />
                Settings
              </Link>
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
