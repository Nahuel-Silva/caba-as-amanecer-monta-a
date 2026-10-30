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
};

export const amenities = [
  { name: "Servicios", detail: "WiFi, TV con DIRECTV, limpieza y ropa blanca" },
  { name: "Equipamiento", detail: "Cocina completa, aire acondicionado, calefacción y hogar a leña" },
  { name: "Horarios", detail: "Check-in desde las 14 hs y check-out hasta las 10 hs" },
  { name: "Medios de pago", detail: "Transferencia bancaria o Mercado Pago" },
] as const;
