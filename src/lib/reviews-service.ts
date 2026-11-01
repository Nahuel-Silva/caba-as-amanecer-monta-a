import type { Review } from "@/content/reviews";

export type ReviewForm = { author: string; rating: number; title: string; quote: string; consent: boolean; hp_token: string };

/** Envía una reseña. Se publica sola, salvo que tenga insultos o enlaces. */
export async function submitReview(review: ReviewForm): Promise<{ ok: boolean; published?: boolean; error?: string }> {
  try {
    const response = await fetch("/api/resenas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review),
    });
    return (await response.json()) as { ok: boolean; published?: boolean; error?: string };
  } catch {
    return { ok: false, error: "No pudimos enviar tu reseña. Revisá tu conexión y probá de nuevo." };
  }
}

export async function getApprovedReviews(): Promise<Review[]> {
  try {
    const response = await fetch("/api/resenas");
    if (!response.ok) return [];
    const { reviews } = (await response.json()) as { reviews: Review[] };
    return reviews;
  } catch {
    return [];
  }
}
