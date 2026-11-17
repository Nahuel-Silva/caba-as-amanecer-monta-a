import { intlLocale, type Locale } from "@/i18n/config";

/** Fechas en formato AAAA-MM-DD, siempre leídas en UTC para que no cambie el día por la zona horaria. */
const asDate = (day: string) => new Date(`${day}T12:00:00Z`);

/** "2026-11-20" -> "20 nov 2026" / "20 de nov. de 2026" / "Nov 20, 2026". */
export function formatDay(day: string, locale: Locale) {
  return new Intl.DateTimeFormat(intlLocale[locale], { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(asDate(day));
}

/** "2026-11-20" -> "20 de noviembre de 2026" (para lectores de pantalla). */
export function formatLongDay(day: string, locale: Locale) {
  return new Intl.DateTimeFormat(intlLocale[locale], { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(asDate(day));
}

/** "2026-11" -> "Noviembre de 2026" / "Novembro de 2026" / "November 2026". */
export function formatMonthYear(month: string, locale: Locale) {
  const label = new Intl.DateTimeFormat(intlLocale[locale], { month: "long", year: "numeric", timeZone: "UTC" }).format(asDate(`${month}-01`));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/** "2026-11-12" -> "jue 12" / "qui 12" / "Thu 12". */
export function formatWeekday(day: string, locale: Locale) {
  const value = asDate(day);
  const weekday = new Intl.DateTimeFormat(intlLocale[locale], { weekday: "short", timeZone: "UTC" }).format(value).replace(".", "");
  return `${weekday} ${value.getUTCDate()}`;
}

/** Nombre del mes (0 = enero), con mayúscula: "Enero" / "Janeiro" / "January". */
export function monthName(index: number, locale: Locale) {
  const label = new Intl.DateTimeFormat(intlLocale[locale], { month: "long", timeZone: "UTC" }).format(new Date(Date.UTC(2026, index, 15)));
  return label.charAt(0).toUpperCase() + label.slice(1);
}
