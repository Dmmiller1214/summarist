"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { AiFillAudio, AiFillBulb, AiFillFileText } from "react-icons/ai";
import { BiCrown } from "react-icons/bi";
import { BsStarFill, BsStarHalf } from "react-icons/bs";
import { RiLeafLine } from "react-icons/ri";
import AuthModal from "@/components/AuthModal";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

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
    <main className="min-h-screen bg-white text-[#032b41]">
      <nav className="h-20">
        <div className="mx-auto flex h-full w-full max-w-[1070px] items-center justify-between px-6">
          <Image
            src="/assets/logo.png"
            alt="Summarist logo"
            width={200}
            height={46}
            priority
          />

          <ul className="flex gap-6">
            <li>
              <button
                onClick={handleAuthButtonClick}
                className="cursor-pointer transition-colors hover:text-[#2bd97c]"
              >
                {currentUser ? "Logout" : "Login"}
              </button>
            </li>
            <li className="hidden cursor-not-allowed sm:block">About</li>
            <li className="hidden cursor-not-allowed sm:block">Contact</li>
            <li className="hidden cursor-not-allowed sm:block">Help</li>
          </ul>
        </div>
      </nav>

      <section className="py-10">
        <div className="mx-auto w-full max-w-[1070px] px-6">
          <div className="flex items-center">
            <div className="w-full text-center md:text-left">
              <h1 className="mb-6 text-3xl font-bold md:text-[40px] md:leading-tight">
                Gain more knowledge
                <br />
                in less time
              </h1>

              <p className="mb-6 text-lg leading-7 font-light text-[#394547] md:text-xl">
                Great summaries for busy people,
                <br className="hidden md:block" />
                individuals who barely have time to read,
                <br className="hidden md:block" />
                and even people who don&apos;t like to read.
              </p>

              <button
                onClick={handleAuthButtonClick}
                className="h-10 w-full max-w-[300px] rounded-sm bg-[#2bd97c] text-base text-[#032b41] transition-colors hover:bg-[#20ba68] active:translate-y-px"
              >
                {currentUser ? "Logout" : "Login"}
              </button>
            </div>

            <div className="hidden w-full justify-end md:flex">
              <Image
                src="/assets/landing.png"
                alt="Person learning with Summarist"
                width={400}
                height={380}
                className="h-auto w-full max-w-[400px]"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto w-full max-w-[1070px] px-6">
          <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
            Understand books in few minutes
          </h2>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            <article className="flex flex-col items-center text-center">
              <AiFillFileText
                className="mb-2 h-12 w-12 md:h-15 md:w-15"
                aria-hidden="true"
              />

              <h3 className="mb-4 text-xl font-medium md:text-2xl">
                Read or listen
              </h3>

              <p className="text-sm font-light text-[#394547] md:text-lg">
                Save time by getting the core ideas from the best books.
              </p>
            </article>

            <article className="flex flex-col items-center text-center">
              <AiFillBulb
                className="mb-2 h-12 w-12 md:h-15 md:w-15"
                aria-hidden="true"
              />

              <h3 className="mb-4 text-xl font-medium md:text-2xl">
                Find your next read
              </h3>

              <p className="text-sm font-light text-[#394547] md:text-lg">
                Explore book lists and personalized recommendations.
              </p>
            </article>

            <article className="flex flex-col items-center text-center">
              <AiFillAudio
                className="mb-2 h-12 w-12 md:h-15 md:w-15"
                aria-hidden="true"
              />

              <h3 className="mb-4 text-xl font-medium md:text-2xl">
                Briefcasts
              </h3>

              <p className="text-sm font-light text-[#394547] md:text-lg">
                Gain valuable insights from briefcasts.
              </p>
            </article>
          </div>

          <div className="mt-24 flex flex-col gap-8 md:flex-row md:gap-20">
            <div className="flex w-full flex-col justify-center">
              <p className="mb-4 text-2xl font-medium text-[#2bd97c] md:text-3xl">
                Enhance your knowledge
              </p>
              <p className="mb-4 text-2xl font-medium text-[#6b757b] md:text-3xl">
                Achieve greater success
              </p>
              <p className="mb-4 text-2xl font-medium text-[#6b757b] md:text-3xl">
                Improve your health
              </p>
              <p className="mb-4 text-2xl font-medium text-[#6b757b] md:text-3xl">
                Develop better parenting skills
              </p>
              <p className="mb-4 text-2xl font-medium text-[#6b757b] md:text-3xl">
                Increase happiness
              </p>
              <p className="text-2xl font-medium text-[#6b757b] md:text-3xl">
                Be the best version of yourself!
              </p>
            </div>

            <div className="flex w-full flex-col justify-center gap-6 bg-[#f1f6f4] px-6 py-10">
              <div className="flex gap-4">
                <p className="mt-1 text-xl font-semibold text-[#0365f2]">93%</p>
                <p className="text-base font-light text-[#394547] md:text-xl">
                  of Summarist members{" "}
                  <strong className="font-bold">significantly increase</strong>{" "}
                  reading frequency.
                </p>
              </div>

              <div className="flex gap-4">
                <p className="mt-1 text-xl font-semibold text-[#0365f2]">96%</p>
                <p className="text-base font-light text-[#394547] md:text-xl">
                  of Summarist members{" "}
                  <strong className="font-bold">establish better</strong>{" "}
                  habits.
                </p>
              </div>

              <div className="flex gap-4">
                <p className="mt-1 text-xl font-semibold text-[#0365f2]">90%</p>
                <p className="text-base font-light text-[#394547] md:text-xl">
                  have made{" "}
                  <strong className="font-bold">significant positive</strong>{" "}
                  change to their lives.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-24 flex flex-col gap-8 md:flex-row md:gap-20">
            <div className="order-2 flex w-full flex-col justify-center gap-6 bg-[#f1f6f4] px-6 py-10 md:order-1">
              <div className="flex gap-4">
                <p className="mt-1 text-xl font-semibold text-[#0365f2]">91%</p>
                <p className="text-base font-light text-[#394547] md:text-xl">
                  of Summarist members{" "}
                  <strong className="font-bold">
                    report feeling more productive
                  </strong>{" "}
                  after incorporating the service into their daily routine.
                </p>
              </div>

              <div className="flex gap-4">
                <p className="mt-1 text-xl font-semibold text-[#0365f2]">94%</p>
                <p className="text-base font-light text-[#394547] md:text-xl">
                  of Summarist members have{" "}
                  <strong className="font-bold">noticed an improvement</strong>{" "}
                  in their overall comprehension and retention of information.
                </p>
              </div>

              <div className="flex gap-4">
                <p className="mt-1 text-xl font-semibold text-[#0365f2]">88%</p>
                <p className="text-base font-light text-[#394547] md:text-xl">
                  of Summarist members{" "}
                  <strong className="font-bold">feel more informed</strong>{" "}
                  about current events and industry trends since using the
                  platform.
                </p>
              </div>
            </div>

            <div className="order-1 flex w-full flex-col justify-center md:order-2 md:items-end md:text-right">
              <p className="mb-4 text-2xl font-medium text-[#2bd97c] md:text-3xl">
                Expand your learning
              </p>
              <p className="mb-4 text-2xl font-medium text-[#6b757b] md:text-3xl">
                Accomplish your goals
              </p>
              <p className="mb-4 text-2xl font-medium text-[#6b757b] md:text-3xl">
                Strengthen your vitality
              </p>
              <p className="mb-4 text-2xl font-medium text-[#6b757b] md:text-3xl">
                Become a better caregiver
              </p>
              <p className="mb-4 text-2xl font-medium text-[#6b757b] md:text-3xl">
                Improve your mood
              </p>
              <p className="text-2xl font-medium text-[#6b757b] md:text-3xl">
                Maximize your abilities
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto w-full max-w-[1070px] px-6">
          <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
            What our members say
          </h2>

          <div className="mx-auto max-w-[600px]">
            <article className="mb-8 rounded-sm bg-[#fff3d7] p-4">
              <div className="mb-2 flex items-center gap-2">
                <h3>Hanna M.</h3>
                <BsStarFill
                  className="h-4 w-4 fill-[#0564f1]"
                  aria-label="Five-star review"
                />
              </div>

              <p className="leading-[1.4] font-light tracking-[0.3px] text-[#394547]">
                This app has been a{" "}
                <strong className="font-bold">game-changer</strong> for me!
                It&apos;s saved me so much time and effort in reading and
                comprehending books. Highly recommend it to all book lovers.
              </p>
            </article>

            <article className="mb-8 rounded-sm bg-[#fff3d7] p-4">
              <div className="mb-2 flex items-center gap-2">
                <h3>David B.</h3>
                <BsStarFill
                  className="h-4 w-4 fill-[#0564f1]"
                  aria-label="Five-star review"
                />
              </div>

              <p className="leading-[1.4] font-light tracking-[0.3px] text-[#394547]">
                I love this app! It provides{" "}
                <strong className="font-bold">
                  concise and accurate summaries
                </strong>{" "}
                of books in a way that is easy to understand. It&apos;s also
                very user-friendly and intuitive.
              </p>
            </article>

            <article className="mb-8 rounded-sm bg-[#fff3d7] p-4">
              <div className="mb-2 flex items-center gap-2">
                <h3>Nathan S.</h3>
                <BsStarFill
                  className="h-4 w-4 fill-[#0564f1]"
                  aria-label="Five-star review"
                />
              </div>

              <p className="leading-[1.4] font-light tracking-[0.3px] text-[#394547]">
                This app is a great way to get the main takeaways from a book
                without having to read the entire thing.{" "}
                <strong className="font-bold">
                  The summaries are well-written and informative.
                </strong>{" "}
                Definitely worth downloading.
              </p>
            </article>

            <article className="mb-8 rounded-sm bg-[#fff3d7] p-4">
              <div className="mb-2 flex items-center gap-2">
                <h3>Ryan R.</h3>
                <BsStarFill
                  className="h-4 w-4 fill-[#0564f1]"
                  aria-label="Five-star review"
                />
              </div>

              <p className="leading-[1.4] font-light tracking-[0.3px] text-[#394547]">
                If you&apos;re a busy person who{" "}
                <strong className="font-bold">
                  loves reading but doesn&apos;t have the time
                </strong>{" "}
                to read every book in full, this app is for you! The summaries
                are thorough and provide a great overview of the book&apos;s
                content.
              </p>
            </article>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleAuthButtonClick}
              className="h-10 w-full max-w-[300px] rounded-sm bg-[#2bd97c] text-base text-[#032b41] transition-colors hover:bg-[#20ba68] active:translate-y-px"
            >
              {currentUser ? "Logout" : "Login"}
            </button>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto w-full max-w-[1070px] px-6">
          <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
            Start growing with Summarist now
          </h2>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            <article className="flex flex-col items-center rounded-xl bg-[#d7e9ff] px-6 pt-6 pb-10 text-center">
              <div className="flex h-15 items-center">
                <BiCrown
                  className="h-12 w-12 text-[#0365f2]"
                  aria-hidden="true"
                />
              </div>

              <h3 className="mb-4 text-4xl font-semibold md:text-[40px]">
                3 Million
              </h3>

              <p className="font-light text-[#394547]">
                Downloads on all platforms
              </p>
            </article>

            <article className="flex flex-col items-center rounded-xl bg-[#d7e9ff] px-6 pt-6 pb-10 text-center">
              <div
                className="flex h-15 items-center gap-1 text-[#0365f2]"
                aria-label="Four and a half stars"
              >
                <BsStarFill className="h-5 w-5" aria-hidden="true" />
                <BsStarHalf className="h-5 w-5" aria-hidden="true" />
              </div>

              <h3 className="mb-4 text-4xl font-semibold md:text-[40px]">
                4.5 Stars
              </h3>

              <p className="font-light text-[#394547]">
                Average ratings on iOS and Google Play
              </p>
            </article>

            <article className="flex flex-col items-center rounded-xl bg-[#d7e9ff] px-6 pt-6 pb-10 text-center">
              <div className="flex h-15 items-center">
                <RiLeafLine
                  className="h-12 w-12 text-[#0365f2]"
                  aria-hidden="true"
                />
              </div>

              <h3 className="mb-4 text-4xl font-semibold md:text-[40px]">
                97%
              </h3>

              <p className="font-light text-[#394547]">
                Of Summarist members create a better reading habit
              </p>
            </article>
          </div>
        </div>
      </section>

      <footer className="mt-10 bg-[#f1f6f4] py-10">
        <div className="mx-auto w-full max-w-[1070px] px-6">
          <div className="my-8 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <h2 className="mb-4 text-lg font-semibold">Actions</h2>
              <ul className="space-y-3 text-sm text-[#394547]">
                <li className="cursor-not-allowed">Summarist Magazine</li>
                <li className="cursor-not-allowed">Cancel Subscription</li>
                <li className="cursor-not-allowed">Help</li>
                <li className="cursor-not-allowed">Contact us</li>
              </ul>
            </div>

            <div>
              <h2 className="mb-4 text-lg font-semibold">Useful Links</h2>
              <ul className="space-y-3 text-sm text-[#394547]">
                <li className="cursor-not-allowed">Pricing</li>
                <li className="cursor-not-allowed">Summarist Business</li>
                <li className="cursor-not-allowed">Gift Cards</li>
                <li className="cursor-not-allowed">Authors &amp; Publishers</li>
              </ul>
            </div>

            <div>
              <h2 className="mb-4 text-lg font-semibold">Company</h2>
              <ul className="space-y-3 text-sm text-[#394547]">
                <li className="cursor-not-allowed">About</li>
                <li className="cursor-not-allowed">Careers</li>
                <li className="cursor-not-allowed">Partners</li>
                <li className="cursor-not-allowed">Code of Conduct</li>
              </ul>
            </div>

            <div>
              <h2 className="mb-4 text-lg font-semibold">Other</h2>
              <ul className="space-y-3 text-sm text-[#394547]">
                <li className="cursor-not-allowed">Sitemap</li>
                <li className="cursor-not-allowed">Legal Notice</li>
                <li className="cursor-not-allowed">Terms of Service</li>
                <li className="cursor-not-allowed">Privacy Policies</li>
              </ul>
            </div>
          </div>

          <p className="text-center font-medium">
            Copyright &copy; 2023 Summarist.
          </p>
        </div>
      </footer>

      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}
    </main>
  );
}
