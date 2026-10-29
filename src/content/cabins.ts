import { PENDING } from "@/content/site";

export type CabinImage = {
  src: string;
  alt: string;
  isDemo: boolean;
};

export type Cabin = {
  slug: string;
  displayName: string;
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

/**
 * Datos informados por el propietario. Las dos cabañas son iguales,
 * por eso se definen una sola vez y cada cabaña los reutiliza.
 * Si una cabaña cambia, sobrescribí el campo en su propio objeto.
 */
const sharedDetails = {
  cardSummary: "Hasta 5 personas · 2 dormitorios · baño completo",
  description:
    "Cabaña para 5 personas dentro del complejo Amanecer de Montaña, a 100 metros de la Ruta Nacional 40 por el acceso Norte a Malargüe y a aproximadamente 1 kilómetro del centro de la ciudad. Tiene dos dormitorios, sala comedor, baño completo y cocina-comedor equipada.",
  capacity: 5,
  bedrooms: 2,
  beds:
    "Un dormitorio matrimonial con sommier Queen Size, otro con dos sommiers individuales (1 plaza y media) y un sofá cama de 1 plaza y media en la sala comedor.",
  bathrooms: 1,
  kitchen:
    "Cocina-comedor equipada con anafe de 4 hornallas (no tiene horno), heladera, microondas, pava eléctrica, cafetera, tostadora, vajilla completa e infusiones.",
  services:
    "Baño completo con ducha y antebaño, placares, tomacorrientes y conectores USB, sillones, WiFi, televisor de 32 pulgadas con DIRECTV, aire acondicionado, calefacción a gas natural (tiro balanceado) y estufa hogar a leña. El complejo cuenta con cochera cubierta y parrilla. Incluye servicio de ropa blanca (cambio de sábanas y toallas cada 3 días) y limpieza día por medio de 9 a 12 hs.",
  access:
    "Entrada privada con control eléctrico y sillones de exterior en el patio. A 100 metros de la Ruta Nacional 40 por el acceso Norte a Malargüe y a aproximadamente 1 kilómetro del centro.",
  rules:
    "Check-in a partir de las 14 hs y check-out hasta las 10 hs. La limpieza se hace sin huéspedes: los objetos personales deben guardarse dentro del placard, y el complejo no se hace cargo de su pérdida. Si el ingreso es más tarde o el retiro más temprano de lo acordado, se cobra la estadía completa. No se aceptan mascotas.",
};

export const cabins: Cabin[] = [
  {
    ...sharedDetails,
    slug: "payunia",
    displayName: "Cabaña Payunia",
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
    ...sharedDetails,
    slug: "pehuenche",
    displayName: "Cabaña Pehuenche",
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
