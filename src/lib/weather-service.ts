import { site } from "@/content/site";
import { parseMetForecast, type DayForecast } from "@/lib/weather";

// Coordenadas de las cabañas, con 4 decimales como pide MET Norway.
const fallbackCoordinates = { lat: -35.4545, lng: -69.5903 };

/** Una hora: así se consulta pocas veces al día, como piden las condiciones de uso de MET Norway. */
const cacheMs = 60 * 60 * 1000;

/**
 * Último pronóstico leído, guardado en memoria del servidor.
 * Se usa esta caché simple (y no "use cache" de Next.js) porque funciona igual en Netlify y en Cloudflare
 * sin necesitar un almacenamiento aparte. Cada instancia del servidor guarda su copia.
 */
let cached: { days: DayForecast[]; expires: number } | null = null;

async function fetchForecast(): Promise<DayForecast[]> {
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

/**
 * Pronóstico de Malargüe de MET Norway (datos abiertos, licencia CC BY 4.0), guardado una hora.
 * Si la consulta falla, lanza un error y no guarda nada: se reintenta en la próxima visita.
 */
export async function getMalargueForecast(): Promise<DayForecast[]> {
  if (cached && cached.expires > Date.now()) return cached.days;
  // No se comparte una consulta en curso entre visitas: en Cloudflare Workers una visita no puede esperar
  // algo que inició otra. Se guarda solo el resultado, que sí se puede compartir.
  const days = await fetchForecast();
  cached = { days, expires: Date.now() + cacheMs };
  return days;
}
