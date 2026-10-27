export const PENDING = "PENDIENTE" as const;

export const site = {
  name: "Cabañas Amanecer de Montaña",
  location: "Malargüe, Mendoza, Argentina",
  address: PENDING,
  whatsappNumber: PENDING,
  intro:
    "Un lugar para hacer una pausa, descansar y descubrir los paisajes del sur mendocino. Estamos preparando cada detalle para compartir más información pronto.",
  contactNote: "Los datos de contacto se publicarán cuando estén confirmados.",
} as const;

export const amenities = [
  { name: "Servicios", detail: PENDING },
  { name: "Equipamiento", detail: PENDING },
  { name: "Horarios", detail: PENDING },
  { name: "Medios de pago", detail: PENDING },
] as const;

export const attractions = [
  { name: "Caverna de las Brujas", detail: PENDING },
  { name: "Castillos de Pincheira", detail: PENDING },
  { name: "La Payunia", detail: PENDING },
  { name: "Laguna de la Niña Encantada", detail: PENDING },
] as const;

export const faqs = [
  { question: "¿Cómo consultar disponibilidad?", answer: PENDING },
  { question: "¿Cuáles son los medios de pago?", answer: PENDING },
  { question: "¿Cuáles son los horarios de ingreso y salida?", answer: PENDING },
  { question: "¿Se aceptan mascotas?", answer: PENDING },
] as const;