/** Estaciones del hemisferio sur, con las fechas habituales de inicio en Argentina. */
export type Season = "verano" | "otono" | "invierno" | "primavera";

export const seasons: Season[] = ["verano", "otono", "invierno", "primavera"];

export function isSeason(value: string | null): value is Season {
  return seasons.includes(value as Season);
}

/**
 * Estación según el día de hoy en Mendoza.
 * Verano: 21 dic – 20 mar · Otoño: 21 mar – 20 jun · Invierno: 21 jun – 20 sep · Primavera: 21 sep – 20 dic.
 */
export function seasonForDate(date: Date = new Date()): Season {
  const monthDay = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Argentina/Mendoza", month: "2-digit", day: "2-digit" })
    .format(date)
    .replace("-", "");
  if (monthDay >= "1221" || monthDay < "0321") return "verano";
  if (monthDay < "0621") return "otono";
  if (monthDay < "0921") return "invierno";
  return "primavera";
}
