import type { Locale } from "@/i18n/config";

/**
 * Avisos de promociones: textos que acepta la persona y datos compartidos entre la web y el servidor.
 * Si cambian las condiciones (src/app/condiciones-promociones/page.tsx), hay que subir `consentVersion`:
 * así queda registrado qué versión aceptó cada persona.
 */
export const consentVersion = "2026-11-15";

export const conditionsPath = "/condiciones-promociones";

/** Casilla del formulario de reserva. Viene sin marcar. */
export const reservationConsentLabel = "Quiero recibir las promociones de las cabañas por email y por WhatsApp.";

/** Casilla del formulario de la página Promociones. Viene sin marcar. */
export const webConsentLabel = "Acepto recibir las promociones de las cabañas por email.";

export type SubscriberSource = "reserva" | "web";

export type SubscriberRecord = {
  id: number;
  email: string;
  name: string;
  phone: string;
  source: SubscriberSource;
  status: "pending" | "active";
  createdAt: string;
  confirmedAt: string;
  /** Idioma en el que se anotó: los avisos le llegan en ese idioma. */
  locale: Locale;
};

/** Cuántas personas recibieron el aviso de cada promoción (id de la promoción → cantidad y última fecha). */
export type PromotionNoticeSummary = Record<number, { sent: number; lastSentAt: string }>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Email limpio y en minúsculas, o "" si no es válido. */
export function normalizeEmail(value: unknown) {
  if (typeof value !== "string") return "";
  const email = value.trim().toLowerCase();
  return email.length <= 120 && emailPattern.test(email) ? email : "";
}

/** Código secreto de cada persona para confirmar o darse de baja desde el mail. */
export const tokenPattern = /^[a-f0-9]{48}$/;
