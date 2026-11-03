export type CabinImage = {
  src: string;
  alt: string;
  isDemo: boolean;
};

/** Dato corto que se lee de un vistazo, como "Dormitorios: 2". */
export type CabinFact = { label: string; value: string };

/** Grupo de características con su lista de ítems. */
export type CabinFeatureGroup = { title: string; items: string[] };

export type Cabin = {
  slug: string;
  displayName: string;
  cardSummary: string;
  description: string;
  facts: CabinFact[];
  featureGroups: CabinFeatureGroup[];
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
    "Una cabaña completa dentro del complejo Amanecer de Montaña, con dos dormitorios, sala comedor con estufa hogar a leña, cocina-comedor equipada y baño completo. Si viajan cinco, se puede sumar una cama extra de 1 plaza con costo adicional.",
  facts: [
    { label: "Capacidad", value: "4 personas + cama extra opcional" },
    { label: "Dormitorios", value: "2" },
    { label: "Baño", value: "1 completo" },
    { label: "Cochera", value: "Individual techada" },
  ],
  featureGroups: [
    {
      title: "Dormitorios y baño",
      items: [
        "Dormitorio matrimonial con sommier Queen Size",
        "Dormitorio con dos sommiers individuales de 1 plaza y media",
        "Cama extra de 1 plaza a pedido, con costo adicional",
        "Placares en los dormitorios",
        "Baño completo con ducha y antebaño",
      ],
    },
    {
      title: "Cocina-comedor",
      items: [
        "Anafe de 4 hornallas (no tiene horno)",
        "Heladera y microondas",
        "Pava eléctrica, cafetera y tostadora",
        "Vajilla completa e infusiones",
      ],
    },
    {
      title: "Confort",
      items: [
        "Aire acondicionado",
        "Calefacción a gas natural (tiro balanceado)",
        "Estufa hogar a leña",
        "WiFi y televisor de 32 pulgadas con DIRECTV",
        "Sillones, tomacorrientes y conectores USB",
      ],
    },
    {
      title: "Servicios incluidos",
      items: [
        "Ropa blanca, con cambio de sábanas y toallas cada 3 días",
        "Limpieza día por medio, de 9 a 12 hs",
        "Cochera individual techada",
        "Parrilla en el complejo",
      ],
    },
    {
      title: "Exterior y ubicación",
      items: [
        "Entrada privada con control eléctrico",
        "Sillones de exterior en el patio",
        "A 100 metros de la Ruta Nacional 40, por el acceso Norte a Malargüe",
        "A aproximadamente 1 kilómetro del centro",
      ],
    },
    {
      title: "Normas de la casa",
      items: [
        "Check-in desde las 14 hs y check-out hasta las 10 hs",
        "La limpieza se hace sin huéspedes: los objetos personales se guardan en el placard. El complejo no se hace cargo de su pérdida.",
        "Si el ingreso es más tarde o el retiro más temprano de lo acordado, se cobra la estadía completa",
        "No se aceptan mascotas",
      ],
    },
  ],
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
