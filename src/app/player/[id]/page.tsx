import Image from "next/image";
import { notFound } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import type { Book } from "@/types/book";

type PlayerPageProps = {
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

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { id } = await params;
  const book = await getBook(id);

  return (
    <>
      <Sidebar />

      <div className="md:ml-60">
        <SearchBar />

        <main className="min-h-[calc(100vh-80px)] bg-white px-6 py-12 text-[#032b41]">
          <div className="mx-auto w-full max-w-[900px]">
            <header className="flex flex-col items-center gap-6 border-b border-[#e1e7ea] pb-8 text-center sm:flex-row sm:text-left">
              <Image
                src={book.imageLink}
                alt={`Cover of ${book.title}`}
                width={120}
                height={180}
                className="h-[180px] w-[120px] rounded object-cover shadow"
                priority
              />

              <div>
                <p className="text-sm font-semibold text-[#6b757b]">
                  AUDIO SUMMARY
                </p>

                <h1 className="mt-2 text-3xl font-bold">{book.title}</h1>

                <p className="mt-2 text-[#394547]">by {book.author}</p>
              </div>
            </header>

            <section className="mt-8">
              <h2 className="text-2xl font-bold">Audio</h2>

              <audio
                controls
                preload="metadata"
                className="mt-4 w-full"
              >
                <source src={book.audioLink} type="audio/mpeg" />
                Your browser does not support audio playback.
              </audio>
            </section>

            <section className="mt-10">
              <h2 className="text-2xl font-bold">Summary</h2>

              <p className="mt-5 whitespace-pre-line leading-8 text-[#394547]">
                {book.summary}
              </p>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}