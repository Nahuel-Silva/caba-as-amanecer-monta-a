/** Solicitud de reserva enviada desde el formulario. No bloquea fechas ni confirma disponibilidad. */
export type ReservationRequest = {
  name: string;
  email: string;
  phone: string;
  arrival: string;
  departure: string;
  guests: string;
  cabin: string;
  message: string;
};

export const guestOptions = ["1", "2", "3", "4", "5"];

const fieldLimits = { name: 80, email: 120, phone: 30, message: 1000 };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function isRealDate(value: string) {
  if (!datePattern.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

/** Saltos de línea y espacios repetidos no se aceptan en campos de una sola línea. */
function singleLine(value: unknown) {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

/** "2026-07-15" -> "15/07/2026" */
export function formatReservationDate(date: string) {
  return date.split("-").reverse().join("/");
}

/** Valida los datos recibidos. `today` es la fecha actual en formato AAAA-MM-DD. */
export function validateReservation(
  input: Record<string, unknown>,
  today: string,
  cabins: string[],
): { data: ReservationRequest; error?: undefined } | { data?: undefined; error: string } {
  const name = singleLine(input.name);
  const email = singleLine(input.email);
  const phone = singleLine(input.phone);
  const arrival = singleLine(input.arrival);
  const departure = singleLine(input.departure);
  const guests = singleLine(input.guests);
  const cabin = singleLine(input.cabin);
  const message = typeof input.message === "string" ? input.message.trim() : "";

  if (name.length < 2 || name.length > fieldLimits.name) return { error: "Ingresá tu nombre." };
  if (email.length > fieldLimits.email || !emailPattern.test(email)) return { error: "Ingresá un email válido." };
  if (phone.length < 6 || phone.length > fieldLimits.phone) return { error: "Ingresá un teléfono de contacto." };
  if (!isRealDate(arrival) || !isRealDate(departure)) return { error: "Elegí las fechas de llegada y salida." };
  if (arrival < today) return { error: "La fecha de llegada no puede ser anterior a hoy." };
  if (departure <= arrival) return { error: "La fecha de salida tiene que ser posterior a la de llegada." };
  if (!guestOptions.includes(guests)) return { error: "Elegí la cantidad de personas." };
  if (!cabins.includes(cabin)) return { error: "Elegí una cabaña." };
  if (message.length > fieldLimits.message) return { error: "El mensaje es demasiado largo." };

  return { data: { name, email, phone, arrival, departure, guests, cabin, message } };
}
