import { getCabins } from "@/lib/cabins";
import { validateReservation } from "@/lib/reservation";
import {
  isReservationEmailConfigured,
  sendGuestAcknowledgement,
  sendOwnerNotification,
} from "@/lib/reservation-email";

const rateLimit = { maxRequests: 5, windowMs: 10 * 60 * 1000 };
const recentRequests = new Map<string, number[]>();

/** Límite básico por IP. Vive en memoria: se reinicia con el servidor y no se comparte entre instancias. */
function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (recentRequests.get(ip) ?? []).filter((time) => now - time < rateLimit.windowMs);
  recentRequests.set(ip, [...recent, now]);
  return recent.length >= rateLimit.maxRequests;
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

const respond = (status: number, body: { ok: boolean; error?: string }) => Response.json(body, { status });

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return respond(403, { ok: false, error: "Solicitud no permitida." });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (isRateLimited(ip)) {
    return respond(429, { ok: false, error: "Hiciste varias solicitudes seguidas. Probá de nuevo en unos minutos." });
  }

  const input: unknown = await request.json().catch(() => null);
  if (typeof input !== "object" || input === null) return respond(400, { ok: false, error: "Datos inválidos." });
  const fields = input as Record<string, unknown>;

  // Campo oculto: solo lo completan los robots. Se responde como si hubiera salido bien.
  if (fields.website) return respond(200, { ok: true });

  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Argentina/Mendoza" }).format(new Date());
  const cabins = getCabins().map((cabin) => cabin.displayName);
  const { data, error } = validateReservation(fields, today, cabins);
  if (!data) return respond(400, { ok: false, error });

  if (!isReservationEmailConfigured) {
    return respond(503, { ok: false, error: "El envío por mail todavía no está configurado." });
  }

  try {
    await sendOwnerNotification(data);
  } catch (sendError) {
    console.error("No se pudo enviar el aviso de reserva", sendError);
    return respond(502, { ok: false, error: "No pudimos enviar tu solicitud. Probá de nuevo o escribinos por WhatsApp." });
  }

  // La solicitud ya llegó al propietario: si falla el acuse, no se la informa como error al huésped.
  await sendGuestAcknowledgement(data).catch((sendError: unknown) => {
    console.error("No se pudo enviar el acuse al huésped", sendError);
  });

  return respond(200, { ok: true });
}
