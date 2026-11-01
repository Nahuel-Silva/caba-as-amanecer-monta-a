export type Promotion = {
  id: number;
  /** Parte final de la dirección, creada a partir del título. No cambia al editar. */
  slug: string;
  title: string;
  /** Resumen breve para la tarjeta del listado. */
  description: string;
  /** Beneficio destacado sobre la foto, por ejemplo "15% OFF". */
  discount?: string;
  /** Vigencia tal como se muestra, por ejemplo "Hasta el 30 de noviembre". */
  validity?: string;
  /** Qué incluye o puntos clave. */
  details: string[];
  /** Condiciones, por ejemplo "Mínimo 3 noches. No acumulable con otras promociones." */
  conditions?: string;
  /** Código que se suma al mensaje de consulta, por ejemplo "INVIERNO". */
  code?: string;
  image?: { src: string; alt: string };
  /** Con false, la promoción deja de mostrarse sin borrarla. */
  active: boolean;
};

export type PromotionFields = {
  title: string;
  description: string;
  discount: string;
  validity: string;
  details: string[];
  conditions: string;
  code: string;
  imageAlt: string;
};

/** Crea la parte final de la dirección: "Escapada de Otoño" -> "escapada-de-otono". */
export function slugify(title: string) {
  return title.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

function text(value: unknown, limit: number) {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, limit) : "";
}

/** Valida los datos del panel. */
export function validatePromotion(input: Record<string, unknown>): { data: PromotionFields; error?: undefined } | { data?: undefined; error: string } {
  const title = text(input.title, 90);
  const description = text(input.description, 500);
  const details = Array.isArray(input.details) ? input.details.map((item) => text(item, 120)).filter(Boolean).slice(0, 10) : [];

  if (title.length < 3 || !slugify(title)) return { error: "Ingresá un título." };
  if (description.length < 10) return { error: "Escribí una descripción de al menos 10 caracteres." };

  return {
    data: {
      title,
      description,
      details,
      discount: text(input.discount, 24),
      validity: text(input.validity, 80),
      conditions: text(input.conditions, 400),
      code: text(input.code, 30),
      imageAlt: text(input.imageAlt, 160),
    },
  };
}
