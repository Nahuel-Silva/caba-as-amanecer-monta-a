import { requestLocale, serverMessage } from "@/i18n/server-messages";
import type { Locale } from "@/i18n/config";
import { todayInMendoza } from "@/lib/availability";
import { getCabins } from "@/lib/cabins";
import { isDatabaseConfigured } from "@/lib/db";
import { clientIp, isRateLimited, isSameOrigin } from "@/lib/request-guard";
import { validateReservation } from "@/lib/reservation";
import {
  isReservationEmailConfigured,
  sendGuestAcknowledgement,
  sendOwnerNotification,
} from "@/lib/reservation-email";
import { createReservation } from "@/lib/reservations-db";
import { subscribeFromReservation } from "@/lib/subscribers-db";
import { translateText } from "@/lib/translate";

const respond = (status: number, body: { ok: boolean; error?: string }, locale: Locale = "es") =>
  Response.json(body.error ? { ...body, error: serverMessage(body.error, locale) } : body, { status });

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return respond(403, { ok: false, error: "Solicitud no permitida." });

  const input: unknown = await request.json().catch(() => null);
  if (typeof input !== "object" || input === null) return respond(400, { ok: false, error: "Datos inválidos." });
  const fields = input as Record<string, unknown>;
  const locale = requestLocale(fields.locale);

  if (isRateLimited(`reservation:${clientIp(request)}`, 5, 10 * 60 * 1000)) {
    return respond(429, { ok: false, error: "Hiciste varias solicitudes seguidas. Probá de nuevo en unos minutos." }, locale);
  }

  const cabins = getCabins();
  const { data, error } = validateReservation(fields, todayInMendoza(), cabins.map((cabin) => cabin.displayName));
  if (!data) return respond(400, { ok: false, error }, locale);

  if (!isDatabaseConfigured && !isReservationEmailConfigured) {
    return respond(503, { ok: false, error: "Las solicitudes todavía no están disponibles. Escribinos por WhatsApp." }, locale);
  }

  // Si escribió desde la versión en otro idioma, su mensaje se traduce al español para el panel y el mail.
  const messageEs = locale !== "es" && data.message ? ((await translateText(data.message, "es", null)) ?? "") : "";

  const cabinSlug = cabins.find((cabin) => cabin.displayName === data.cabin)?.slug ?? "";
  let isSaved = false;

  // Campo oculto: lo completan los robots, pero también algún autocompletado. Nunca se descarta en silencio.
  const looksLikeSpam = Boolean(fields.hp_token);
  if (looksLikeSpam) console.warn("Solicitud marcada como posible spam: se guarda como rechazada y no se envían mails.");

  if (isDatabaseConfigured) {
    try {
      if (!(await createReservation(cabinSlug, data, looksLikeSpam, { locale, messageEs }))) {
        return respond(409, { ok: false, error: "Esas fechas ya están ocupadas. Elegí otras o probá con la otra cabaña." }, locale);
      }
      isSaved = true;
    } catch (saveError) {
      console.error("No se pudo guardar la solicitud", saveError);
    }

    // Marcó la casilla de promociones. Si falla, la solicitud sigue adelante igual.
    if (isSaved && !looksLikeSpam && fields.wantsPromotions === true) {
      await subscribeFromReservation(data.email.toLowerCase(), data.name, data.phone, locale).catch((subscribeError: unknown) => {
        console.error("No se pudo anotar a la persona en los avisos de promociones", subscribeError);
      });
    }
  }

  if (isReservationEmailConfigured && !looksLikeSpam) {
    try {
      await sendOwnerNotification(data, locale, messageEs);
      await sendGuestAcknowledgement(data, locale).catch((sendError: unknown) => {
        console.error("No se pudo enviar el acuse al huésped", sendError);
      });
      return respond(200, { ok: true });
    } catch (sendError) {
      console.error("No se pudo enviar el aviso de reserva", sendError);
    }
  }

  // Con la solicitud guardada, un mail fallido no se le informa como error al huésped.
  if (isSaved) return respond(200, { ok: true });
  return respond(502, { ok: false, error: "No pudimos enviar tu solicitud. Probá de nuevo o escribinos por WhatsApp." }, locale);
}
