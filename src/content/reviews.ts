export type Review = {
  title: string;
  /** Frase textual de la opinión publicada. */
  quote: string;
  /** Nombre abreviado del huésped, para no publicar su apellido completo. */
  author: string;
  /** Mes de la opinión, AAAA-MM. Se muestra como "enero de 2026" en el idioma de la página. */
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
/** Trip.com no se muestra: repite los mismos comentarios de Booking (9.1 con 34 comentarios en ambos). */
const bookingUrl = "https://www.booking.com/hotel/ar/cabanas-amanecer-de-montana.es-ar.html";
/** Ficha de las cabañas en Google (identificador fijo de Google, no cambia aunque cambie el nombre). */
const googleUrl = "https://www.google.com/search?kgmid=/g/11t26z4ps_";

/** Mes en que se consultaron los puntajes (AAAA-MM). Actualizalo cuando los revises. */
export const ratingsCheckedAt = "2026-11";

// Cargar solo opiniones reales, copiadas tal cual y con su fuente. Nunca inventar ni modificar reseñas.
export const ratingSummaries: RatingSummary[] = [
  { score: "5.0 / 5", count: 34, sourceName: "Google", sourceUrl: googleUrl },
  { score: "5.0 / 5", count: 3, sourceName: "Welcome Argentina", sourceUrl: welcomeArgentinaUrl },
  { score: "9.1 / 10", count: 34, sourceName: "Booking.com", sourceUrl: bookingUrl },
];

export const reviews: Review[] = [
  {
    title: "La ubicación es excelente",
    quote: "El lugar es increíble, una paz que no se puede describir!",
    author: "Walter D.",
    date: "2026-01",
    rating: 5,
    sourceName: "Welcome Argentina",
    sourceUrl: welcomeArgentinaUrl,
  },
  {
    title: "Excelente alojamiento!",
    quote: "Las cabañas son espaciosas y están muy bien equipadas.",
    author: "Diego D.",
    date: "2026-01",
    rating: 5,
    sourceName: "Welcome Argentina",
    sourceUrl: welcomeArgentinaUrl,
  },
  {
    title: "Excelente lugar para descansar",
    quote: "Las cabañas muy bien equipadas y amplias.",
    author: "Heraldo B.",
    date: "2025-03",
    rating: 5,
    sourceName: "Welcome Argentina",
    sourceUrl: welcomeArgentinaUrl,
  },
];
