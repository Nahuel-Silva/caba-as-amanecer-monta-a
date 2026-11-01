import type { Booking } from "@/lib/availability";
import { getDatabase } from "@/lib/db";
import type { ReservationRequest } from "@/lib/reservation";

export type ReservationStatus = "pending" | "confirmed" | "rejected";

export type ReservationRecord = {
  id: number;
  cabinSlug: string;
  name: string;
  email: string;
  phone: string;
  arrival: string;
  departure: string;
  guests: string;
  message: string;
  status: ReservationStatus;
  createdAt: string;
};

/** Solo devuelve fechas: el calendario público nunca recibe datos de los huéspedes. */
export async function getConfirmedStays(today: string) {
  const database = await getDatabase();
  const { rows } = await database.execute({
    sql: "SELECT cabin_slug, arrival, departure FROM reservations WHERE status = 'confirmed' AND departure > ? ORDER BY arrival",
    args: [today],
  });

  const bookings: Record<string, Booking[]> = {};
  for (const row of rows) {
    const slug = String(row.cabin_slug);
    (bookings[slug] ??= []).push({ from: String(row.arrival), to: String(row.departure) });
  }
  return bookings;
}

export async function isStayFree(cabinSlug: string, arrival: string, departure: string) {
  const database = await getDatabase();
  const { rows } = await database.execute({
    sql: "SELECT 1 FROM reservations WHERE status = 'confirmed' AND cabin_slug = ? AND arrival < ? AND ? < departure LIMIT 1",
    args: [cabinSlug, departure, arrival],
  });
  return rows.length === 0;
}

/** Lo que parece spam queda como rechazado: no ocupa fechas, pero se puede rescatar desde el panel. */
export async function createReservation(cabinSlug: string, reservation: ReservationRequest, status: ReservationStatus = "pending") {
  const { name, email, phone, arrival, departure, guests, message } = reservation;
  const database = await getDatabase();
  await database.execute({
    sql: "INSERT INTO reservations (cabin_slug, name, email, phone, arrival, departure, guests, message, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    args: [cabinSlug, name, email, phone, arrival, departure, guests, message, status],
  });
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
    message: String(row.message),
    status: row.status as ReservationStatus,
    createdAt: String(row.created_at),
  }));
}

/** Confirma en una sola operación: si otra reserva confirmada ocupa esas noches, no cambia nada. */
export async function confirmReservation(id: number) {
  const database = await getDatabase();
  const { rowsAffected } = await database.execute({
    sql: `UPDATE reservations SET status = 'confirmed'
      WHERE id = ? AND NOT EXISTS (
        SELECT 1 FROM reservations AS other
        WHERE other.status = 'confirmed' AND other.id <> reservations.id
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
export async function blockDates(cabinSlug: string, arrival: string, departure: string) {
  const database = await getDatabase();
  const { rowsAffected } = await database.execute({
    sql: `INSERT INTO reservations (cabin_slug, name, email, phone, arrival, departure, guests, status)
      SELECT ?, 'Bloqueo manual', '-', '-', ?, ?, '-', 'confirmed'
      WHERE NOT EXISTS (
        SELECT 1 FROM reservations
        WHERE status = 'confirmed' AND cabin_slug = ? AND arrival < ? AND ? < departure
      )`,
    args: [cabinSlug, arrival, departure, cabinSlug, departure, arrival],
  });
  return rowsAffected === 1;
}
