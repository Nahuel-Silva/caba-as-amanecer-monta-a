import { PENDING } from "@/content/site";

export type Cabin = {
  slug: string;
  displayName: string;
  nameStatus: typeof PENDING;
  description: typeof PENDING;
  capacity: typeof PENDING;
  bedrooms: typeof PENDING;
  beds: typeof PENDING;
  bathrooms: typeof PENDING;
  kitchen: typeof PENDING;
  services: typeof PENDING;
  access: typeof PENDING;
  rules: typeof PENDING;
  images: { src: string; alt: string }[];
};

export const cabins: Cabin[] = [
  {
    slug: "cabana-1",
    displayName: "Cabaña 01",
    nameStatus: PENDING,
    description: PENDING,
    capacity: PENDING,
    bedrooms: PENDING,
    beds: PENDING,
    bathrooms: PENDING,
    kitchen: PENDING,
    services: PENDING,
    access: PENDING,
    rules: PENDING,
    images: [
      {
        src: "/images/demo-landscape-02.jpg",
        alt: "Paisaje de montaña de demostración; no corresponde al alojamiento.",
      },
      {
        src: "/images/demo-landscape-03.jpg",
        alt: "Vista de lago y montaña de demostración; no corresponde al alojamiento.",
      },
    ],
  },
  {
    slug: "cabana-2",
    displayName: "Cabaña 02",
    nameStatus: PENDING,
    description: PENDING,
    capacity: PENDING,
    bedrooms: PENDING,
    beds: PENDING,
    bathrooms: PENDING,
    kitchen: PENDING,
    services: PENDING,
    access: PENDING,
    rules: PENDING,
    images: [
      {
        src: "/images/demo-landscape-03.jpg",
        alt: "Vista de lago y montaña de demostración; no corresponde al alojamiento.",
      },
      {
        src: "/images/demo-landscape-02.jpg",
        alt: "Paisaje de montaña de demostración; no corresponde al alojamiento.",
      },
    ],
  },
];