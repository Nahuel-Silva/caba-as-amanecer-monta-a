import { PENDING } from "@/content/site";

export type Attraction = {
  name: string;
  /** Descripción verificada. Mientras no esté confirmada, queda como PENDIENTE. */
  detail: string;
  /** Enlace a la fuente oficial (opcional). Agregarlo solo cuando esté verificado. */
  sourceUrl?: string;
};

// No cargar distancias, tiempos de viaje, horarios ni condiciones de acceso sin verificarlos en una fuente oficial.
export const attractions: Attraction[] = [
  { name: "Caverna de las Brujas", detail: PENDING },
  { name: "Castillos de Pincheira", detail: PENDING },
  { name: "La Payunia", detail: PENDING },
  { name: "Laguna de la Niña Encantada", detail: PENDING },
];
