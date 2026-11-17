import { localizePath } from "@/i18n/config";
import { requestLocale, serverMessage } from "@/i18n/server-messages";
import { publicBaseUrl } from "@/lib/promotion-notice";
import { canEmailGuests, sendSubscriptionConfirmation } from "@/lib/reservation-email";
import { clientIp, isRateLimited, isSameOrigin } from "@/lib/request-guard";
import { normalizeEmail, tokenPattern } from "@/lib/subscribers";
import { confirmSubscription, subscribeFromWeb, unsubscribe } from "@/lib/subscribers-db";

const respond = (status: number, body: { ok: boolean; error?: string; message?: string }) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

/**
 * Suscripción a los avisos de promociones desde la web:
 * - "subscribe": anota el mail (queda pendiente) y manda el mail para confirmar.
 * - "confirm" y "unsubscribe": los botones de la página /suscripcion, con el código que llegó por mail.
 */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return respond(403, { ok: false, error: "Solicitud no permitida." });

  const raw = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!raw) return respond(400, { ok: false, error: "Datos inválidos." });
  const input = raw;
  const locale = requestLocale(input.locale);
  // Los avisos se devuelven en el idioma de la página.
  const reply = (status: number, body: { ok: boolean; error?: string; message?: string }) =>
    respond(status, { ...body, ...(body.error ? { error: serverMessage(body.error, locale) } : {}), ...(body.message ? { message: serverMessage(body.message, locale) } : {}) });

  // Anotarse manda un mail: se limita más que confirmar o darse de baja.
  const isSubscribe = input.action === "subscribe";
  if (isRateLimited(`subscription:${isSubscribe ? "new" : "link"}:${clientIp(request)}`, isSubscribe ? 5 : 20, 10 * 60 * 1000)) {
    return reply(429, { ok: false, error: "Hiciste varios intentos seguidos. Probá de nuevo en unos minutos." });
  }

  try {
    if (input.action === "confirm" || input.action === "unsubscribe") {
      const token = typeof input.token === "string" ? input.token : "";
      if (!tokenPattern.test(token)) return reply(400, { ok: false, error: "El enlace no es válido. Copialo completo desde el mail." });
      if (input.action === "confirm") {
        return (await confirmSubscription(token))
          ? reply(200, { ok: true })
          : reply(404, { ok: false, error: "El enlace venció o ya no existe. Podés anotarte de nuevo en la página Promociones." });
      }
      // Darse de baja dos veces no es un error: el resultado es el mismo.
      await unsubscribe(token);
      return reply(200, { ok: true });
    }

    if (input.action !== "subscribe") return reply(400, { ok: false, error: "Datos inválidos." });

    const email = normalizeEmail(input.email);
    if (!email) return reply(400, { ok: false, error: "Ingresá un email válido." });
    if (input.consent !== true) return reply(400, { ok: false, error: "Para anotarte tenés que aceptar recibir las promociones." });
    // Campo trampa para robots: se responde como si estuviera todo bien, sin guardar nada.
    if (input.hp_token) return reply(200, { ok: true, message: "Te mandamos un mail para confirmar." });

    if (!canEmailGuests) return reply(503, { ok: false, error: "Los avisos por mail todavía no están disponibles. Probá más adelante." });

    const token = await subscribeFromWeb(email, locale);
    // Ya estaba confirmada: no se le vuelve a escribir, y no se cuenta quién está anotado y quién no.
    if (!token) return reply(200, { ok: true, message: "Listo. Revisá tu correo para confirmar." });

    try {
      await sendSubscriptionConfirmation(email, new URL(`${localizePath(locale, "/suscripcion")}?confirmar=${token}`, publicBaseUrl(request)).toString(), locale);
    } catch (error) {
      console.error("No se pudo enviar el mail de confirmación de la suscripción", error);
      return reply(502, { ok: false, error: "No pudimos mandarte el mail para confirmar. Probá de nuevo más tarde." });
    }
    return reply(200, { ok: true, message: "Listo. Revisá tu correo para confirmar." });
  } catch (error) {
    console.error("No se pudo guardar la suscripción", error);
    return reply(502, { ok: false, error: "No pudimos hacer el cambio. Probá de nuevo." });
  }
}
