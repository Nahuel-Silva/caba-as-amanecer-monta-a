import { amenities, amenitiesTranslations, site } from "@/content/site";
import { intlLocale, type Locale } from "@/i18n/config";
import { countNights } from "@/lib/availability";
import { getLocation } from "@/lib/location";

/**
 * Mensajes para los huéspedes. El mismo texto se usa en el mail y en WhatsApp,
 * así lo que llega por las dos vías es idéntico. Se usa en el panel y en el servidor.
 * Cada mensaje se arma en el idioma del huésped (el de la página desde la que pidió la reserva).
 */

export type GuestMessageData = {
  guestName: string;
  cabin: string;
  arrival: string;
  departure: string;
  guests: string;
  hasBaby: boolean;
  /** Montos en pesos, sin decimales. */
  total?: number | null;
  deposit?: number | null;
  /** Alias, CBU u otros datos para pagar la seña. */
  paymentDetails?: string;
};

/** 120000 -> "$ 120.000" (siempre en pesos argentinos). */
export function formatPesos(amount: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(amount);
}

/** "2027-01-12" -> "12 de enero" / "12 de janeiro" / "January 12" */
export function formatShortDay(date: string, locale: Locale = "es") {
  return new Intl.DateTimeFormat(intlLocale[locale], { day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
}

export function guestsText(guests: string, hasBaby: boolean, locale: Locale = "es") {
  const words = { es: ["persona", "personas", "y un bebé"], pt: ["pessoa", "pessoas", "e um bebê"], en: ["guest", "guests", "and a baby"] }[locale];
  const people = guests === "1" ? `1 ${words[0]}` : `${guests} ${words[1]}`;
  return hasBaby ? `${people} ${words[2]}` : people;
}

function firstName(name: string) {
  return name.trim().split(" ")[0];
}

const texts = {
  es: {
    stay: (cabin: string, from: string, to: string, nights: string) => `${cabin} del ${from} al ${to} (${nights}`,
    nights: (count: number) => `${count} ${count === 1 ? "noche" : "noches"}`,
    depositHello: (name: string, stay: string) => `Hola ${name}, ¡gracias por elegirnos! Tenemos lugar en ${stay}.`,
    total: (amount: string) => `La tarifa total es de ${amount}.`,
    deposit: (amount: string) => `Para confirmar la reserva te pedimos una seña de ${amount}, por transferencia o Mercado Pago.`,
    balance: (amount: string) => `El saldo de ${amount} se paga al llegar.`,
    paymentTitle: "Datos para el pago:",
    depositEnd: "Cuando hagas la seña, mandanos el comprobante. ¡Gracias!",
    confirmedHello: (name: string, stay: string) => `Hola ${name}, ¡tu reserva está confirmada! Te esperamos en ${stay}.`,
    balanceOnArrival: (amount: string) => `Recibimos la seña. El saldo a pagar al llegar es de ${amount}.`,
    schedule: "Horarios:",
    address: "Dirección:",
    directions: "Cómo llegar:",
    questions: "Cualquier consulta, escribinos.",
    noRoom: (name: string, cabin: string, from: string, to: string) =>
      `Hola ${name}, gracias por escribirnos. Lamentablemente no tenemos lugar en ${cabin} del ${from} al ${to}. Si te sirven otras fechas, avisanos y lo vemos. ¡Saludos!`,
    hello: (name: string, cabin: string, from: string, to: string) =>
      `Hola ${name}, te escribimos de ${site.name} por tu reserva en ${cabin}, del ${from} al ${to}.`,
  },
  pt: {
    stay: (cabin: string, from: string, to: string, nights: string) => `${cabin}, de ${from} a ${to} (${nights}`,
    nights: (count: number) => `${count} ${count === 1 ? "noite" : "noites"}`,
    depositHello: (name: string, stay: string) => `Olá, ${name}, obrigado por nos escolher! Temos disponibilidade na ${stay}.`,
    total: (amount: string) => `A tarifa total é de ${amount} (pesos argentinos).`,
    deposit: (amount: string) => `Para confirmar a reserva, pedimos um sinal de ${amount}, por transferência ou Mercado Pago.`,
    balance: (amount: string) => `O saldo de ${amount} é pago na chegada.`,
    paymentTitle: "Dados para o pagamento:",
    depositEnd: "Quando fizer o pagamento do sinal, envie-nos o comprovante. Obrigado!",
    confirmedHello: (name: string, stay: string) => `Olá, ${name}, a sua reserva está confirmada! Esperamos você na ${stay}.`,
    balanceOnArrival: (amount: string) => `Recebemos o sinal. O saldo a pagar na chegada é de ${amount}.`,
    schedule: "Horários:",
    address: "Endereço:",
    directions: "Como chegar:",
    questions: "Qualquer dúvida, escreva para nós.",
    noRoom: (name: string, cabin: string, from: string, to: string) =>
      `Olá, ${name}, obrigado pela mensagem. Infelizmente não temos disponibilidade na ${cabin} de ${from} a ${to}. Se outras datas servirem, avise-nos e vemos. Abraços!`,
    hello: (name: string, cabin: string, from: string, to: string) =>
      `Olá, ${name}, escrevemos de ${site.name} sobre a sua reserva na ${cabin}, de ${from} a ${to}.`,
  },
  en: {
    stay: (cabin: string, from: string, to: string, nights: string) => `${cabin} from ${from} to ${to} (${nights}`,
    nights: (count: number) => `${count} ${count === 1 ? "night" : "nights"}`,
    depositHello: (name: string, stay: string) => `Hello ${name}, thank you for choosing us! We have availability at ${stay}.`,
    total: (amount: string) => `The total rate is ${amount} (Argentine pesos).`,
    deposit: (amount: string) => `To confirm the booking, we ask for a deposit of ${amount}, by bank transfer or Mercado Pago.`,
    balance: (amount: string) => `The balance of ${amount} is paid on arrival.`,
    paymentTitle: "Payment details:",
    depositEnd: "Once you've paid the deposit, please send us the receipt. Thank you!",
    confirmedHello: (name: string, stay: string) => `Hello ${name}, your booking is confirmed! We look forward to welcoming you at ${stay}.`,
    balanceOnArrival: (amount: string) => `We received the deposit. The balance to pay on arrival is ${amount}.`,
    schedule: "Times:",
    address: "Address:",
    directions: "Directions:",
    questions: "If you have any questions, just message us.",
    noRoom: (name: string, cabin: string, from: string, to: string) =>
      `Hello ${name}, thank you for getting in touch. Unfortunately we don't have availability at ${cabin} from ${from} to ${to}. If other dates work for you, let us know and we'll check. Best regards!`,
    hello: (name: string, cabin: string, from: string, to: string) =>
      `Hello ${name}, this is ${site.name} writing about your booking at ${cabin}, from ${from} to ${to}.`,
  },
} satisfies Record<Locale, unknown>;

function stayLine({ cabin, arrival, departure, guests, hasBaby }: GuestMessageData, locale: Locale) {
  const t = texts[locale];
  const people = guests !== "-" ? `, ${guestsText(guests, hasBaby, locale)}` : "";
  return `${t.stay(cabin, formatShortDay(arrival, locale), formatShortDay(departure, locale), t.nights(countNights(arrival, departure)))}${people})`;
}

/** Saldo a pagar al llegar, si se cargaron los dos montos. */
export function balanceOf({ total, deposit }: Pick<GuestMessageData, "total" | "deposit">) {
  return total && deposit && deposit <= total ? total - deposit : null;
}

export function depositMessage(data: GuestMessageData, locale: Locale = "es") {
  const t = texts[locale];
  const { total, deposit, paymentDetails } = data;
  const balance = balanceOf(data);
  return [
    t.depositHello(firstName(data.guestName), stayLine(data, locale)),
    "",
    t.total(total ? formatPesos(total) : "$____"),
    t.deposit(deposit ? formatPesos(deposit) : "$____"),
    balance !== null ? t.balance(formatPesos(balance)) : "",
    "",
    t.paymentTitle,
    paymentDetails?.trim() || "____",
    "",
    t.depositEnd,
  ]
    .filter((line, index, lines) => line !== "" || lines[index - 1] !== "")
    .join("\n");
}

export function confirmationMessage(data: GuestMessageData, locale: Locale = "es") {
  const t = texts[locale];
  const hours = locale === "es" ? amenities : amenitiesTranslations[locale];
  const schedule = hours[2]?.detail;
  const directions = getLocation()?.directionsUrl;
  const balance = balanceOf(data);
  return [
    t.confirmedHello(firstName(data.guestName), stayLine(data, locale)),
    balance !== null ? t.balanceOnArrival(formatPesos(balance)) : "",
    "",
    schedule ? `${t.schedule} ${schedule.charAt(0).toLowerCase()}${schedule.slice(1)}.` : "",
    `${t.address} ${site.address}, ${site.location}.`,
    directions ? `${t.directions} ${directions}` : "",
    "",
    t.questions,
  ]
    .filter((line, index, lines) => line !== "" || (index > 0 && lines[index - 1] !== ""))
    .join("\n");
}

export function noRoomMessage(data: GuestMessageData, locale: Locale = "es") {
  return texts[locale].noRoom(firstName(data.guestName), data.cabin, formatShortDay(data.arrival, locale), formatShortDay(data.departure, locale));
}

export function helloMessage(data: GuestMessageData, locale: Locale = "es") {
  return texts[locale].hello(firstName(data.guestName), data.cabin, formatShortDay(data.arrival, locale), formatShortDay(data.departure, locale));
}

/** Asunto de los mails al huésped desde el panel, en su idioma. */
export function guestEmailSubject(kind: "deposit" | "confirmation", locale: Locale = "es") {
  const subjects = {
    es: { deposit: `Tarifa y seña para tu reserva en ${site.name}`, confirmation: `Tu reserva en ${site.name} está confirmada` },
    pt: { deposit: `Tarifa e sinal da sua reserva em ${site.name}`, confirmation: `A sua reserva em ${site.name} está confirmada` },
    en: { deposit: `Rate and deposit for your booking at ${site.name}`, confirmation: `Your booking at ${site.name} is confirmed` },
  };
  return subjects[locale][kind];
}
