import { PENDING } from "@/content/site";

export type Faq = {
  question: string;
  /** Respuesta aprobada por el propietario. Mientras no esté confirmada, queda como PENDIENTE. */
  answer: string;
};

export const faqs: Faq[] = [
  { question: "¿Cómo consultar disponibilidad?", answer: PENDING },
  { question: "¿Cuáles son los medios de pago?", answer: PENDING },
  { question: "¿Cuáles son los horarios de ingreso y salida?", answer: PENDING },
  { question: "¿Se aceptan mascotas?", answer: PENDING },
];
