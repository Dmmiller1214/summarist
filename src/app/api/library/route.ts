import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import type { Book } from "@/types/book";

async function getUser(request: Request) {
  const authorization = request.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) return null;
  try { return await adminAuth.verifyIdToken(authorization.slice(7)); } catch { return null; }
}

export async function GET(request: Request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: "You must be logged in." }, { status: 401 });
  const bookId = new URL(request.url).searchParams.get("bookId");
  const savedBooks = adminDb.collection("users").doc(user.uid).collection("savedBooks");
  if (bookId) return Response.json({ saved: (await savedBooks.doc(bookId).get()).exists });
  const snapshot = await savedBooks.orderBy("savedAt", "desc").get();
  return Response.json({ books: snapshot.docs.map((document) => document.data()) });
}

export async function POST(request: Request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: "You must be logged in." }, { status: 401 });
  const { bookId } = (await request.json()) as { bookId?: string };
  if (!bookId) return Response.json({ error: "A book is required." }, { status: 400 });
  const response = await fetch(`https://us-central1-summaristt.cloudfunctions.net/getBook?id=${encodeURIComponent(bookId)}`);
  if (!response.ok) return Response.json({ error: "Book not found." }, { status: 404 });
  const book = (await response.json()) as Book;
  await adminDb.collection("users").doc(user.uid).collection("savedBooks").doc(book.id).set({ ...book, savedAt: FieldValue.serverTimestamp() });
  return Response.json({ saved: true });
}

export async function DELETE(request: Request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: "You must be logged in." }, { status: 401 });
  const bookId = new URL(request.url).searchParams.get("bookId");
  if (!bookId) return Response.json({ error: "A book is required." }, { status: 400 });
  await adminDb.collection("users").doc(user.uid).collection("savedBooks").doc(bookId).delete();
  return Response.json({ saved: false });
}
