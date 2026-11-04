import { cacheLife } from "next/cache";
import { site } from "@/content/site";
import { parseMetForecast, type DayForecast } from "@/lib/weather";

// Coordenadas de las cabañas, con 4 decimales como pide MET Norway.
const fallbackCoordinates = { lat: -35.4545, lng: -69.5903 };

/**
 * Pronóstico de Malargüe de MET Norway (datos abiertos, licencia CC BY 4.0).
 * Se guarda una hora: así se consulta pocas veces al día, como piden sus condiciones de uso.
 * Si la consulta falla, lanza un error y no se guarda nada.
 */
export async function getMalargueForecast(): Promise<DayForecast[]> {
  "use cache";
  cacheLife("hours");

  const { lat, lng } = site.coordinates ?? fallbackCoordinates;
  const url = `https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${lat.toFixed(4)}&lon=${lng.toFixed(4)}`;
  const response = await fetch(url, {
    // MET Norway pide identificar la aplicación con un nombre y su sitio web.
    headers: { "User-Agent": "CabanasAmanecerDeMontana/1.0 https://github.com/Nahuel-Silva/caba-as-amanecer-monta-a" },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`MET Norway respondió ${response.status}`);

  const days = parseMetForecast(await response.json());
  if (days.length === 0) throw new Error("MET Norway no devolvió días completos");
  return days;
}
