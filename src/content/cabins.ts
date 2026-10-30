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
  capacity: string;
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
  cardSummary: "Para 4 personas · 2 dormitorios · baño completo",
  description:
    "Cabaña para 4 personas, con opción de agregar una cama extra de 1 plaza con costo adicional, dentro del complejo Amanecer de Montaña, a 100 metros de la Ruta Nacional 40 por el acceso Norte a Malargüe y a aproximadamente 1 kilómetro del centro de la ciudad. Tiene dos dormitorios, sala comedor, baño completo y cocina-comedor equipada.",
  capacity: "4 personas, con opción de cama extra de 1 plaza (costo adicional)",
  bedrooms: 2,
  beds:
    "Un dormitorio matrimonial con sommier Queen Size y otro con dos sommiers individuales (1 plaza y media). Si lo pedís, se puede agregar una cama extra de 1 plaza con costo adicional.",
  bathrooms: 1,
  kitchen:
    "Cocina-comedor equipada con anafe de 4 hornallas (no tiene horno), heladera, microondas, pava eléctrica, cafetera, tostadora, vajilla completa e infusiones.",
  services:
    "Baño completo con ducha y antebaño, placares, tomacorrientes y conectores USB, sillones, WiFi, televisor de 32 pulgadas con DIRECTV, aire acondicionado, calefacción a gas natural (tiro balanceado) y estufa hogar a leña. Cada cabaña tiene cochera individual techada y el complejo cuenta con parrilla. Incluye servicio de ropa blanca (cambio de sábanas y toallas cada 3 días) y limpieza día por medio de 9 a 12 hs.",
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
        src: "/images/payunia/01.jpg",
        alt: "Exterior de la cabaña Payunia, con paredes verdes, galería y chimenea de piedra, rodeada de jardín.",
        isDemo: false,
      },
      {
        src: "/images/payunia/exterior-puerta.jpg",
        alt: "Entrada de la cabaña Payunia con puerta de madera, parrilla y jardín arbolado.",
        isDemo: false,
      },
      {
        src: "/images/payunia/exterior-tormenta.jpg",
        alt: "Lateral de la cabaña Payunia con base de piedra, bajo un cielo de nubes y álamos.",
        isDemo: false,
      },
      {
        src: "/images/payunia/05.jpg",
        alt: "Sala comedor con mesa para seis, sillones, televisor y hogar.",
        isDemo: false,
      },
      {
        src: "/images/payunia/06.jpg",
        alt: "Cocina comedor con heladera, microondas, mesada y mesa.",
        isDemo: false,
      },
      {
        src: "/images/payunia/12.jpg",
        alt: "Dormitorio con cama matrimonial, acolchado bordó y toallas sobre la cama.",
        isDemo: false,
      },
      {
        src: "/images/payunia/13.jpg",
        alt: "Cama con acolchado a rayas de colores y toallas, junto a la ventana.",
        isDemo: false,
      },
      {
        src: "/images/payunia/14.jpg",
        alt: "Dormitorio con dos camas individuales y acolchados a rayas de colores.",
        isDemo: false,
      },
      {
        src: "/images/payunia/15.jpg",
        alt: "Baño con mesada, bacha y espejo.",
        isDemo: false,
      },
    ],
  },
  {
    ...sharedDetails,
    slug: "pehuenche",
    displayName: "Cabaña Pehuenche",
    images: [
      {
        src: "/images/pehuenche/exterior-alamos.jpg",
        alt: "Cabaña Pehuenche al pie de una hilera de álamos, con el parque de césped delante y cielo de tormenta.",
        isDemo: false,
      },
      {
        src: "/images/pehuenche/exterior-galeria.jpg",
        alt: "Galería techada de la cabaña Pehuenche junto a la pared de piedra, frente al parque.",
        isDemo: false,
      },
      {
        src: "/images/pehuenche/03.jpg",
        alt: "Frente de la cabaña Pehuenche, con pared de piedra y chimenea, bajo un cielo azul.",
        isDemo: false,
      },
      {
        src: "/images/pehuenche/04.jpg",
        alt: "Cabaña Pehuenche con su galería techada y el jardín delante.",
        isDemo: false,
      },
      {
        src: "/images/pehuenche/07.jpg",
        alt: "Dormitorio con cama matrimonial, acolchado a rayas y toallas sobre la cama.",
        isDemo: false,
      },
      {
        src: "/images/pehuenche/08.jpg",
        alt: "Cama matrimonial con toallas, junto al placard de madera.",
        isDemo: false,
      },
      {
        src: "/images/pehuenche/09.jpg",
        alt: "Dormitorio con dos camas individuales y estante de madera bajo la ventana.",
        isDemo: false,
      },
      {
        src: "/images/pehuenche/10.jpg",
        alt: "Dos camas individuales con acolchados oscuros floreados.",
        isDemo: false,
      },
      {
        src: "/images/pehuenche/11.jpg",
        alt: "Baño con cerámicos oscuros, ventana y nicho de venecitas.",
        isDemo: false,
      },
    ],
  },
];
