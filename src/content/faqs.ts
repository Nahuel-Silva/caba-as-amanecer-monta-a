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
      "Cada cabaña es para 4 personas: un dormitorio matrimonial (Queen Size) y otro con dos camas individuales de 1 plaza y media. Si lo pedís, se puede agregar una cama extra de 1 plaza con costo adicional.",
  },
  {
    question: "¿Qué servicios incluye la estadía?",
    answer:
      "WiFi, televisor con DIRECTV, aire acondicionado, calefacción a gas natural y estufa a leña, cocina equipada, cochera individual techada, parrilla individual en cada cabaña y servicio de ropa blanca.",
  },
  {
    question: "¿Cómo funciona la limpieza y el cambio de ropa blanca?",
    answer:
      "La limpieza se hace día por medio de 9 a 12 hs, sin huéspedes en la cabaña, por lo que los objetos personales deben guardarse dentro del placard (el complejo no se hace cargo de su pérdida). Las sábanas y toallas se cambian cada 3 días.",
  },
  {
    question: "¿Puedo cambiar la fecha de mi reserva?",
    answer:
      "Sí. Si necesitás cambiar la fecha, avisanos con anticipación y buscamos juntos una nueva. El cambio queda sujeto a la disponibilidad de las cabañas y no aplica para temporada alta. Escribinos por WhatsApp y lo coordinamos. Tené en cuenta que, si la tarifa para la nueva fecha aumentó, el precio de la estadía se actualiza a esa tarifa.",
  },
  {
    question: "¿Se devuelve la seña si cancelo la reserva?",
    answer:
      "No. La seña del 50 % no es reembolsable, aunque la cancelación sea por problemas de transporte aéreo o terrestre o por el clima. Si no podés viajar en la fecha reservada, escribinos: en lugar de cancelar, podemos buscar juntos una nueva fecha.",
  },
  {
    question: "¿Qué actividades se pueden hacer en la zona?",
    answer:
      "En los alrededores hay senderos y montañas para hacer trekking, mountain bike, tirolesa y rapel en todas las épocas del año.",
  },
  {
    question: "¿Se aceptan mascotas?",
    answer: "No, no se aceptan mascotas.",
  },
  {
    question: "¿Cómo llego?",
    answer:
      "Estamos a 100 metros de la Ruta Nacional 40, por el acceso Norte a la ciudad de Malargüe, y a aproximadamente 1 kilómetro del centro. El centro de ski Las Leñas está a 80 km.",
  },
];
