export const PENDING = "PENDIENTE" as const;

export type SiteInfo = {
  name: string;
  location: string;
  /** Dirección confirmada por el propietario. Mientras tanto queda como PENDIENTE. */
  address: string;
  /** Coordenadas del alojamiento, por ejemplo { lat: -00.0000, lng: -00.0000 }. null mientras no estén confirmadas. */
  coordinates: { lat: number; lng: number } | null;
  /** Indicaciones para llegar, verificadas por el propietario. Mientras tanto queda como PENDIENTE. */
  directions: string;
  intro: string;
  contactNote: string;
  /** Perfil de Instagram de las cabañas. */
  instagramUrl: string;
};

export const site: SiteInfo = {
  name: "Cabañas Amanecer de Montaña",
  location: "Malargüe, Mendoza, Argentina",
  address: "Pje. El Pehuenche 95, M5613",
  coordinates: { lat: -35.4545384, lng: -69.5902931 },
  directions: "A 100 metros de la Ruta Nacional 40, por el acceso Norte a la ciudad de Malargüe, y a 80 km del centro de ski Las Leñas.",
  intro:
    "Dos cabañas totalmente equipadas y atendidas por sus dueños, para descansar en familia o con amigos y descubrir los paisajes del sur mendocino.",
  contactNote: "Los datos de contacto se publicarán cuando estén confirmados.",
  instagramUrl: "https://instagram.com/amanecerdemontana",
};

export const amenities = [
  { name: "Servicios", detail: "WiFi, TV con DIRECTV, limpieza y ropa blanca" },
  { name: "Equipamiento", detail: "Cocina completa, aire acondicionado, calefacción y hogar a leña" },
  { name: "Horarios", detail: "Check-in desde las 14 hs y check-out hasta las 10 hs" },
  { name: "Medios de pago", detail: "Transferencia bancaria o Mercado Pago" },
] as const;

/* ---------- Traducciones (portugués e inglés). El español de arriba es la referencia. ---------- */

type SiteTexts = { intro: string; directions: string; contactNote: string };

export const siteTexts: Record<"pt" | "en", SiteTexts> = {
  pt: {
    intro:
      "Duas cabanas totalmente equipadas e administradas pelos próprios donos, para descansar em família ou com amigos e descobrir as paisagens do sul de Mendoza.",
    directions: "A 100 metros da Rodovia Nacional 40, pelo acesso Norte à cidade de Malargüe, e a 80 km da estação de esqui Las Leñas.",
    contactNote: "Os dados de contato serão publicados quando estiverem confirmados.",
  },
  en: {
    intro: "Two fully equipped cabins run by their owners, for a relaxing stay with family or friends while you discover the landscapes of southern Mendoza.",
    directions: "100 meters from National Route 40, at the northern entrance to the town of Malargüe, and 80 km from the Las Leñas ski resort.",
    contactNote: "Contact details will be published once they are confirmed.",
  },
};

export const amenitiesTranslations: Record<"pt" | "en", { name: string; detail: string }[]> = {
  pt: [
    { name: "Serviços", detail: "Wi-Fi, TV com DIRECTV, limpeza e roupa de cama e banho" },
    { name: "Equipamentos", detail: "Cozinha completa, ar-condicionado, calefação e lareira a lenha" },
    { name: "Horários", detail: "Check-in a partir das 14h e check-out até as 10h" },
    { name: "Formas de pagamento", detail: "Transferência bancária ou Mercado Pago" },
  ],
  en: [
    { name: "Services", detail: "Wi-Fi, TV with DIRECTV, cleaning, bed linen and towels" },
    { name: "Equipment", detail: "Full kitchen, air conditioning, heating and a wood-burning fireplace" },
    { name: "Hours", detail: "Check-in from 2 p.m. and check-out until 10 a.m." },
    { name: "Payment", detail: "Bank transfer or Mercado Pago" },
  ],
};
