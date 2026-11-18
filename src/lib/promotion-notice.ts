import { site } from "@/content/site";
import { htmlLang, localizePath, type Locale } from "@/i18n/config";
import { formatPesos } from "@/lib/guest-messages";
import type { Promotion } from "@/lib/promotion";
import type { BulkEmail } from "@/lib/reservation-email";
import { siteUrl } from "@/lib/seo";
import { conditionsPath } from "@/lib/subscribers";

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);

/** Textos del mail de aviso en cada idioma. */
const noticeTexts: Record<Locale, { subject: (title: string) => string; price: string; conditions: string; see: string; button: string; why: string; unsubscribe: string; unsubscribeLink: string; terms: string }> = {
  es: {
    subject: (title) => `Nueva promoción en ${site.name}: ${title}`,
    price: "Precio total:",
    conditions: "Condiciones:",
    see: "Mirá la promoción y consultá:",
    button: "Ver la promoción",
    why: "Recibís este mail porque aceptaste recibir las promociones de las cabañas.",
    unsubscribe: "Para no recibir más, entrá acá:",
    unsubscribeLink: "No quiero recibir más promociones",
    terms: "Condiciones",
  },
  pt: {
    subject: (title) => `Nova promoção em ${site.name}: ${title}`,
    price: "Preço total:",
    conditions: "Condições:",
    see: "Veja a promoção e consulte:",
    button: "Ver a promoção",
    why: "Você recebe este e-mail porque aceitou receber as promoções das cabanas.",
    unsubscribe: "Para não receber mais, acesse:",
    unsubscribeLink: "Não quero receber mais promoções",
    terms: "Condições",
  },
  en: {
    subject: (title) => `New offer at ${site.name}: ${title}`,
    price: "Total price:",
    conditions: "Terms:",
    see: "See the offer and get in touch:",
    button: "See the offer",
    why: "You're receiving this email because you agreed to receive the cabins' offers.",
    unsubscribe: "To stop receiving them, go to:",
    unsubscribeLink: "Unsubscribe from offers",
    terms: "Terms",
  },
};

/** Enlaces de baja de una persona: la página (para el pie del mail) y la dirección de baja con un clic (para Gmail y otros). */
export function unsubscribeUrls(baseUrl: string, token: string, locale: Locale = "es") {
  return {
    page: new URL(`${localizePath(locale, "/suscripcion")}?baja=${token}`, baseUrl).toString(),
    oneClick: new URL(`/api/suscripcion/baja?token=${token}`, baseUrl).toString(),
  };
}

/**
 * Mail de aviso de una promoción para una persona, en su idioma (la promoción tiene que venir ya traducida).
 * Cada mail lleva su propio enlace de baja.
 */
export function promotionNoticeEmail(promotion: Promotion, baseUrl: string, to: string, token: string, locale: Locale = "es"): BulkEmail {
  const t = noticeTexts[locale];
  const link = new URL(localizePath(locale, `/promociones/${promotion.slug}`), baseUrl).toString();
  const conditions = new URL(localizePath(locale, conditionsPath), baseUrl).toString();
  const unsubscribe = unsubscribeUrls(baseUrl, token, locale);
  const highlights = [promotion.discount, promotion.validity].filter(Boolean).join(" · ");
  const price = promotion.price !== undefined ? `${t.price} ${formatPesos(promotion.price)}` : "";
  const subject = t.subject(promotion.title);

  const text = [
    promotion.title,
    highlights,
    "",
    promotion.description,
    price,
    ...promotion.details.map((detail) => `- ${detail}`),
    promotion.conditions ? `\n${t.conditions} ${promotion.conditions}` : "",
    "",
    `${t.see} ${link}`,
    "",
    site.name,
    site.location,
    "",
    t.why,
    `${t.unsubscribe} ${unsubscribe.page}`,
    `${t.terms}: ${conditions}`,
  ]
    .filter((line, index, lines) => line !== "" || lines[index - 1] !== "")
    .join("\n");

  const image = promotion.image ? new URL(promotion.image.src, baseUrl).toString() : "";
  const html = `<!doctype html>
<html lang="${htmlLang[locale]}"><body style="margin:0;padding:24px 12px;background:#f3eee4;font-family:Arial,Helvetica,sans-serif;color:#24261f">
<div style="max-width:560px;margin:0 auto;background:#fffdf7;border-radius:12px;overflow:hidden">
${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(promotion.image!.alt)}" width="560" style="display:block;width:100%;height:auto">` : ""}
<div style="padding:24px">
<p style="margin:0 0 6px;color:#b66f51;font-size:12px;font-weight:bold;letter-spacing:.12em;text-transform:uppercase">${escapeHtml(site.name)}</p>
<h1 style="margin:0 0 8px;font-family:Georgia,serif;font-size:28px;font-weight:normal">${escapeHtml(promotion.title)}</h1>
${highlights ? `<p style="margin:0 0 14px;font-size:16px;font-weight:bold">${escapeHtml(highlights)}</p>` : ""}
<p style="margin:0 0 14px;font-size:16px;line-height:1.5">${escapeHtml(promotion.description)}</p>
${price ? `<p style="margin:0 0 14px;font-size:18px"><strong>${escapeHtml(price)}</strong></p>` : ""}
${promotion.details.length ? `<ul style="margin:0 0 14px;padding-left:20px;font-size:15px;line-height:1.5">${promotion.details.map((detail) => `<li>${escapeHtml(detail)}</li>`).join("")}</ul>` : ""}
${promotion.conditions ? `<p style="margin:0 0 8px;font-size:14px;color:#5d5f55">${escapeHtml(t.conditions)} ${escapeHtml(promotion.conditions)}</p>` : ""}
<p style="margin:20px 0 0"><a href="${escapeHtml(link)}" style="display:inline-block;padding:12px 22px;border-radius:4px;background:#39432f;color:#fffdf7;font-weight:bold;text-decoration:none">${escapeHtml(t.button)}</a></p>
</div></div>
<p style="max-width:560px;margin:16px auto 0;color:#6b6c63;font-size:12px;line-height:1.5;text-align:center">
${escapeHtml(site.name)} · ${escapeHtml(site.location)}<br>
${escapeHtml(t.why)}<br>
<a href="${escapeHtml(unsubscribe.page)}" style="color:#6b6c63">${escapeHtml(t.unsubscribeLink)}</a> · <a href="${escapeHtml(conditions)}" style="color:#6b6c63">${escapeHtml(t.terms)}</a>
</p>
</body></html>`;

  return {
    to,
    subject,
    text,
    html,
    // Baja con un clic desde el propio programa de mail (Gmail la muestra junto al remitente).
    headers: { "List-Unsubscribe": `<${unsubscribe.oneClick}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
  };
}

/** Dirección de la web para los enlaces de los mails: la pública si ya está configurada, o la de esta visita. */
export function publicBaseUrl(request: Request) {
  return siteUrl ?? new URL(request.url).origin;
}
