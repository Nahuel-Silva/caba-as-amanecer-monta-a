import { site } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { ui } from "@/i18n/ui";

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
};

/**
 * Mensaje precargado. Desde la versión en portugués o inglés va en ese idioma y, debajo, en español:
 * así el visitante entiende lo que manda y el propietario lo lee sin traductor.
 */
export function buildWhatsAppMessage({ cabinName }: Inquiry = {}, locale: Locale = "es"): string {
  const message = (code: Locale) => {
    const t = ui[code].contact;
    return t.whatsappMessage(cabinName ? t.whatsappSubject(cabinName, site.name) : site.name);
  };
  return locale === "es" ? message("es") : `${message(locale)}

(ES) ${message("es")}`;
}

/** Enlace oficial wa.me con el mensaje precargado. Devuelve null si el número no está configurado. */
export function buildWhatsAppUrl(inquiry: Inquiry = {}, locale: Locale = "es", number: string | null = whatsappNumber): string | null {
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(buildWhatsAppMessage(inquiry, locale))}`;
}
