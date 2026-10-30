export type Promotion = {
  /** Parte final de la dirección, por ejemplo "escapada-de-invierno". Sin espacios ni tildes. */
  slug: string;
  title: string;
  /** Resumen breve para la tarjeta del listado. */
  description: string;
  /** Beneficio destacado sobre la foto, por ejemplo "15% OFF". */
  discount?: string;
  /** Vigencia tal como se muestra, por ejemplo "Hasta el 30 de noviembre". */
  validity?: string;
  /** Qué incluye o puntos clave, uno por renglón en la página de la promoción. */
  details?: string[];
  /** Condiciones, por ejemplo "Mínimo 3 noches. No acumulable con otras promociones." */
  conditions?: string;
  /** Código que se suma al mensaje de consulta, por ejemplo "INVIERNO". */
  code?: string;
  /** Foto opcional, guardada en public/images/promociones/. */
  image?: { src: string; alt: string };
  /** Con false, la promoción deja de mostrarse sin borrarla. */
  active: boolean;
};

/**
 * Para agregar una promoción, copiá este ejemplo dentro de la lista:
 *
 * {
 *   slug: "escapada-de-otono",
 *   title: "Escapada de otoño",
 *   description: "Descripción breve de la promoción.",
 *   discount: "15% OFF",
 *   validity: "Hasta el 30 de mayo",
 *   details: ["Beneficio 1", "Beneficio 2"],
 *   conditions: "Mínimo 3 noches.",
 *   code: "OTONO",
 *   image: { src: "/images/promociones/otono.jpg", alt: "Qué se ve en la foto" },
 *   active: true,
 * },
 */
export const promotions: Promotion[] = [
  {
    slug: "escapada-de-invierno",
    title: "Escapada de invierno",
    description:
      "Disfrutá la nieve de Las Leñas, a 80 km del complejo, y volvé a descansar en una cabaña equipada, con hogar a leña, calefacción, WiFi y cochera individual techada.",
    validity: "Temporada de invierno",
    details: ["Hogar a leña y calefacción a gas natural", "WiFi y TV con DIRECTV", "Cochera individual techada", "A 80 km del centro de ski Las Leñas"],
    conditions: "Promoción de ejemplo: las fechas, el beneficio y las condiciones están por definir.",
    image: { src: "/images/payunia/05.jpg", alt: "Sala comedor con mesa, sillones, televisor y hogar." },
    active: true,
  },
];
