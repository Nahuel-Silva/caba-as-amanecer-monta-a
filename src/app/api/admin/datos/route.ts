import { isAdminSession } from "@/lib/admin-auth";
import { getCabins } from "@/lib/cabins";
import { listPromotions } from "@/lib/promotions-db";
import { blockDates, confirmReservation, listReservations, rejectReservation } from "@/lib/reservations-db";
import { isSameOrigin } from "@/lib/request-guard";
import { listReviews, setReviewStatus } from "@/lib/reviews-db";

const respond = (status: number, body: Record<string, unknown>) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

const unavailable = "No pudimos hacer el cambio. Probá de nuevo.";

export async function GET() {
  if (!(await isAdminSession())) return respond(401, { error: "Sesión vencida." });

  try {
    const [reservations, reviews, promotions] = await Promise.all([listReservations(), listReviews(), listPromotions()]);
    return respond(200, { reservations, reviews, promotions });
  } catch (error) {
    console.error("No se pudieron leer los datos del panel", error);
    return respond(502, { error: "No pudimos leer la base de datos." });
  }
}

type AdminAction =
  | { action: "confirm-reservation" | "reject-reservation" | "approve-review" | "reject-review"; id: number }
  | { action: "block-dates"; cabinSlug: string; arrival: string; departure: string; name?: unknown; phone?: unknown; guests?: unknown };

/** Texto opcional, limpio y recortado. */
const optionalText = (value: unknown, limit: number) => (typeof value === "string" ? value.replace(/s+/g, " ").trim().slice(0, limit) : "");

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return respond(403, { error: "Solicitud no permitida." });
  if (!(await isAdminSession())) return respond(401, { error: "Sesión vencida." });

  const input = (await request.json().catch(() => null)) as AdminAction | null;
  if (!input) return respond(400, { error: "Datos inválidos." });

  try {
    if (input.action === "block-dates") {
      const { cabinSlug, arrival, departure } = input;
      const isValidDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);
      const isKnownCabin = getCabins().some((cabin) => cabin.slug === cabinSlug);
      if (!isKnownCabin || !isValidDate(arrival) || !isValidDate(departure) || departure <= arrival) {
        return respond(400, { error: "Revisá la cabaña y las fechas." });
      }
      const guest = { name: optionalText(input.name, 80), phone: optionalText(input.phone, 30), guests: optionalText(input.guests, 2) };
      if (guest.guests && !/^[1-5]$/.test(guest.guests)) return respond(400, { error: "Revisá la cantidad de personas." });
      return (await blockDates(cabinSlug, arrival, departure, guest.name ? guest : undefined))
        ? respond(200, { ok: true })
        : respond(409, { error: "Esas fechas ya están ocupadas." });
    }

    if (!Number.isInteger(input.id)) return respond(400, { error: "Datos inválidos." });

    if (input.action === "confirm-reservation") {
      return (await confirmReservation(input.id))
        ? respond(200, { ok: true })
        : respond(409, { error: "No se pudo confirmar: esas fechas ya están ocupadas por otra reserva." });
    }

    const isChanged = await (input.action === "reject-reservation"
      ? rejectReservation(input.id)
      : input.action === "approve-review"
        ? setReviewStatus(input.id, "approved")
        : input.action === "reject-review"
          ? setReviewStatus(input.id, "rejected")
          : Promise.resolve(false));

    return isChanged ? respond(200, { ok: true }) : respond(404, { error: "No encontramos ese registro." });
  } catch (error) {
    console.error("No se pudo aplicar el cambio del panel", error);
    return respond(502, { error: unavailable });
  }
}
