import { PENDING } from "@/content/site";

export type CabinImage = {
  src: string;
  alt: string;
  isDemo: boolean;
};

export type Cabin = {
  slug: string;
  displayName: string;
  nameStatus: string;
  cardSummary: string;
  description: string;
  capacity: number | typeof PENDING;
  bedrooms: number | typeof PENDING;
  beds: string;
  bathrooms: number | typeof PENDING;
  kitchen: string;
  services: string;
  access: string;
  rules: string;
  images: CabinImage[];
};

export const cabins: Cabin[] = [
  {
    slug: "cabana-1",
    displayName: "Cabaña 01",
    nameStatus: PENDING,
    cardSummary: "Nombre y características: PENDIENTE",
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
        isDemo: true,
      },
      {
        src: "/images/demo-landscape-03.jpg",
        alt: "Vista de lago y montaña de demostración; no corresponde al alojamiento.",
        isDemo: true,
      },
    ],
  },
  {
    slug: "cabana-2",
    displayName: "Cabaña 02",
    nameStatus: PENDING,
    cardSummary: "Nombre y características: PENDIENTE",
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
        isDemo: true,
      },
      {
        src: "/images/demo-landscape-02.jpg",
        alt: "Paisaje de montaña de demostración; no corresponde al alojamiento.",
        isDemo: true,
      },
    ],
  },
];