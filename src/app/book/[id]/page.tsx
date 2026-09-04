import Image from "next/image";
import { notFound } from "next/navigation";
import { AiFillStar } from "react-icons/ai";
import { FiBookOpen, FiHeadphones } from "react-icons/fi";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import type { Book } from "@/types/book";
import BookActions from "@/components/BookActions";

type BookPageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function getBook(id: string): Promise<Book> {
  const response = await fetch(
    `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${encodeURIComponent(id)}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    notFound();
  }

  return response.json();
}

export default async function BookPage({ params }: BookPageProps) {
  const { id } = await params;
  const book = await getBook(id);

  return (
    <>
      <Sidebar />

      <div className="md:ml-60">
        <SearchBar />

        <main className="min-h-[calc(100vh-80px)] bg-white px-6 py-12 text-[#032b41]">
          <div className="mx-auto w-full max-w-[1070px]">
            <section className="flex flex-col gap-10 lg:flex-row">
              <div className="flex-1">
                {book.subscriptionRequired && (
                  <span className="mb-4 inline-block rounded-full bg-[#032b41] px-3 py-1 text-sm font-semibold text-white">
                    Premium
                  </span>
                )}

                <h1 className="text-3xl font-bold md:text-4xl">{book.title}</h1>

                <p className="mt-3 text-xl font-medium text-[#394547]">
                  {book.subTitle}
                </p>

                <p className="mt-4 text-[#6b757b]">by {book.author}</p>

                <div className="mt-6 border-y border-[#e1e7ea] py-5">
                  <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                    <div className="flex items-center gap-2">
                      <AiFillStar
                        className="h-5 w-5 fill-[#0365f2]"
                        aria-hidden="true"
                      />
                      <span>{book.averageRating} rating</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FiBookOpen className="h-5 w-5" aria-hidden="true" />
                      <span>{book.keyIdeas} key ideas</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FiHeadphones className="h-5 w-5" aria-hidden="true" />
                      <span>{book.type}</span>
                    </div>
                  </div>
                </div>

                <BookActions
                  bookId={book.id}
                  subscriptionRequired={book.subscriptionRequired}
                />
              </div>

              <div className="flex justify-center lg:w-[300px]">
                <Image
                  src={book.imageLink}
                  alt={`Cover of ${book.title}`}
                  width={250}
                  height={375}
                  className="h-[375px] w-[250px] rounded object-cover shadow-lg"
                  priority
                />
              </div>
            </section>

            <section className="mt-12 max-w-3xl">
              <h2 className="text-2xl font-bold">What&apos;s it about?</h2>
              <p className="mt-4 leading-7 text-[#394547]">
                {book.bookDescription}
              </p>
            </section>

            <section className="mt-12 max-w-3xl">
              <h2 className="text-2xl font-bold">About the author</h2>
              <p className="mt-4 leading-7 text-[#394547]">
                {book.authorDescription}
              </p>
            </section>

            <section className="mt-12 max-w-3xl">
              <h2 className="text-2xl font-bold">Tags</h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {book.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#f1f6f4] px-4 py-2 text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
