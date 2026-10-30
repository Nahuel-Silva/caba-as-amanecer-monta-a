import type { Review } from "@/content/reviews";

export type NewReview = {
  author: string;
  rating: number;
  title: string;
  quote: string;
};

/**
 * Mock del envío de reseñas: no guarda nada y la reseña se pierde al recargar la página.
 * Cuando haya base de datos, reemplazar solo esta función por la llamada al servidor,
 * que debe guardar la reseña como pendiente hasta que el propietario la apruebe.
 */
export async function submitReview(review: NewReview): Promise<Review> {
  return {
    ...review,
    date: new Intl.DateTimeFormat("es-AR", { month: "long", year: "numeric" }).format(new Date()),
  };
}
