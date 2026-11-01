import { todayInMendoza, type Availability } from "@/lib/availability";

/** Consulta las fechas confirmadas. Si falla, deja elegir fechas y el servidor las revisa al enviar. */
export async function getAvailability(): Promise<Availability> {
  try {
    const response = await fetch("/api/disponibilidad");
    if (!response.ok) throw new Error(String(response.status));
    return (await response.json()) as Availability;
  } catch {
    return { today: todayInMendoza(), bookings: {}, notice: "No pudimos verificar la disponibilidad" };
  }
}
