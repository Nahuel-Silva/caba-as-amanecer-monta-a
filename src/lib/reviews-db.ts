import type { Review } from "@/content/reviews";
import { getDatabase } from "@/lib/db";

export type ReviewStatus = "pending" | "approved" | "rejected";

export type NewReview = { author: string; rating: number; title: string; quote: string };

export type ReviewRecord = NewReview & { id: number; status: ReviewStatus; createdAt: string };

const fieldLimits = { author: 40, title: 60, quote: 500 };

/** Valida una reseña recibida del formulario. */
export function validateReview(input: Record<string, unknown>): { data: NewReview; error?: undefined } | { data?: undefined; error: string } {
  const clean = (value: unknown) => (typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "");
  const author = clean(input.author);
  const title = clean(input.title);
  const quote = clean(input.quote);
  const rating = Number(input.rating);

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return { error: "Elegí una calificación de 1 a 5 estrellas." };
  if (author.length < 2 || author.length > fieldLimits.author) return { error: "Ingresá tu nombre." };
  if (title.length < 3 || title.length > fieldLimits.title) return { error: "Ingresá un título." };
  if (quote.length < 10 || quote.length > fieldLimits.quote) return { error: "Escribí un comentario de al menos 10 caracteres." };
  if (input.consent !== true) return { error: "Necesitamos tu autorización para publicar la reseña." };

  return { data: { author, rating, title, quote } };
}

/** Lo que parece spam queda como rechazado: no se publica, pero se puede rescatar desde el panel. */
export async function createReview({ author, rating, title, quote }: NewReview, status: ReviewStatus = "pending") {
  const database = await getDatabase();
  await database.execute({
    sql: "INSERT INTO reviews (author, rating, title, quote, status) VALUES (?, ?, ?, ?, ?)",
    args: [author, rating, title, quote, status],
  });
}

export async function listApprovedReviews(): Promise<Review[]> {
  const database = await getDatabase();
  const { rows } = await database.execute("SELECT * FROM reviews WHERE status = 'approved' ORDER BY created_at DESC LIMIT 30");
  const format = new Intl.DateTimeFormat("es-AR", { month: "long", year: "numeric", timeZone: "UTC" });

  return rows.map((row) => ({
    author: String(row.author),
    title: String(row.title),
    quote: String(row.quote),
    rating: Number(row.rating),
    date: format.format(new Date(`${String(row.created_at).replace(" ", "T")}Z`)),
  }));
}

export async function listReviews(): Promise<ReviewRecord[]> {
  const database = await getDatabase();
  const { rows } = await database.execute("SELECT * FROM reviews ORDER BY status = 'pending' DESC, created_at DESC LIMIT 300");
  return rows.map((row) => ({
    id: Number(row.id),
    author: String(row.author),
    title: String(row.title),
    quote: String(row.quote),
    rating: Number(row.rating),
    status: row.status as ReviewStatus,
    createdAt: String(row.created_at),
  }));
}

export async function setReviewStatus(id: number, status: "approved" | "rejected") {
  const database = await getDatabase();
  const { rowsAffected } = await database.execute({ sql: "UPDATE reviews SET status = ? WHERE id = ?", args: [status, id] });
  return rowsAffected === 1;
}
