import { FiSearch } from "react-icons/fi";

export default function SearchBar() {
  return (
    <header className="border-b border-[#e1e7ea] bg-white">
      <div className="mx-auto flex h-20 w-full max-w-[1070px] items-center justify-end px-6">
        <div className="relative w-full max-w-[340px]">
          <label htmlFor="book-search" className="sr-only">
            Search books by title or author
          </label>

          <input
            id="book-search"
            type="search"
            placeholder="Search for books"
            className="h-10 w-full rounded-md border border-[#e1e7ea] bg-[#f7faf9] pr-11 pl-4 text-[#032b41] outline-none transition-colors placeholder:text-[#6b757b] focus:border-[#2bd97c]"
          />

          <FiSearch
            className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-[#6b757b]"
            aria-hidden="true"
          />
        </div>
      </div>
    </header>
  );
}