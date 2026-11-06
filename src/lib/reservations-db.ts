import type { Booking } from "@/lib/availability";
import { getDatabase } from "@/lib/db";
import { manualBlockName, type ReservationRequest } from "@/lib/reservation";

export type ReservationStatus = "pending" | "confirmed" | "rejected";

/** Una solicitud pendiente retiene sus fechas por este tiempo. Vence sola: no hace falta ninguna tarea programada. */
const holdHours = 24;

/** Condición SQL de las reservas que ocupan fechas: las confirmadas y las pendientes dentro de las 24 horas. */
function occupiesDates(table: string) {
  return `(${table}.status = 'confirmed' OR (${table}.status = 'pending' AND ${table}.created_at > datetime('now', '-${holdHours} hours')))`;
}

export type ReservationRecord = {
  id: number;
  cabinSlug: string;
  name: string;
  email: string;
  phone: string;
  arrival: string;
  departure: string;
  guests: string;
  hasBaby: boolean;
  message: string;
  status: ReservationStatus;
  createdAt: string;
  /** Hasta cuándo retiene las fechas una solicitud pendiente, en formato ISO. */
  holdUntil: string;
  isHolding: boolean;
};

/** Solo devuelve fechas: el calendario público nunca recibe datos de los huéspedes. */
export async function getOccupiedStays(today: string) {
  const database = await getDatabase();
  const { rows } = await database.execute({
    sql: `SELECT cabin_slug, arrival, departure FROM reservations WHERE ${occupiesDates("reservations")} AND departure > ? ORDER BY arrival`,
    args: [today],
  });

  const bookings: Record<string, Booking[]> = {};
  for (const row of rows) {
    const slug = String(row.cabin_slug);
    (bookings[slug] ??= []).push({ from: String(row.arrival), to: String(row.departure) });
  }
  return bookings;
}

/**
 * Guarda la solicitud y retiene las fechas. Revisa y guarda en una sola operación, para que dos personas
 * no tomen las mismas noches a la vez. Devuelve false si ya están ocupadas.
 * Lo que parece spam queda como rechazado: no ocupa fechas, pero se puede rescatar desde el panel.
 */
export async function createReservation(cabinSlug: string, reservation: ReservationRequest, looksLikeSpam = false) {
  const { name, email, phone, arrival, departure, guests, hasBaby, message } = reservation;
  const values = [cabinSlug, name, email, phone, arrival, departure, guests, hasBaby ? 1 : 0, message];
  const database = await getDatabase();

  if (looksLikeSpam) {
    await database.execute({
      sql: "INSERT INTO reservations (cabin_slug, name, email, phone, arrival, departure, guests, has_baby, message, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'rejected')",
      args: values,
    });
    return true;
  }

  const { rowsAffected } = await database.execute({
    sql: `INSERT INTO reservations (cabin_slug, name, email, phone, arrival, departure, guests, has_baby, message)
      SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?
      WHERE NOT EXISTS (
        SELECT 1 FROM reservations
        WHERE ${occupiesDates("reservations")} AND cabin_slug = ? AND arrival < ? AND ? < departure
      )`,
    args: [...values, cabinSlug, departure, arrival],
  });
  return rowsAffected === 1;
}

function holdInfo(status: string, createdAt: string) {
  const until = Date.parse(`${createdAt.replace(" ", "T")}Z`) + holdHours * 60 * 60 * 1000;
  return { holdUntil: new Date(until).toISOString(), isHolding: status === "pending" && until > Date.now() };
}

export async function listReservations(): Promise<ReservationRecord[]> {
  const database = await getDatabase();
  const { rows } = await database.execute("SELECT * FROM reservations ORDER BY status = 'pending' DESC, arrival DESC LIMIT 300");
  return rows.map((row) => ({
    id: Number(row.id),
    cabinSlug: String(row.cabin_slug),
    name: String(row.name),
    email: String(row.email),
    phone: String(row.phone),
    arrival: String(row.arrival),
    departure: String(row.departure),
    guests: String(row.guests),
    hasBaby: Number(row.has_baby) === 1,
    message: String(row.message),
    status: row.status as ReservationStatus,
    createdAt: String(row.created_at),
    ...holdInfo(String(row.status), String(row.created_at)),
  }));
}

/** Confirma en una sola operación: si otra reserva ocupa esas noches, no cambia nada. */
export async function confirmReservation(id: number) {
  const database = await getDatabase();
  const { rowsAffected } = await database.execute({
    sql: `UPDATE reservations SET status = 'confirmed'
      WHERE id = ? AND NOT EXISTS (
        SELECT 1 FROM reservations AS other
        WHERE ${occupiesDates("other")} AND other.id <> reservations.id
          AND other.cabin_slug = reservations.cabin_slug
          AND other.arrival < reservations.departure AND reservations.arrival < other.departure
      )`,
    args: [id],
  });
  return rowsAffected === 1;
}

export async function rejectReservation(id: number) {
  const database = await getDatabase();
  const { rowsAffected } = await database.execute({
    sql: "UPDATE reservations SET status = 'rejected' WHERE id = ?",
    args: [id],
  });
  return rowsAffected === 1;
}

/** Bloqueo manual (reserva telefónica, mantenimiento). Falla si esas noches ya están ocupadas. */
/** Datos opcionales de una reserva tomada por teléfono o por otra página. Sin ellos queda como "Bloqueo manual". */
export type ManualGuest = { name: string; phone: string; guests: string };


export async function blockDates(cabinSlug: string, arrival: string, departure: string, guest?: ManualGuest) {
  const database = await getDatabase();
  const { rowsAffected } = await database.execute({
    sql: `INSERT INTO reservations (cabin_slug, name, email, phone, arrival, departure, guests, status)
      SELECT ?, ?, '-', ?, ?, ?, ?, 'confirmed'
      WHERE NOT EXISTS (
        SELECT 1 FROM reservations
        WHERE ${occupiesDates("reservations")} AND cabin_slug = ? AND arrival < ? AND ? < departure
      )`,
    args: [cabinSlug, guest?.name || manualBlockName, guest?.phone || "-", arrival, departure, guest?.guests || "-", cabinSlug, departure, arrival],
  });
  return rowsAffected === 1;
}
