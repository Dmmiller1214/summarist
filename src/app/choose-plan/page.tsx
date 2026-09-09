"use client";
import { auth } from "@/lib/firebase";
import { useState } from "react";
import { FiBookOpen, FiChevronDown, FiHeadphones, FiZap } from "react-icons/fi";

type Plan = "annual" | "monthly";
const FAQS = [
  {
    question: "How does the free trial work?",
    answer:
      "Choose the annual plan to receive seven days of access before your first yearly payment.",
  },
  {
    question: "Can I cancel my subscription?",
    answer:
      "Yes. You can cancel your subscription at any time from your account settings.",
  },
  {
    question: "What do I get with Premium?",
    answer:
      "Premium gives you access to the complete library of text and audio book summaries.",
  },
  {
    question: "Can I switch plans later?",
    answer:
      "Yes. You can change your subscription plan when managing your account.",
  },
];

export default function ChoosePlanPage() {
  const [selectedPlan, setSelectedPlan] = useState<Plan>("annual");
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  async function handleCheckout() {
    setCheckoutError("");
    setIsCheckingOut(true);

    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error("Please log in before choosing a plan.");
      }

      const idToken = await currentUser.getIdToken();

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          plan: selectedPlan,
        }),
      });

      const data = (await response.json()) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Unable to start checkout.");
      }

      setIsCheckingOut(false);
      window.location.assign(data.url);
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : "Unable to start checkout.",
      );
      setIsCheckingOut(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-[#032b41]">
      <section className="bg-[#032b41] px-6 py-16 text-white">
        <div className="mx-auto w-full max-w-[900px] text-center">
          <p className="font-semibold text-[#2bd97c]">SUMMARIST PREMIUM</p>

          <h1 className="mt-4 text-4xl font-bold md:text-5xl">
            Get unlimited access to every book
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Turn the world&apos;s best books into powerful ideas you can
            understand in minutes.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center">
              <FiBookOpen
                className="h-10 w-10 text-[#2bd97c]"
                aria-hidden="true"
              />
              <h2 className="mt-4 text-lg font-semibold">
                Unlimited summaries
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                Read every title in our growing library.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <FiHeadphones
                className="h-10 w-10 text-[#2bd97c]"
                aria-hidden="true"
              />
              <h2 className="mt-4 text-lg font-semibold">Listen anywhere</h2>
              <p className="mt-2 text-sm text-slate-300">
                Learn from audio summaries at your own pace.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <FiZap className="h-10 w-10 text-[#2bd97c]" aria-hidden="true" />
              <h2 className="mt-4 text-lg font-semibold">Learn faster</h2>
              <p className="mt-2 text-sm text-slate-300">
                Understand the key ideas without reading for hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="mx-auto w-full max-w-[600px]">
          <h2 className="text-center text-3xl font-bold">
            Choose the plan that fits you
          </h2>

          <div className="mt-8 space-y-4">
            <label
              className={`block cursor-pointer rounded-lg border-2 p-5 transition-colors ${
                selectedPlan === "annual"
                  ? "border-[#2bd97c] bg-[#f1f6f4]"
                  : "border-[#e1e7ea]"
              }`}
            >
              <input
                type="radio"
                name="subscription-plan"
                value="annual"
                checked={selectedPlan === "annual"}
                onChange={() => setSelectedPlan("annual")}
                className="sr-only"
              />

              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-semibold">Annual</h3>
                    <span className="rounded-full bg-[#2bd97c] px-3 py-1 text-xs font-bold">
                      7-DAY FREE TRIAL
                    </span>
                  </div>

                  <p className="mt-2 text-[#6b757b]">
                    Best value for committed readers
                  </p>
                </div>

                <p className="text-right text-xl font-bold">
                  $99.99
                  <span className="block text-sm font-normal text-[#6b757b]">
                    per year
                  </span>
                </p>
              </div>
            </label>

            <label
              className={`block cursor-pointer rounded-lg border-2 p-5 transition-colors ${
                selectedPlan === "monthly"
                  ? "border-[#2bd97c] bg-[#f1f6f4]"
                  : "border-[#e1e7ea]"
              }`}
            >
              <input
                type="radio"
                name="subscription-plan"
                value="monthly"
                checked={selectedPlan === "monthly"}
                onChange={() => setSelectedPlan("monthly")}
                className="sr-only"
              />

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">Monthly</h3>
                  <p className="mt-2 text-[#6b757b]">
                    Flexible month-to-month access
                  </p>
                </div>

                <p className="text-right text-xl font-bold">
                  $9.99
                  <span className="block text-sm font-normal text-[#6b757b]">
                    per month
                  </span>
                </p>
              </div>
            </label>
          </div>

          {checkoutError && (
            <p className="mt-6 text-center text-sm text-red-600" role="alert">
              {checkoutError}
            </p>
          )}

          <button
            type="button"
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="mt-6 h-12 w-full rounded bg-[#2bd97c] text-lg font-semibold transition-colors hover:bg-[#20ba68] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCheckingOut
              ? "Opening secure checkout..."
              : selectedPlan === "annual"
                ? "Start your 7-day free trial"
                : "Get monthly access"}
          </button>

          <p className="mt-4 text-center text-sm text-[#6b757b]">
            Cancel anytime.
          </p>
        </div>
      </section>

      <section className="bg-[#f7faf9] px-6 py-14">
        <div className="mx-auto w-full max-w-[700px]">
          <h2 className="text-center text-3xl font-bold">
            Frequently asked questions
          </h2>

          <div className="mt-8 divide-y divide-[#d2dcda] border-y border-[#d2dcda]">
            {FAQS.map((faq) => {
              const isOpen = openQuestion === faq.question;

              return (
                <div key={faq.question}>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenQuestion(isOpen ? null : faq.question)
                    }
                    className="flex w-full items-center justify-between gap-4 py-5 text-left text-lg font-semibold"
                    aria-expanded={isOpen}
                  >
                    {faq.question}

                    <FiChevronDown
                      className={`h-5 w-5 shrink-0 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {isOpen && (
                    <p className="pb-5 leading-7 text-[#394547]">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
