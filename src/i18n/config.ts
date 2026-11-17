/**
 * Idiomas de la web. El español es el principal y va sin prefijo ("/cabanas");
 * los demás llevan el código delante ("/pt/cabanas", "/en/cabanas").
 * Las direcciones (cabanas, malargue…) son las mismas en todos los idiomas, como hacen las grandes cadenas.
 */
export const locales = ["es", "pt", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";

/** Idiomas con prefijo en la dirección. */
export const prefixedLocales = locales.filter((locale) => locale !== defaultLocale) as Exclude<Locale, "es">[];

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

/** Formato de fechas y números de cada idioma. */
export const intlLocale: Record<Locale, string> = { es: "es-AR", pt: "pt-BR", en: "en-US" };

/** Valor de <html lang>. */
export const htmlLang: Record<Locale, string> = { es: "es", pt: "pt-BR", en: "en" };

/** Idioma para Open Graph (vista previa al compartir). */
export const ogLocale: Record<Locale, string> = { es: "es_AR", pt: "pt_BR", en: "en_US" };

/** Nombre de cada idioma escrito en ese mismo idioma, para el selector. */
export const localeNames: Record<Locale, string> = { es: "Español", pt: "Português", en: "English" };

/** "/cabanas" en portugués -> "/pt/cabanas"; "/" en inglés -> "/en". */
export function localizePath(locale: Locale, path: string) {
  if (locale === defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** "/pt/cabanas" -> { locale: "pt", path: "/cabanas" }; "/cabanas" -> { locale: "es", path: "/cabanas" }. */
export function splitLocalePath(pathname: string): { locale: Locale; path: string } {
  const [, first = "", ...rest] = pathname.split("/");
  if (isLocale(first) && first !== defaultLocale) return { locale: first, path: `/${rest.join("/")}` };
  return { locale: defaultLocale, path: pathname || "/" };
}
