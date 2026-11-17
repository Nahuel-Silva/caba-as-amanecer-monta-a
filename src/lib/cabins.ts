import { cabins, type Cabin } from "@/content/cabins";
import { cabinTranslations } from "@/content/cabins-translations";
import type { Locale } from "@/i18n/config";

/** Cabañas con sus textos en el idioma pedido (el nombre no se traduce). */
export function getCabins(locale: Locale = "es"): Cabin[] {
  if (locale === "es") return cabins;
  const texts = cabinTranslations[locale];
  return cabins.map((cabin) => ({
    ...cabin,
    cardSummary: texts.cardSummary,
    description: texts.description,
    facts: texts.facts,
    featureGroups: texts.featureGroups,
    images: cabin.images.map((image, index) => ({ ...image, alt: texts.imageAlts[cabin.slug]?.[index] ?? image.alt })),
  }));
}

export function getCabinBySlug(slug: string, locale: Locale = "es") {
  return getCabins(locale).find((cabin) => cabin.slug === slug);
}