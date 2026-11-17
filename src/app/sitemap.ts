import type { MetadataRoute } from "next";
import { htmlLang, locales, localizePath } from "@/i18n/config";
import { getCabins } from "@/lib/cabins";
import { absoluteUrl, siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  // Sin URL pública configurada no se publica sitemap (el sitio no es indexable).
  if (!siteUrl) return [];

  const paths = ["/", "/cabanas", "/promociones", "/malargue", "/ubicacion", "/preguntas", ...getCabins().map((cabin) => `/cabanas/${cabin.slug}`)];

  // Cada página en cada idioma, con sus versiones en los otros idiomas para que Google las relacione.
  return paths.flatMap((path) => {
    const languages = Object.fromEntries(locales.map((locale) => [htmlLang[locale], absoluteUrl(localizePath(locale, path)) ?? ""]));
    return locales.flatMap((locale) => {
      const url = absoluteUrl(localizePath(locale, path));
      return url ? [{ url, alternates: { languages } }] : [];
    });
  });
}
