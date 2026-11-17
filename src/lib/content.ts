import { attractions, attractionsIntro, type Attraction } from "@/content/attractions";
import { attractionsIntroTranslations, attractionTranslations, ownPhotoLicense, sourceLabelTranslations } from "@/content/attractions-translations";
import { faqs, type Faq } from "@/content/faqs";
import { faqTranslations } from "@/content/faqs-translations";
import { attractionDistances, distanceTranslations, type Distance } from "@/content/location";
import { ratingsCheckedAt, ratingSummaries, reviews } from "@/content/reviews";
import { amenities, amenitiesTranslations, site, siteTexts } from "@/content/site";
import type { Locale } from "@/i18n/config";

/**
 * Punto único de acceso al contenido editable (además de lib/cabins.ts).
 * Si más adelante el contenido pasa a un CMS o a una base de datos,
 * solo cambia este archivo y no la interfaz.
 */
/** Atractivos en el idioma pedido. El nombre del lugar no se traduce. */
export function getAttractions(locale: Locale = "es"): Attraction[] {
  if (locale === "es") return attractions;
  const texts = attractionTranslations[locale];
  const labels = sourceLabelTranslations[locale];
  return attractions.map((attraction) => {
    const translated = texts[attraction.name];
    return {
      ...attraction,
      detail: translated?.detail ?? attraction.detail,
      sourceLabel: labels[attraction.sourceLabel ?? "Fuente oficial"] ?? attraction.sourceLabel,
      image: attraction.image && {
        ...attraction.image,
        alt: translated?.alt ?? attraction.image.alt,
        license: attraction.image.license === "Foto propia" ? ownPhotoLicense[locale] : attraction.image.license,
      },
    };
  });
}

export function getAttractionsIntro(locale: Locale = "es") {
  return locale === "es" ? attractionsIntro : attractionsIntroTranslations[locale];
}

export function getFaqs(locale: Locale = "es"): Faq[] {
  return locale === "es" ? faqs : faqTranslations[locale];
}

/** Tabla de distancias desde las cabañas. */
export function getDistances(locale: Locale = "es"): Distance[] {
  if (locale === "es") return attractionDistances;
  const names = distanceTranslations[locale];
  return attractionDistances.map(({ place, distance }) => ({ place: names[place] ?? place, distance: names[distance] ?? distance }));
}

export function getReviews() {
  return reviews;
}

export function getRatingSummaries() {
  return ratingSummaries;
}

export function getRatingsCheckedAt() {
  return ratingsCheckedAt;
}

export function getAmenities(locale: Locale = "es"): readonly { name: string; detail: string }[] {
  return locale === "es" ? amenities : amenitiesTranslations[locale];
}

/** Textos generales del complejo (presentación, cómo llegar) en el idioma pedido. */
export function getSiteTexts(locale: Locale = "es") {
  return locale === "es" ? { intro: site.intro, directions: site.directions, contactNote: site.contactNote } : siteTexts[locale];
}
