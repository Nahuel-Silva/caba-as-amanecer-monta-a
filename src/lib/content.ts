import { attractions, attractionsIntro } from "@/content/attractions";
import { faqs } from "@/content/faqs";
import { promotions } from "@/content/promotions";
import { ratingsCheckedAt, ratingSummaries, reviews } from "@/content/reviews";
import { amenities } from "@/content/site";

/**
 * Punto único de acceso al contenido editable (además de lib/cabins.ts).
 * Si más adelante el contenido pasa a un CMS o a una base de datos,
 * solo cambia este archivo y no la interfaz.
 */
export function getAttractions() {
  return attractions;
}

export function getAttractionsIntro() {
  return attractionsIntro;
}

export function getFaqs() {
  return faqs;
}

export function getPromotions() {
  return promotions.filter((promotion) => promotion.active);
}

export function getPromotionBySlug(slug: string) {
  return getPromotions().find((promotion) => promotion.slug === slug);
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

export function getAmenities() {
  return amenities;
}
