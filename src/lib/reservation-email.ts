import { site } from "@/content/site";
import { localeNames, type Locale } from "@/i18n/config";
import { formatLongDay } from "@/i18n/format";
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

/**
 * Se pueden mandar mails a los huéspedes si hay clave de Resend y remitente.
 * Ojo: con la cuenta de prueba de Resend (sin dominio verificado) solo se entregan mails al dueño de la cuenta;
 * los envíos a huéspedes fallan hasta verificar el dominio propio.
 */
export const canEmailGuests = Boolean(apiKey && emailFrom);

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

/** Mail con versión en texto y en HTML, y encabezados extra (por ejemplo, el de baja con un clic). */
export type BulkEmail = { to: string; subject: string; text: string; html: string; headers?: Record<string, string> };

/** Error de Resend con su código, para explicar en el panel qué pasó (por ejemplo, 429: límite diario). */
export class EmailError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/** Manda hasta 100 mails en una sola llamada a Resend (cada uno cuenta para el límite diario). */
export async function sendBulkEmails(emails: BulkEmail[]) {
  if (emails.length === 0) return;
  const response = await fetch("https://api.resend.com/emails/batch", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(emails.map(({ to, subject, text, html, headers }) => ({ from: emailFrom, to, subject, text, html, headers, ...(emailTo ? { reply_to: emailTo } : {}) }))),
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new EmailError(response.status, `Resend respondió ${response.status}: ${await response.text()}`);
}

const subscriptionTexts: Record<Locale, { subject: string; lines: string[] }> = {
  es: {
    subject: `Confirmá que querés recibir las promociones de ${site.name}`,
    lines: [
      "Hola:",
      "",
      `Alguien anotó este mail en la web de ${site.name} para recibir avisos de promociones.`,
      "Si fuiste vos, confirmalo desde este enlace:",
      "{url}",
      "",
      "Si no fuiste vos, no hagas nada: sin confirmar no te vamos a mandar promociones y el mail se borra solo en una semana.",
    ],
  },
  pt: {
    subject: `Confirme que quer receber as promoções de ${site.name}`,
    lines: [
      "Olá:",
      "",
      `Alguém cadastrou este e-mail no site de ${site.name} para receber avisos de promoções.`,
      "Se foi você, confirme por este link:",
      "{url}",
      "",
      "Se não foi você, não precisa fazer nada: sem confirmação não enviaremos promoções, e o e-mail é apagado sozinho em uma semana.",
    ],
  },
  en: {
    subject: `Confirm that you'd like to receive offers from ${site.name}`,
    lines: [
      "Hello,",
      "",
      `Someone signed up this email on the ${site.name} website to receive offer notifications.`,
      "If it was you, please confirm using this link:",
      "{url}",
      "",
      "If it wasn't you, there's nothing to do: without confirmation we won't send you any offers, and the email is deleted automatically after a week.",
    ],
  },
};

/** Mail para confirmar la suscripción hecha desde la página Promociones, en el idioma de la página. */
export function sendSubscriptionConfirmation(to: string, confirmUrl: string, locale: Locale = "es") {
  const t = subscriptionTexts[locale];
  return sendEmail({
    to,
    subject: t.subject,
    replyTo: emailTo || undefined,
    text: [...t.lines.map((line) => line.replace("{url}", confirmUrl)), "", site.name, site.location].join("\n"),
  });
}

/** Mail al huésped desde el panel (seña o confirmación). Las respuestas llegan al mail del propietario. */
export function sendGuestEmail(to: string, subject: string, text: string) {
  return sendEmail({ to, subject, text: `${text}

${site.name}
${site.location}`, replyTo: emailTo || undefined });
}

/** Aviso para el propietario, siempre en español. Responder el mail le contesta directamente al huésped. */
export function sendOwnerNotification(reservation: ReservationRequest, locale: Locale = "es", messageEs = "") {
  const { name, email, phone, arrival, departure, guests, hasBaby, cabin, message } = reservation;
  const stay = `${formatReservationDate(arrival)} al ${formatReservationDate(departure)}`;

  return sendEmail({
    to: emailTo as string,
    subject: `Solicitud de reserva: ${cabin} (${stay})`,
    replyTo: email,
    text: [
      "Nueva solicitud de reserva desde la web.",
      "Las fechas quedan bloqueadas por 24 horas. Confirmala desde el panel para que no se liberen.",
      ...(locale !== "es" ? ["", `Idioma del huésped: ${localeNames[locale]}. Los mensajes que le mandes desde el panel le llegan en ese idioma.`] : []),
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
      ...(messageEs ? [`Traducción al español: ${messageEs}`] : []),
    ].join("\n"),
  });
}

/** Acuse para el huésped, en el idioma de la página desde la que pidió. Aclara que todavía no es una reserva confirmada. */
export function sendGuestAcknowledgement(reservation: ReservationRequest, locale: Locale = "es") {
  const { name, email, arrival, departure, guests, hasBaby, cabin } = reservation;
  const from = formatLongDay(arrival, locale);
  const to = formatLongDay(departure, locale);
  const texts: Record<Locale, { subject: string; lines: string[] }> = {
    es: {
      subject: `Recibimos tu solicitud de reserva en ${site.name}`,
      lines: [
        `Hola ${name}:`,
        "",
        `Recibimos tu solicitud para ${cabin}, del ${formatReservationDate(arrival)} al ${formatReservationDate(departure)}, para ${guests} ${guests === "1" ? "persona" : "personas"}${hasBaby ? " y un bebé" : ""}.`,
        "",
        "Bloqueamos esas fechas por 24 horas. Esto todavía no confirma la reserva: te vamos a responder con la tarifa, y queda confirmada con el pago de la seña. Si no se confirma en ese plazo, las fechas se liberan.",
      ],
    },
    pt: {
      subject: `Recebemos a sua solicitação de reserva em ${site.name}`,
      lines: [
        `Olá, ${name}:`,
        "",
        `Recebemos a sua solicitação para a ${cabin}, de ${from} a ${to}, para ${guests} ${guests === "1" ? "pessoa" : "pessoas"}${hasBaby ? " e um bebê" : ""}.`,
        "",
        "Bloqueamos essas datas por 24 horas. Isso ainda não confirma a reserva: vamos responder com a tarifa, e ela fica confirmada com o pagamento do sinal. Se não for confirmada nesse prazo, as datas são liberadas.",
      ],
    },
    en: {
      subject: `We received your booking request at ${site.name}`,
      lines: [
        `Hello ${name},`,
        "",
        `We received your request for ${cabin}, from ${from} to ${to}, for ${guests} ${guests === "1" ? "guest" : "guests"}${hasBaby ? " and a baby" : ""}.`,
        "",
        "We're holding those dates for 24 hours. This doesn't confirm the booking yet: we'll reply with the rate, and the booking is confirmed once the deposit is paid. If it isn't confirmed within that time, the dates are released.",
      ],
    },
  };

  return sendEmail({
    to: email,
    subject: texts[locale].subject,
    text: [...texts[locale].lines, "", site.name, site.location].join("\n"),
  });
}
