import { connection } from "next/server";
import { todayInMendoza, type Availability } from "@/lib/availability";
import { isDatabaseConfigured } from "@/lib/db";
import { getOccupiedStays } from "@/lib/reservations-db";

export async function GET() {
  await connection();
  const today = todayInMendoza();
  const headers = { "Cache-Control": "no-store" };

  if (!isDatabaseConfigured) {
    const body: Availability = { today, bookings: {}, notice: "Disponibilidad a confirmar" };
    return Response.json(body, { headers });
  }

  try {
    const body: Availability = { today, bookings: await getOccupiedStays(today) };
    return Response.json(body, { headers });
  } catch (error) {
    console.error("No se pudo leer la disponibilidad", error);
    const body: Availability = { today, bookings: {}, notice: "No pudimos verificar la disponibilidad" };
    return Response.json(body, { headers });
  }
}
