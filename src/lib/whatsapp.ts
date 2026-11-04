import { site } from "@/content/site";

/**
 * Única fuente del número de WhatsApp: la variable de entorno
 * NEXT_PUBLIC_WHATSAPP_NUMBER (ver .env.example y README.md).
 * Mientras no esté cargada, los botones de WhatsApp no se muestran
 * y nunca se publica un número inventado.
 */

/** Deja solo dígitos ("+54 9 260 123-4567" -> "542601234567"). Devuelve null si no parece un número válido. */
export function normalizeWhatsAppNumber(value: string | undefined): string | null {
  const digits = (value ?? "").replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15 ? digits : null;
}

export const whatsappNumber = normalizeWhatsAppNumber(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);
export const isWhatsAppConfigured = whatsappNumber !== null;

export type Inquiry = {
  /** Nombre de la cabaña desde la que consulta el visitante, si corresponde. */
  cabinName?: string;
  /** Título de la promoción por la que consulta, si corresponde. */
  promotionTitle?: string;
  promotionCode?: string;
  /** Fechas en formato AAAA-MM-DD. */
  arrival?: string;
  departure?: string;
  guests?: string;
};

/** "2026-07-15" -> "15/07/2026" */
function formatDate(date: string) {
  return date.split("-").reverse().join("/");
}

export function buildWhatsAppMessage({ cabinName, promotionTitle, promotionCode, arrival, departure, guests }: Inquiry = {}): string {
  if (promotionTitle) {
    const stay = arrival && departure ? ` Llegada: ${formatDate(arrival)}. Salida: ${formatDate(departure)}.` : "";
    const people = guests ? ` Personas: ${guests}.` : "";
    const code = promotionCode ? ` Código: ${promotionCode}.` : "";
    return `Hola, quisiera consultar por la promoción "${promotionTitle}" de ${site.name} en Malargüe.${stay}${people}${code} ¿Podrían darme más información?`;
  }

  const subject = cabinName ? `${cabinName} de ${site.name}` : site.name;
  return `Hola, quisiera recibir información sobre ${subject} en Malargüe. ¿Podrían indicarme disponibilidad, tarifas y servicios?`;
}

/** Enlace oficial wa.me con el mensaje precargado. Devuelve null si el número no está configurado. */
export function buildWhatsAppUrl(inquiry: Inquiry = {}, number: string | null = whatsappNumber): string | null {
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(buildWhatsAppMessage(inquiry))}`;
}
