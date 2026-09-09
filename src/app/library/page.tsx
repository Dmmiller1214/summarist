"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import AuthModal from "@/components/AuthModal";
import BookCard from "@/components/BookCard";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import { auth } from "@/lib/firebase";
import type { Book } from "@/types/book";

export default function LibraryPage() {
  const [user, setUser] = useState<User | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => onAuthStateChanged(auth, async (currentUser) => {
    setUser(currentUser);
    if (currentUser) {
      const token = await currentUser.getIdToken();
      const response = await fetch("/api/library", { headers: { Authorization: `Bearer ${token}` } });
      if (response.ok) setBooks(((await response.json()) as { books: Book[] }).books);
    }
    setIsLoading(false);
  }), []);

  return <><Sidebar /><div className="md:ml-60"><SearchBar /><main className="min-h-[calc(100vh-80px)] px-6 py-12 text-[#032b41]"><div className="mx-auto max-w-[1070px]"><h1 className="text-3xl font-bold">My Library</h1><h2 className="mt-10 text-2xl font-bold">Saved Books</h2>
    {isLoading ? <div className="mt-6 h-[270px] w-[180px] animate-pulse rounded bg-[#e1e7ea]" /> : !user ? <div className="mt-6"><p>Log in to view your saved books.</p><button onClick={() => setShowLogin(true)} className="mt-4 rounded bg-[#2bd97c] px-6 py-3 font-semibold">Login</button></div> : books.length ? <div className="mt-6 flex flex-wrap gap-6">{books.map((book) => <BookCard key={book.id} book={book} />)}</div> : <p className="mt-6 text-[#6b757b]">You have no saved books yet.</p>}
  </div></main></div>{showLogin && <AuthModal onClose={() => setShowLogin(false)} />}</>;
}
