import { site } from "@/content/site";
import type { Promotion } from "@/lib/promotion";
import type { BulkEmail } from "@/lib/reservation-email";
import { siteUrl } from "@/lib/seo";
import { conditionsPath } from "@/lib/subscribers";

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);

/** Enlaces de baja de una persona: la página (para el pie del mail) y la dirección de baja con un clic (para Gmail y otros). */
export function unsubscribeUrls(baseUrl: string, token: string) {
  return {
    page: new URL(`/suscripcion?baja=${token}`, baseUrl).toString(),
    oneClick: new URL(`/api/suscripcion/baja?token=${token}`, baseUrl).toString(),
  };
}

/** Mail de aviso de una promoción para una persona. Cada mail lleva su propio enlace de baja. */
export function promotionNoticeEmail(promotion: Promotion, baseUrl: string, to: string, token: string): BulkEmail {
  const link = new URL(`/promociones/${promotion.slug}`, baseUrl).toString();
  const conditions = new URL(conditionsPath, baseUrl).toString();
  const unsubscribe = unsubscribeUrls(baseUrl, token);
  const highlights = [promotion.discount, promotion.validity].filter(Boolean).join(" · ");
  const subject = `Nueva promoción en ${site.name}: ${promotion.title}`;

  const text = [
    promotion.title,
    highlights,
    "",
    promotion.description,
    ...promotion.details.map((detail) => `- ${detail}`),
    promotion.conditions ? `\nCondiciones: ${promotion.conditions}` : "",
    promotion.code ? `Código: ${promotion.code}` : "",
    "",
    `Mirá la promoción y consultá: ${link}`,
    "",
    site.name,
    site.location,
    "",
    "Recibís este mail porque aceptaste recibir las promociones de las cabañas.",
    `Para no recibir más, entrá acá: ${unsubscribe.page}`,
    `Condiciones: ${conditions}`,
  ]
    .filter((line, index, lines) => line !== "" || lines[index - 1] !== "")
    .join("\n");

  const image = promotion.image ? new URL(promotion.image.src, baseUrl).toString() : "";
  const html = `<!doctype html>
<html lang="es"><body style="margin:0;padding:24px 12px;background:#f3eee4;font-family:Arial,Helvetica,sans-serif;color:#24261f">
<div style="max-width:560px;margin:0 auto;background:#fffdf7;border-radius:12px;overflow:hidden">
${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(promotion.image!.alt)}" width="560" style="display:block;width:100%;height:auto">` : ""}
<div style="padding:24px">
<p style="margin:0 0 6px;color:#b66f51;font-size:12px;font-weight:bold;letter-spacing:.12em;text-transform:uppercase">${escapeHtml(site.name)}</p>
<h1 style="margin:0 0 8px;font-family:Georgia,serif;font-size:28px;font-weight:normal">${escapeHtml(promotion.title)}</h1>
${highlights ? `<p style="margin:0 0 14px;font-size:16px;font-weight:bold">${escapeHtml(highlights)}</p>` : ""}
<p style="margin:0 0 14px;font-size:16px;line-height:1.5">${escapeHtml(promotion.description)}</p>
${promotion.details.length ? `<ul style="margin:0 0 14px;padding-left:20px;font-size:15px;line-height:1.5">${promotion.details.map((detail) => `<li>${escapeHtml(detail)}</li>`).join("")}</ul>` : ""}
${promotion.conditions ? `<p style="margin:0 0 8px;font-size:14px;color:#5d5f55">Condiciones: ${escapeHtml(promotion.conditions)}</p>` : ""}
${promotion.code ? `<p style="margin:0 0 14px;font-size:15px">Código: <strong>${escapeHtml(promotion.code)}</strong></p>` : ""}
<p style="margin:20px 0 0"><a href="${escapeHtml(link)}" style="display:inline-block;padding:12px 22px;border-radius:4px;background:#39432f;color:#fffdf7;font-weight:bold;text-decoration:none">Ver la promoción</a></p>
</div></div>
<p style="max-width:560px;margin:16px auto 0;color:#6b6c63;font-size:12px;line-height:1.5;text-align:center">
${escapeHtml(site.name)} · ${escapeHtml(site.location)}<br>
Recibís este mail porque aceptaste recibir las promociones de las cabañas.<br>
<a href="${escapeHtml(unsubscribe.page)}" style="color:#6b6c63">No quiero recibir más promociones</a> · <a href="${escapeHtml(conditions)}" style="color:#6b6c63">Condiciones</a>
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
