"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";

type SearchBook = {
  id: string;
  title: string;
  author: string;
  imageLink: string;
};

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState<SearchBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (search.trim().length < 2) {
      return;
    }

    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${encodeURIComponent(
            search.trim(),
          )}`,
        );

        if (!response.ok) {
          throw new Error("Search failed.");
        }

        const results = (await response.json()) as SearchBook[];
        setBooks(results);
      } catch {
        setBooks([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => window.clearTimeout(timer);
  }, [search]);

  const showResults = search.trim().length >= 2;

  return (
    <header className="relative z-30 border-b border-[#e1e7ea] bg-white">
      <div className="mx-auto flex h-20 w-full max-w-[1070px] items-center justify-end px-6">
        <div className="relative w-full max-w-[340px]">
          <label htmlFor="book-search" className="sr-only">
            Search books by title or author
          </label>

          <input
            id="book-search"
            type="search"
            value={search}
            onChange={(event) => {
              const nextSearch = event.target.value;
              setSearch(nextSearch);

              if (nextSearch.trim().length < 2) {
                setBooks([]);
                setIsLoading(false);
              } else {
                setIsLoading(true);
              }
            }}
            placeholder="Search for books"
            autoComplete="off"
            className="h-10 w-full rounded-md border border-[#e1e7ea] bg-[#f7faf9] pr-11 pl-4 text-[#032b41] outline-none transition-colors placeholder:text-[#6b757b] focus:border-[#2bd97c]"
          />

          <FiSearch
            className="pointer-events-none absolute top-5 right-3 h-5 w-5 -translate-y-1/2 text-[#6b757b]"
            aria-hidden="true"
          />

          {showResults && (
            <div className="absolute top-12 right-0 max-h-[420px] w-full overflow-y-auto rounded-md border border-[#e1e7ea] bg-white shadow-lg">
              {isLoading ? (
                <div className="space-y-3 p-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex animate-pulse gap-3">
                      <div className="h-16 w-12 rounded bg-[#e1e7ea]" />
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 rounded bg-[#e1e7ea]" />
                        <div className="h-3 w-2/3 rounded bg-[#e1e7ea]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : books.length > 0 ? (
                books.map((book) => (
                  <Link
                    key={book.id}
                    href={`/book/${book.id}`}
                    onClick={() => setSearch("")}
                    className="flex gap-3 border-b border-[#e1e7ea] p-3 last:border-b-0 hover:bg-[#f7faf9]"
                  >
                    <Image
                      src={book.imageLink}
                      alt={`${book.title} cover`}
                      width={48}
                      height={64}
                      className="h-16 w-12 rounded object-cover"
                    />

                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-[#032b41]">
                        {book.title}
                      </span>
                      <span className="block truncate text-sm text-[#6b757b]">
                        {book.author}
                      </span>
                    </span>
                  </Link>
                ))
              ) : (
                <p className="p-4 text-sm text-[#6b757b]">
                  No books found.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
