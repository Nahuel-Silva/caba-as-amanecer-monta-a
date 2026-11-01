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
import { createReservation, isStayFree } from "@/lib/reservations-db";

const respond = (status: number, body: { ok: boolean; error?: string }) => Response.json(body, { status });

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return respond(403, { ok: false, error: "Solicitud no permitida." });

  if (isRateLimited(`reservation:${clientIp(request)}`, 5, 10 * 60 * 1000)) {
    return respond(429, { ok: false, error: "Hiciste varias solicitudes seguidas. Probá de nuevo en unos minutos." });
  }

  const input: unknown = await request.json().catch(() => null);
  if (typeof input !== "object" || input === null) return respond(400, { ok: false, error: "Datos inválidos." });
  const fields = input as Record<string, unknown>;

  const cabins = getCabins();
  const { data, error } = validateReservation(fields, todayInMendoza(), cabins.map((cabin) => cabin.displayName));
  if (!data) return respond(400, { ok: false, error });

  if (!isDatabaseConfigured && !isReservationEmailConfigured) {
    return respond(503, { ok: false, error: "Las solicitudes todavía no están disponibles. Escribinos por WhatsApp." });
  }

  const cabinSlug = cabins.find((cabin) => cabin.displayName === data.cabin)?.slug ?? "";
  let isSaved = false;

  // Campo oculto: lo completan los robots, pero también algún autocompletado. Nunca se descarta en silencio.
  const looksLikeSpam = Boolean(fields.hp_token);
  if (looksLikeSpam) console.warn("Solicitud marcada como posible spam: se guarda como rechazada y no se envían mails.");

  if (isDatabaseConfigured) {
    try {
      if (!(await isStayFree(cabinSlug, data.arrival, data.departure))) {
        return respond(409, { ok: false, error: "Esas fechas ya están ocupadas. Elegí otras o probá con la otra cabaña." });
      }
      await createReservation(cabinSlug, data, looksLikeSpam ? "rejected" : "pending");
      isSaved = true;
    } catch (saveError) {
      console.error("No se pudo guardar la solicitud", saveError);
    }
  }

  if (isReservationEmailConfigured && !looksLikeSpam) {
    try {
      await sendOwnerNotification(data);
      await sendGuestAcknowledgement(data).catch((sendError: unknown) => {
        console.error("No se pudo enviar el acuse al huésped", sendError);
      });
      return respond(200, { ok: true });
    } catch (sendError) {
      console.error("No se pudo enviar el aviso de reserva", sendError);
    }
  }

  // Con la solicitud guardada, un mail fallido no se le informa como error al huésped.
  if (isSaved) return respond(200, { ok: true });
  return respond(502, { ok: false, error: "No pudimos enviar tu solicitud. Probá de nuevo o escribinos por WhatsApp." });
}
