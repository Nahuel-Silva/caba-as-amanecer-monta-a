import { amenities, site } from "@/content/site";
import { countNights } from "@/lib/availability";
import { getLocation } from "@/lib/location";

/**
 * Mensajes para los huéspedes. El mismo texto se usa en el mail y en WhatsApp,
 * así lo que llega por las dos vías es idéntico. Se usa en el panel y en el servidor.
 */

export type GuestMessageData = {
  guestName: string;
  cabin: string;
  arrival: string;
  departure: string;
  guests: string;
  hasBaby: boolean;
  /** Montos en pesos, sin decimales. */
  total?: number | null;
  deposit?: number | null;
  /** Alias, CBU u otros datos para pagar la seña. */
  paymentDetails?: string;
};

/** 120000 -> "$ 120.000" */
export function formatPesos(amount: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(amount);
}

/** "2027-01-12" -> "12 de enero" */
export function formatShortDay(date: string) {
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
}

export function guestsText(guests: string, hasBaby: boolean) {
  const people = guests === "1" ? "1 persona" : `${guests} personas`;
  return hasBaby ? `${people} y un bebé` : people;
}

function firstName(name: string) {
  return name.trim().split(" ")[0];
}

function stayLine({ cabin, arrival, departure, guests, hasBaby }: GuestMessageData) {
  const nights = countNights(arrival, departure);
  const people = guests !== "-" ? `, ${guestsText(guests, hasBaby)}` : "";
  return `${cabin} del ${formatShortDay(arrival)} al ${formatShortDay(departure)} (${nights} ${nights === 1 ? "noche" : "noches"}${people})`;
}

/** Saldo a pagar al llegar, si se cargaron los dos montos. */
export function balanceOf({ total, deposit }: Pick<GuestMessageData, "total" | "deposit">) {
  return total && deposit && deposit <= total ? total - deposit : null;
}

export function depositMessage(data: GuestMessageData) {
  const { total, deposit, paymentDetails } = data;
  const balance = balanceOf(data);
  return [
    `Hola ${firstName(data.guestName)}, ¡gracias por elegirnos! Tenemos lugar en ${stayLine(data)}.`,
    "",
    `La tarifa total es de ${total ? formatPesos(total) : "$____"}.`,
    `Para confirmar la reserva te pedimos una seña de ${deposit ? formatPesos(deposit) : "$____"}, por transferencia o Mercado Pago.`,
    balance !== null ? `El saldo de ${formatPesos(balance)} se paga al llegar.` : "",
    "",
    "Datos para el pago:",
    paymentDetails?.trim() || "____",
    "",
    "Cuando hagas la seña, mandanos el comprobante. ¡Gracias!",
  ]
    .filter((line, index, lines) => line !== "" || lines[index - 1] !== "")
    .join("\n");
}

export function confirmationMessage(data: GuestMessageData) {
  const schedule = amenities.find((amenity) => amenity.name === "Horarios")?.detail;
  const directions = getLocation()?.directionsUrl;
  const balance = balanceOf(data);
  return [
    `Hola ${firstName(data.guestName)}, ¡tu reserva está confirmada! Te esperamos en ${stayLine(data)}.`,
    balance !== null ? `Recibimos la seña. El saldo a pagar al llegar es de ${formatPesos(balance)}.` : "",
    "",
    schedule ? `Horarios: ${schedule.charAt(0).toLowerCase()}${schedule.slice(1)}.` : "",
    `Dirección: ${site.address}, ${site.location}.`,
    directions ? `Cómo llegar: ${directions}` : "",
    "",
    "Cualquier consulta, escribinos.",
  ]
    .filter((line, index, lines) => line !== "" || (index > 0 && lines[index - 1] !== ""))
    .join("\n");
}

export function noRoomMessage(data: GuestMessageData) {
  return `Hola ${firstName(data.guestName)}, gracias por escribirnos. Lamentablemente no tenemos lugar en ${data.cabin} del ${formatShortDay(data.arrival)} al ${formatShortDay(data.departure)}. Si te sirven otras fechas, avisanos y lo vemos. ¡Saludos!`;
}

export function helloMessage(data: GuestMessageData) {
  return `Hola ${firstName(data.guestName)}, te escribimos de ${site.name} por tu reserva en ${data.cabin}, del ${formatShortDay(data.arrival)} al ${formatShortDay(data.departure)}.`;
}
