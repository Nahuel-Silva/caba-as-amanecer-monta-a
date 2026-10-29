import { attractions, attractionsIntro } from "@/content/attractions";
import { faqs } from "@/content/faqs";
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

export function getAmenities() {
  return amenities;
}
