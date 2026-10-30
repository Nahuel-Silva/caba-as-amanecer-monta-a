export type Review = {
  title: string;
  /** Frase textual de la opinión publicada. */
  quote: string;
  /** Nombre abreviado del huésped, para no publicar su apellido completo. */
  author: string;
  date: string;
  /** Puntaje sobre 5. */
  rating: number;
  sourceName?: string;
  sourceUrl?: string;
};

export type RatingSummary = {
  score: string;
  count: number;
  sourceName: string;
  sourceUrl: string;
};

const welcomeArgentinaUrl = "https://www.welcomeargentina.com/malargue/cabanas-amanecer-de-montana.html";
const tripUrl = "https://uk.trip.com/hotels/malargue-department-hotel-detail-106678289/cabaas-amanecer-de-montaa";

/** Fecha en la que se consultaron los puntajes. Actualizala cuando los revises. */
export const ratingsCheckedAt = "octubre de 2026";

// Cargar solo opiniones reales, copiadas tal cual y con su fuente. Nunca inventar ni modificar reseñas.
export const ratingSummaries: RatingSummary[] = [
  { score: "5.0 / 5", count: 3, sourceName: "Welcome Argentina", sourceUrl: welcomeArgentinaUrl },
  { score: "9.1 / 10", count: 34, sourceName: "Trip.com", sourceUrl: tripUrl },
];

export const reviews: Review[] = [
  {
    title: "La ubicación es excelente",
    quote: "El lugar es increíble, una paz que no se puede describir!",
    author: "Walter D.",
    date: "enero de 2026",
    rating: 5,
    sourceName: "Welcome Argentina",
    sourceUrl: welcomeArgentinaUrl,
  },
  {
    title: "Excelente alojamiento!",
    quote: "Las cabañas son espaciosas y están muy bien equipadas.",
    author: "Diego D.",
    date: "enero de 2026",
    rating: 5,
    sourceName: "Welcome Argentina",
    sourceUrl: welcomeArgentinaUrl,
  },
  {
    title: "Excelente lugar para descansar",
    quote: "Las cabañas muy bien equipadas y amplias.",
    author: "Heraldo B.",
    date: "marzo de 2025",
    rating: 5,
    sourceName: "Welcome Argentina",
    sourceUrl: welcomeArgentinaUrl,
  },
];
