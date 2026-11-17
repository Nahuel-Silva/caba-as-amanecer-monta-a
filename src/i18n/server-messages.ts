import { isLocale, type Locale } from "@/i18n/config";

/**
 * Avisos que devuelve el servidor (errores de los formularios de reserva, opiniones y avisos de promociones).
 * Se escriben en español en el código y se traducen al responder, según el idioma de la página que los pidió.
 * Si se agrega un aviso nuevo, hay que sumarlo acá; si falta, se muestra en español.
 */
const messages: Record<string, { pt: string; en: string }> = {
  "Datos inválidos.": { pt: "Dados inválidos.", en: "Invalid data." },
  "Solicitud no permitida.": { pt: "Solicitação não permitida.", en: "Request not allowed." },
  "Ingresá tu nombre.": { pt: "Digite o seu nome.", en: "Please enter your name." },
  "Ingresá un email válido.": { pt: "Digite um e-mail válido.", en: "Please enter a valid email." },
  "Ingresá un teléfono de contacto.": { pt: "Digite um telefone de contato.", en: "Please enter a contact phone number." },
  "Elegí las fechas de llegada y salida.": { pt: "Escolha as datas de chegada e saída.", en: "Choose your check-in and check-out dates." },
  "La fecha de llegada no puede ser anterior a hoy.": { pt: "A data de chegada não pode ser anterior a hoje.", en: "The check-in date can't be in the past." },
  "La fecha de salida tiene que ser posterior a la de llegada.": { pt: "A data de saída precisa ser depois da chegada.", en: "The check-out date must be after the check-in date." },
  "Para estadías de más de 30 noches, escribinos por WhatsApp.": {
    pt: "Para estadias de mais de 30 noites, escreva para nós pelo WhatsApp.",
    en: "For stays of more than 30 nights, please message us on WhatsApp.",
  },
  "Elegí la cantidad de personas.": { pt: "Escolha a quantidade de pessoas.", en: "Choose the number of guests." },
  "Elegí una cabaña.": { pt: "Escolha uma cabana.", en: "Choose a cabin." },
  "El mensaje es demasiado largo.": { pt: "A mensagem é longa demais.", en: "The message is too long." },
  "Hiciste varias solicitudes seguidas. Probá de nuevo en unos minutos.": {
    pt: "Você fez várias solicitações seguidas. Tente de novo em alguns minutos.",
    en: "You've sent several requests in a row. Please try again in a few minutes.",
  },
  "Las solicitudes todavía no están disponibles. Escribinos por WhatsApp.": {
    pt: "As solicitações ainda não estão disponíveis. Escreva para nós pelo WhatsApp.",
    en: "Booking requests aren't available yet. Please message us on WhatsApp.",
  },
  "Esas fechas ya están ocupadas. Elegí otras o probá con la otra cabaña.": {
    pt: "Essas datas já estão ocupadas. Escolha outras ou tente a outra cabana.",
    en: "Those dates are already taken. Choose others or try the other cabin.",
  },
  "No pudimos enviar tu solicitud. Probá de nuevo o escribinos por WhatsApp.": {
    pt: "Não conseguimos enviar a sua solicitação. Tente de novo ou escreva para nós pelo WhatsApp.",
    en: "We couldn't send your request. Please try again or message us on WhatsApp.",
  },
  "Elegí una calificación de 1 a 5 estrellas.": { pt: "Escolha uma nota de 1 a 5 estrelas.", en: "Choose a rating from 1 to 5 stars." },
  "Ingresá un título.": { pt: "Digite um título.", en: "Please enter a title." },
  "Escribí un comentario de al menos 10 caracteres.": { pt: "Escreva um comentário de pelo menos 10 caracteres.", en: "Please write a comment of at least 10 characters." },
  "Necesitamos tu autorización para publicar la reseña.": { pt: "Precisamos da sua autorização para publicar a avaliação.", en: "We need your permission to publish the review." },
  "Las reseñas todavía no están disponibles.": { pt: "As avaliações ainda não estão disponíveis.", en: "Reviews aren't available yet." },
  "Enviaste varias reseñas seguidas. Probá de nuevo más tarde.": {
    pt: "Você enviou várias avaliações seguidas. Tente de novo mais tarde.",
    en: "You've sent several reviews in a row. Please try again later.",
  },
  "No pudimos guardar tu reseña. Probá de nuevo más tarde.": {
    pt: "Não conseguimos salvar a sua avaliação. Tente de novo mais tarde.",
    en: "We couldn't save your review. Please try again later.",
  },
  "Hiciste varios intentos seguidos. Probá de nuevo en unos minutos.": {
    pt: "Você fez várias tentativas seguidas. Tente de novo em alguns minutos.",
    en: "You've tried several times in a row. Please try again in a few minutes.",
  },
  "El enlace no es válido. Copialo completo desde el mail.": { pt: "O link não é válido. Copie-o inteiro a partir do e-mail.", en: "The link isn't valid. Copy it in full from the email." },
  "El enlace venció o ya no existe. Podés anotarte de nuevo en la página Promociones.": {
    pt: "O link expirou ou não existe mais. Você pode se cadastrar de novo na página Promoções.",
    en: "The link has expired or no longer exists. You can sign up again on the Offers page.",
  },
  "Para anotarte tenés que aceptar recibir las promociones.": { pt: "Para se cadastrar, você precisa aceitar receber as promoções.", en: "To sign up, you need to agree to receive the offers." },
  "Los avisos por mail todavía no están disponibles. Probá más adelante.": {
    pt: "Os avisos por e-mail ainda não estão disponíveis. Tente mais tarde.",
    en: "Email notifications aren't available yet. Please try again later.",
  },
  "No pudimos mandarte el mail para confirmar. Probá de nuevo más tarde.": {
    pt: "Não conseguimos enviar o e-mail de confirmação. Tente de novo mais tarde.",
    en: "We couldn't send you the confirmation email. Please try again later.",
  },
  "No pudimos hacer el cambio. Probá de nuevo.": { pt: "Não conseguimos fazer a alteração. Tente de novo.", en: "We couldn't make the change. Please try again." },
  "Te mandamos un mail para confirmar.": { pt: "Enviamos um e-mail para você confirmar.", en: "We sent you an email to confirm." },
  "Listo. Revisá tu correo para confirmar.": { pt: "Pronto. Confira o seu e-mail para confirmar.", en: "Done. Check your inbox to confirm." },
};

/** Idioma pedido por la página (campo "locale" del formulario). Si falta o no es válido, español. */
export function requestLocale(value: unknown): Locale {
  return isLocale(value) ? value : "es";
}

/** Aviso del servidor en el idioma de la página. */
export function serverMessage(text: string, locale: Locale) {
  return locale === "es" ? text : (messages[text]?.[locale] ?? text);
}
