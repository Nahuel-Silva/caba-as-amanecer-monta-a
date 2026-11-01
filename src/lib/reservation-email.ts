import { site } from "@/content/site";
import { isDatabaseConfigured } from "@/lib/db";
import { formatReservationDate, type ReservationRequest } from "@/lib/reservation";

/**
 * Envío de mails con la API de Resend. Las claves son variables de servidor (ver .env.example):
 * nunca llevan el prefijo NEXT_PUBLIC_ para que no lleguen al navegador.
 */
const apiKey = process.env.RESEND_API_KEY;
const emailTo = process.env.RESERVATIONS_EMAIL_TO;
const emailFrom = process.env.RESERVATIONS_EMAIL_FROM;

export const isReservationEmailConfigured = Boolean(apiKey && emailTo && emailFrom);

/** El formulario se muestra si hay dónde recibir la solicitud: la base de datos o el mail. */
export const showReservationForm = isDatabaseConfigured || isReservationEmailConfigured;

type Email = { to: string; subject: string; text: string; replyTo?: string };

async function sendEmail({ to, subject, text, replyTo }: Email) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: emailFrom, to, subject, text, ...(replyTo ? { reply_to: replyTo } : {}) }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) throw new Error(`Resend respondió ${response.status}: ${await response.text()}`);
}

/** Aviso para el propietario. Responder el mail le contesta directamente al huésped. */
export function sendOwnerNotification(reservation: ReservationRequest) {
  const { name, email, phone, arrival, departure, guests, hasBaby, cabin, message } = reservation;
  const stay = `${formatReservationDate(arrival)} al ${formatReservationDate(departure)}`;

  return sendEmail({
    to: emailTo as string,
    subject: `Solicitud de reserva: ${cabin} (${stay})`,
    replyTo: email,
    text: [
      "Nueva solicitud de reserva desde la web.",
      "Las fechas quedan bloqueadas por 24 horas. Confirmala desde el panel para que no se liberen.",
      "",
      `Cabaña: ${cabin}`,
      `Fechas: ${stay}`,
      `Personas: ${guests}`,
      `Viajan con bebé: ${hasBaby ? "Sí" : "No"}`,
      "",
      `Nombre: ${name}`,
      `Email: ${email}`,
      `Teléfono: ${phone}`,
      "",
      `Mensaje: ${message || "(sin mensaje)"}`,
    ].join("\n"),
  });
}

/** Acuse para el huésped. Aclara que todavía no es una reserva confirmada. */
export function sendGuestAcknowledgement(reservation: ReservationRequest) {
  const { name, email, arrival, departure, guests, hasBaby, cabin } = reservation;

  return sendEmail({
    to: email,
    subject: `Recibimos tu solicitud de reserva en ${site.name}`,
    text: [
      `Hola ${name}:`,
      "",
      `Recibimos tu solicitud para ${cabin}, del ${formatReservationDate(arrival)} al ${formatReservationDate(departure)}, para ${guests} ${guests === "1" ? "persona" : "personas"}${hasBaby ? " y un bebé" : ""}.`,
      "",
      "Bloqueamos esas fechas por 24 horas. Esto todavía no confirma la reserva: te vamos a responder con la tarifa, y queda confirmada con el pago de la seña. Si no se confirma en ese plazo, las fechas se liberan.",
      "",
      site.name,
      site.location,
    ].join("\n"),
  });
}
