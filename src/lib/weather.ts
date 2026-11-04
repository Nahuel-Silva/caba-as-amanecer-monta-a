import { climateSource, monthlyClimate, type MonthlyClimate } from "@/content/climate";

export type WeatherCondition = "clear" | "partly" | "cloudy" | "rain" | "sleet" | "snow";

/** Pronóstico de un día en Malargüe (fecha AAAA-MM-DD, hora de Mendoza). */
export type DayForecast = { date: string; max: number; min: number; rainMm: number; condition: WeatherCondition };

export type Forecast = { days: DayForecast[] };

export const forecastSource = { label: "MET Norway (yr.no)", url: "https://www.yr.no/" };
export { climateSource };

export const conditionLabels: Record<WeatherCondition, string> = {
  clear: "Despejado",
  partly: "Algo nublado",
  cloudy: "Nublado",
  rain: "Lluvia",
  sleet: "Aguanieve",
  snow: "Nieve",
};

/* ---------- Lectura del pronóstico de MET Norway (se usa en el servidor) ---------- */

type MetBlock = {
  summary?: { symbol_code?: string };
  details?: { air_temperature_max?: number; air_temperature_min?: number; precipitation_amount?: number };
};
type MetResponse = { properties?: { timeseries?: { time: string; data: { next_6_hours?: MetBlock } }[] } };

const severity: WeatherCondition[] = ["clear", "partly", "cloudy", "rain", "sleet", "snow"];

function blockCondition(symbol: string, rainMm: number): WeatherCondition {
  if (symbol.includes("snow")) return "snow";
  if (symbol.includes("sleet")) return "sleet";
  if (/rain|thunder/.test(symbol) && rainMm >= 0.5) return "rain";
  if (/cloudy|fog/.test(symbol) && !symbol.startsWith("partly")) return "cloudy";
  if (symbol.startsWith("partly")) return "partly";
  return "clear";
}

/**
 * Agrupa los bloques de 6 horas en días de Mendoza (UTC-3, sin horario de verano).
 * Un día usa los bloques que empiezan a las 06, 12 y 18 UTC y el de las 00 UTC siguiente,
 * es decir, de 03 a 03 hs locales. Solo se devuelven los días con los cuatro bloques.
 */
export function parseMetForecast(response: MetResponse): DayForecast[] {
  const blocks = new Map<string, MetBlock>();
  for (const entry of response.properties?.timeseries ?? []) {
    if (entry.data.next_6_hours && /T(00|06|12|18):00:00Z$/.test(entry.time)) blocks.set(entry.time.slice(0, 13), entry.data.next_6_hours);
  }

  const dates = [...new Set([...blocks.keys()].map((key) => key.slice(0, 10)))].sort();
  const days: DayForecast[] = [];

  for (const date of dates) {
    const next = new Date(`${date}T00:00:00Z`);
    next.setUTCDate(next.getUTCDate() + 1);
    const keys = [`${date}T06`, `${date}T12`, `${date}T18`, `${next.toISOString().slice(0, 10)}T00`];
    const dayBlocks = keys.map((key) => blocks.get(key));
    if (dayBlocks.some((block) => block?.details?.air_temperature_max === undefined || block.details.air_temperature_min === undefined)) continue;

    const details = dayBlocks.map((block) => block!.details!);
    const rainMm = details.reduce((sum, block) => sum + (block.precipitation_amount ?? 0), 0);
    // La condición del día es la más "fuerte" de los bloques diurnos (06 a 18 hs locales), o la nieve de cualquier momento.
    const conditions = dayBlocks.map((block) => blockCondition(block!.summary?.symbol_code ?? "", block!.details!.precipitation_amount ?? 0));
    const daytime = conditions.slice(1, 3);
    const worst = (list: WeatherCondition[]) => list.reduce((a, b) => (severity.indexOf(b) > severity.indexOf(a) ? b : a));
    const condition = conditions.includes("snow") ? "snow" : worst(daytime);

    days.push({
      date,
      max: Math.round(Math.max(...details.map((block) => block.air_temperature_max!))),
      min: Math.round(Math.min(...details.map((block) => block.air_temperature_min!))),
      rainMm: Math.round(rainMm * 10) / 10,
      condition,
    });
  }

  return days;
}

/* ---------- Clima de una estadía (se usa en el navegador) ---------- */

export type StayWeather = {
  /** Días de la estadía (de la llegada a la salida) que ya tienen pronóstico. */
  forecast: DayForecast[];
  /** Si hay días de la estadía todavía sin pronóstico. */
  hasDaysWithoutForecast: boolean;
  /** Clima habitual de los meses de la estadía (uno o dos). */
  months: MonthlyClimate[];
};

export function getStayWeather(arrival: string, departure: string, days: DayForecast[]): StayWeather {
  const forecast = days.filter((day) => arrival <= day.date && day.date <= departure);
  const lastForecast = days.at(-1)?.date ?? "";
  const monthIndexes = [...new Set([arrival, departure].map((date) => Number(date.slice(5, 7)) - 1))];

  return {
    forecast,
    hasDaysWithoutForecast: departure > lastForecast,
    months: monthIndexes.map((index) => monthlyClimate[index]),
  };
}

/** "2026-11-12" -> "jue 12" */
export function formatWeekday(date: string) {
  const value = new Date(`${date}T12:00:00Z`);
  const weekday = new Intl.DateTimeFormat("es-AR", { weekday: "short", timeZone: "UTC" }).format(value).replace(".", "");
  return `${weekday} ${value.getUTCDate()}`;
}

/** 11.8 -> "12°", -2.3 -> "-2°" */
export function formatDegrees(value: number) {
  return `${Math.round(value)}°`;
}
