import SearchBar from "@/components/SearchBar";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import type { Book } from "@/types/book";
import BookCard from "@/components/BookCard";

const SELECTED_BOOK_API =
  "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected";
const RECOMMENDED_BOOKS_API =
  "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended";
  const SUGGESTED_BOOKS_API =
  "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested";

async function getSelectedBook(): Promise<Book> {
  const response = await fetch(SELECTED_BOOK_API, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to retrieve the selected book.");
  }

  const books: Book[] = await response.json();
  const selectedBook = books[0];

  if (!selectedBook) {
    throw new Error("The selected book was not found.");
  }

  return selectedBook;
}

async function getRecommendedBooks(): Promise<Book[]> {
  const response = await fetch(RECOMMENDED_BOOKS_API, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to retrieve recommended books.");
  }

  return response.json();
}
async function getSuggestedBooks(): Promise<Book[]> {
  const response = await fetch(SUGGESTED_BOOKS_API, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to retrieve suggested books.");
  }

  return response.json();
}

export default async function ForYouPage() {
     const [selectedBook, recommendedBooks, suggestedBooks] =
    await Promise.all([
      getSelectedBook(),
      getRecommendedBooks(),
      getSuggestedBooks(),
    ]);

  return (
    <>
      <Sidebar />

      <div className="md:ml-60">
        <SearchBar />

        <main className="min-h-[calc(100vh-80px)] bg-white px-6 py-12 text-[#032b41]">
          <div className="mx-auto w-full max-w-[1070px]">
            <h1 className="text-3xl font-bold">For You</h1>

            <section className="mt-10">
              <p className="mb-4 text-sm font-semibold text-[#6b757b]">
                SELECTED JUST FOR YOU
              </p>

              <article className="flex flex-col gap-6 rounded-lg bg-[#f1f6f4] p-6 sm:flex-row sm:items-center">
                <Image
                  src={selectedBook.imageLink}
                  alt={`Cover of ${selectedBook.title}`}
                  width={140}
                  height={210}
                  className="h-[210px] w-[140px] rounded object-cover"
                  priority
                />

                <div>
                  <h2 className="text-2xl font-semibold">
                    {selectedBook.title}
                  </h2>

                  <p className="mt-2 text-[#394547]">{selectedBook.author}</p>

                  <p className="mt-4 max-w-2xl leading-7 text-[#6b757b]">
                    {selectedBook.subTitle}
                  </p>
                </div>
              </article>
            </section>
                        <section className="mt-12">
              <h2 className="mb-1 text-2xl font-bold">
                Recommended For You
              </h2>

              <p className="mb-6 text-[#6b757b]">
                We think you&apos;ll like these
              </p>

              <div className="flex gap-5 overflow-x-auto pb-4">
                {recommendedBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </section>
                        <section className="mt-12">
              <h2 className="mb-1 text-2xl font-bold">
                Suggested Books
              </h2>

              <p className="mb-6 text-[#6b757b]">
                Browse books that may interest you
              </p>

              <div className="flex gap-5 overflow-x-auto pb-4">
                {suggestedBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
