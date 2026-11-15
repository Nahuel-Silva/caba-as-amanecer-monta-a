import { isAdminSession } from "@/lib/admin-auth";
import { getCabins } from "@/lib/cabins";
import { confirmationMessage, depositMessage, type GuestMessageData } from "@/lib/guest-messages";
import { listPromotions } from "@/lib/promotions-db";
import { canEmailGuests, sendGuestEmail } from "@/lib/reservation-email";
import { blockDates, confirmReservation, getReservation, listReservations, rejectReservation, saveDepositInfo, type ReservationRecord } from "@/lib/reservations-db";
import { isSameOrigin } from "@/lib/request-guard";
import { listReviews, setReviewStatus } from "@/lib/reviews-db";
import { getSettings, saveSetting } from "@/lib/settings-db";
import { site } from "@/content/site";

const respond = (status: number, body: Record<string, unknown>) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

const unavailable = "No pudimos hacer el cambio. Probá de nuevo.";

export async function GET() {
  if (!(await isAdminSession())) return respond(401, { error: "Sesión vencida." });

  try {
    const [reservations, reviews, promotions, settings] = await Promise.all([listReservations(), listReviews(), listPromotions(), getSettings()]);
    return respond(200, { reservations, reviews, promotions, settings, canEmailGuests });
  } catch (error) {
    console.error("No se pudieron leer los datos del panel", error);
    return respond(502, { error: "No pudimos leer la base de datos." });
  }
}

type AdminAction =
  | { action: "confirm-reservation" | "reject-reservation" | "approve-review" | "reject-review" | "send-confirmation"; id: number }
  | { action: "send-deposit"; id: number; total?: unknown; deposit?: unknown; paymentDetails?: unknown }
  | { action: "block-dates"; cabinSlug: string; arrival: string; departure: string; name?: unknown; phone?: unknown; guests?: unknown };

/** Texto opcional, limpio y recortado. */
const optionalText = (value: unknown, limit: number) => (typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, limit) : "");

/** Monto en pesos: número entero positivo y razonable. */
const amount = (value: unknown) => (typeof value === "number" && Number.isInteger(value) && value > 0 && value < 1_000_000_000 ? value : null);

const hasEmail = (item: ReservationRecord) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.email);

function messageData(item: ReservationRecord, paymentDetails = ""): GuestMessageData {
  const cabin = getCabins().find((option) => option.slug === item.cabinSlug)?.displayName ?? item.cabinSlug;
  return {
    guestName: item.name,
    cabin,
    arrival: item.arrival,
    departure: item.departure,
    guests: item.guests,
    hasBaby: item.hasBaby,
    total: item.priceTotal,
    deposit: item.deposit,
    paymentDetails,
  };
}

/**
 * Manda el mail al huésped si se puede. Nunca hace fallar la acción: el panel abre WhatsApp igual
 * y avisa qué pasó con el mail.
 */
async function emailGuest(item: ReservationRecord, subject: string, text: string) {
  if (!hasEmail(item)) return { emailSent: false, emailNote: "Este pedido no tiene mail: mandale el mensaje solo por WhatsApp." };
  if (!canEmailGuests) return { emailSent: false, emailNote: "El mail no se envió porque falta configurar el envío de mails." };
  try {
    await sendGuestEmail(item.email, subject, text);
    return { emailSent: true, emailNote: `Se envió el mail a ${item.email}.` };
  } catch (error) {
    console.error("No se pudo enviar el mail al huésped", error);
    return {
      emailSent: false,
      emailNote: "El mail no se pudo enviar. Hasta que el dominio propio esté verificado en Resend, los mails solo llegan a tu propio correo.",
    };
  }
}

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

    if (input.action === "send-deposit") {
      const total = amount(input.total);
      const deposit = amount(input.deposit);
      const paymentDetails = typeof input.paymentDetails === "string" ? input.paymentDetails.trim().slice(0, 500) : "";
      if (!total || !deposit) return respond(400, { error: "Completá el precio total y la seña, solo con números." });
      if (deposit > total) return respond(400, { error: "La seña no puede ser mayor que el precio total." });
      if (!paymentDetails) return respond(400, { error: "Completá los datos para el pago, por ejemplo el alias." });

      if (!(await saveDepositInfo(input.id, total, deposit))) return respond(404, { error: "No encontramos ese pedido." });
      await saveSetting("paymentDetails", paymentDetails);
      const item = (await getReservation(input.id))!;
      const result = await emailGuest(item, `Tarifa y seña para tu reserva en ${site.name}`, depositMessage(messageData(item, paymentDetails)));
      return respond(200, { ok: true, ...result });
    }

    if (input.action === "send-confirmation") {
      const item = await getReservation(input.id);
      if (!item || item.status !== "confirmed") return respond(404, { error: "No encontramos esa reserva confirmada." });
      const result = await emailGuest(item, `Tu reserva en ${site.name} está confirmada`, confirmationMessage(messageData(item)));
      return respond(200, { ok: true, ...result });
    }

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
