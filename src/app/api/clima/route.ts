import { connection } from "next/server";
import type { Forecast } from "@/lib/weather";
import { getMalargueForecast } from "@/lib/weather-service";

export async function GET() {
  await connection();

  try {
    const body: Forecast = { days: await getMalargueForecast() };
    return Response.json(body, { headers: { "Cache-Control": "public, max-age=900" } });
  } catch (error) {
    // Sin pronóstico, la web muestra el clima habitual del mes y la reserva sigue igual.
    console.error("No se pudo leer el pronóstico", error);
    const body: Forecast = { days: [] };
    return Response.json(body, { headers: { "Cache-Control": "no-store" } });
  }
}
