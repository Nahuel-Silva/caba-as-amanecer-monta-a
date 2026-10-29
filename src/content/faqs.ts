export type Faq = {
  question: string;
  /** Respuesta aprobada por el propietario. */
  answer: string;
};

export const faqs: Faq[] = [
  {
    question: "¿Cómo consulto la disponibilidad?",
    answer:
      "Escribinos con las fechas y la cantidad de huéspedes. Las tarifas, valores y fechas de temporada pueden cambiar sin previo aviso, por eso conviene confirmarlos antes de reservar.",
  },
  {
    question: "¿Cómo se confirma una reserva?",
    answer:
      "Se requiere el pago del 50 % del total de la estadía (no reembolsable), por transferencia bancaria o Mercado Pago. La diferencia se abona al ingresar. Una conversación de consulta no confirma la reserva: queda confirmada con el pago de la seña. La solicitud de reserva y su pago implican conocer y aceptar las condiciones generales.",
  },
  {
    question: "¿Cuáles son los medios de pago?",
    answer:
      "La seña del 50 % se paga por transferencia bancaria o Mercado Pago. El saldo se abona al momento del ingreso.",
  },
  {
    question: "¿Cuáles son los horarios de ingreso y salida?",
    answer:
      "El check-in es a partir de las 14 hs y el check-out hasta las 10 hs. Si decidís ingresar más tarde o retirarte antes de lo acordado, se cobra la estadía completa.",
  },
  {
    question: "¿Cuántas personas entran en cada cabaña?",
    answer:
      "Cada cabaña es para 5 personas: un dormitorio matrimonial (Queen Size), otro con dos camas individuales de 1 plaza y media, y un sofá cama de 1 plaza y media en la sala comedor.",
  },
  {
    question: "¿Qué servicios incluye la estadía?",
    answer:
      "WiFi, televisor con DIRECTV, aire acondicionado, calefacción a gas natural y estufa a leña, cocina equipada, cochera cubierta, parrilla y servicio de ropa blanca.",
  },
  {
    question: "¿Cómo funciona la limpieza y el cambio de ropa blanca?",
    answer:
      "La limpieza se hace día por medio de 9 a 12 hs, sin huéspedes en la cabaña, por lo que los objetos personales deben guardarse dentro del placard (el complejo no se hace cargo de su pérdida). Las sábanas y toallas se cambian cada 3 días.",
  },
  {
    question: "¿Puedo cambiar la fecha o pedir una devolución?",
    answer:
      "No se reconocen cambios de fecha ni devoluciones sobre las reservas confirmadas por inconvenientes de transporte aéreo o terrestre ni por condiciones climáticas. La seña del 50 % no es reembolsable.",
  },
  {
    question: "¿Se aceptan mascotas?",
    answer: "No, no se aceptan mascotas.",
  },
  {
    question: "¿Cómo llego?",
    answer:
      "Estamos a 100 metros de la Ruta Nacional 40, por el acceso Norte a la ciudad de Malargüe, y a aproximadamente 1 kilómetro del centro.",
  },
];
