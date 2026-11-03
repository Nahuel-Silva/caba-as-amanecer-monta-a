/**
 * Fechas en formato AAAA-MM-DD. Una reserva ocupa las noches desde `from` hasta el día anterior a `to`:
 * el día de salida queda libre para otra entrada (salida hasta las 10 hs y entrada desde las 14 hs).
 */
export type Booking = { from: string; to: string };

export type Availability = {
  today: string;
  /** Reservas confirmadas por `slug` de cabaña. */
  bookings: Record<string, Booking[]>;
  /** Aviso cuando las fechas no se pudieron verificar. */
  notice?: string;
};

export type StaySelection = { arrival: string; departure: string };

export function todayInMendoza() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Argentina/Mendoza" }).format(new Date());
}

export function addDays(date: string, days: number) {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

export function isNightBooked(date: string, bookings: Booking[]) {
  return bookings.some((booking) => booking.from <= date && date < booking.to);
}

export function isStayAvailable(arrival: string, departure: string, bookings: Booking[]) {
  return !bookings.some((booking) => arrival < booking.to && booking.from < departure);
}

/** Días que se pueden tocar en el calendario, según lo elegido hasta el momento. */
export function isDaySelectable(day: string, { arrival, departure }: StaySelection, today: string, bookings: Booking[]) {
  if (day < today) return false;
  const choosingDeparture = arrival !== "" && departure === "";
  if (choosingDeparture && day > arrival) return isStayAvailable(arrival, day, bookings);
  return !isNightBooked(day, bookings);
}

/** Primer toque: llegada. Segundo toque posterior: salida. Tocar de nuevo reinicia la elección. */
export function selectDay(day: string, { arrival, departure }: StaySelection): StaySelection {
  if (arrival === "" || departure !== "" || day < arrival) return { arrival: day, departure: "" };
  if (day === arrival) return { arrival: "", departure: "" };
  return { arrival, departure: day };
}

/** Conserva la estadía si sigue libre en otra cabaña. Si no, la limpia. */
export function keepAvailableStay(stay: StaySelection, bookings: Booking[]): StaySelection {
  const isComplete = stay.departure !== "" && isStayAvailable(stay.arrival, stay.departure, bookings);
  return isComplete ? stay : { arrival: "", departure: "" };
}

export function countNights(arrival: string, departure: string) {
  return Math.round((Date.parse(departure) - Date.parse(arrival)) / 86_400_000);
}

export function formatDay(day: string) {
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${day}T00:00:00Z`));
}
