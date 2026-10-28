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
  directions: PENDING,
  intro:
    "Un lugar para hacer una pausa, descansar y descubrir los paisajes del sur mendocino. Estamos preparando cada detalle para compartir más información pronto.",
  contactNote: "Los datos de contacto se publicarán cuando estén confirmados.",
};

export const amenities = [
  { name: "Servicios", detail: PENDING },
  { name: "Equipamiento", detail: PENDING },
  { name: "Horarios", detail: PENDING },
  { name: "Medios de pago", detail: PENDING },
] as const;
