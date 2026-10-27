import { cabins } from "@/content/cabins";

export function getCabins() {
  return cabins;
}

export function getCabinBySlug(slug: string) {
  return cabins.find((cabin) => cabin.slug === slug);
}