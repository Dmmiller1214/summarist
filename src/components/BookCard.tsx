import Image from "next/image";
import Link from "next/link";
import { AiFillStar } from "react-icons/ai";
import AudioDuration from "@/components/AudioDuration";
import type { Book } from "@/types/book";

type BookCardProps = {
  book: Book;
};

export default function BookCard({ book }: BookCardProps) {
  return (
    <Link
      href={`/book/${book.id}`}
      className="group relative block w-[180px] shrink-0"
    >
      <div className="relative mb-3 h-[270px] overflow-hidden rounded bg-[#f1f6f4]">
        <Image
          src={book.imageLink}
          alt={`Cover of ${book.title}`}
          fill
          sizes="180px"
          className="object-cover transition-transform group-hover:scale-105"
        />

        {book.subscriptionRequired && (
          <span className="absolute top-2 right-2 rounded-full bg-[#032b41] px-2 py-1 text-xs font-semibold text-white">
            Premium
          </span>
        )}
      </div>

      <h3 className="line-clamp-2 font-semibold text-[#032b41]">
        {book.title}
      </h3>

      <p className="mt-1 text-sm text-[#6b757b]">{book.author}</p>

      <p className="mt-2 line-clamp-2 text-sm text-[#394547]">
        {book.subTitle}
      </p>

      <div className="mt-2 flex items-center gap-4 text-sm text-[#6b757b]">
        <span className="flex items-center gap-1">
          <AiFillStar
            className="h-4 w-4 fill-[#0365f2]"
            aria-hidden="true"
          />
          <span>{book.averageRating}</span>
        </span>
        <AudioDuration src={book.audioLink} />
      </div>
    </Link>
  );
}
