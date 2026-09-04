"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInAnonymously,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

type AuthModalProps = {
  onClose: () => void;
};

export default function AuthModal({ onClose }: AuthModalProps) {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLogin = authMode === "login";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }

      onClose();
      router.push("/for-you");
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (
          error.code === "auth/invalid-credential" ||
          error.code === "auth/user-not-found" ||
          error.code === "auth/wrong-password"
        ) {
          setErrorMessage("The email or password is incorrect.");
        } else if (error.code === "auth/too-many-requests") {
          setErrorMessage(
            "Too many unsuccessful attempts. Please try again later.",
          );
          setErrorMessage("An account already exists with this email.");
        } else if (error.code === "auth/invalid-email") {
          setErrorMessage("Please enter a valid email address.");
        } else if (error.code === "auth/weak-password") {
          setErrorMessage("Your password must contain at least 6 characters.");
        } else {
          setErrorMessage("Unable to create your account. Please try again.");
        }
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }
  async function handleGuestLogin() {
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await signInAnonymously(auth);
      onClose();
      router.push("/for-you");
    } catch {
      setErrorMessage("Unable to log in as a guest. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function switchAuthMode() {
    setAuthMode(isLogin ? "register" : "login");
    setErrorMessage("");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div
        className="relative w-full max-w-[400px] rounded-lg bg-white p-6 text-[#032b41]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-[#6b757b]"
          aria-label="Close authentication window"
        >
          &times;
        </button>

        <h2
          id="auth-modal-title"
          className="mb-6 text-center text-2xl font-bold"
        >
          {isLogin ? "Log in to Summarist" : "Sign up to Summarist"}
        </h2>

        <button
          type="button"
          onClick={handleGuestLogin}
          disabled={isSubmitting}
          className="mb-4 flex h-10 w-full items-center justify-center rounded-sm bg-[#3a579d] text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Please wait..." : "Login as a Guest"}
        </button>

        <button
          type="button"
          className="flex h-10 w-full items-center justify-center gap-3 rounded-sm border border-[#d0d0d0] bg-white text-[#394547]"
        >
          <Image src="/assets/google.png" alt="" width={24} height={24} />
          {isLogin ? "Login with Google" : "Sign up with Google"}
        </button>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#d0d0d0]" />
          <span className="text-sm text-[#6b757b]">or</span>
          <div className="h-px flex-1 bg-[#d0d0d0]" />
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email Address"
            autoComplete="email"
            required
            className="mb-4 h-10 w-full rounded-sm border border-[#d0d0d0] px-3 outline-none focus:border-[#2bd97c]"
          />

          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            required
            minLength={6}
            className="mb-4 h-10 w-full rounded-sm border border-[#d0d0d0] px-3 outline-none focus:border-[#2bd97c]"
          />

          {errorMessage && (
            <p className="mb-4 text-sm text-red-600" role="alert">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-10 w-full rounded-sm bg-[#2bd97c] transition-colors hover:bg-[#20ba68] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Please wait..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <button
          type="button"
          onClick={switchAuthMode}
          className="mt-5 w-full text-center text-sm text-[#0365f2]"
        >
          {isLogin ? "Don't have an account?" : "Already have an account?"}
        </button>
      </div>
    </div>
  );
}
