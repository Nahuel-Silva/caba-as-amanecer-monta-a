import { isAdminSession } from "@/lib/admin-auth";
import { readTranslationEdits, validatePromotion, type PromotionTranslations } from "@/lib/promotion";
import { translatePromotion } from "@/lib/promotion-translate";
import { createPromotion, deletePromotion, listPromotions, setPromotionActive, updatePromotion } from "@/lib/promotions-db";
import { isSameOrigin } from "@/lib/request-guard";
import { deleteNoticesFor } from "@/lib/subscribers-db";

const maxImageBytes = 1_500_000;

const respond = (status: number, body: Record<string, unknown>) => Response.json(body, { status });

/** Solo acepta JPEG: el panel convierte la foto antes de enviarla. */
function decodeImage(value: unknown) {
  if (typeof value !== "string" || value === "") return { image: null };
  const image = Buffer.from(value, "base64");
  const isJpeg = image[0] === 0xff && image[1] === 0xd8 && image[2] === 0xff;
  if (!isJpeg) return { error: "La foto no es válida." };
  if (image.length > maxImageBytes) return { error: "La foto es demasiado pesada." };
  return { image };
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return respond(403, { error: "Solicitud no permitida." });
  if (!(await isAdminSession())) return respond(401, { error: "Sesión vencida." });

  const input = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!input) return respond(400, { error: "Datos inválidos." });

  const hasId = Number.isInteger(input.id);
  const id = input.id as number;

  try {
    if (input.action === "delete") {
      if (!hasId) return respond(400, { error: "Datos inválidos." });
      if (!(await deletePromotion(id))) return respond(404, { error: "No encontramos esa promoción." });
      await deleteNoticesFor(id);
      return respond(200, { ok: true });
    }

    if (input.action === "set-active") {
      if (!hasId) return respond(400, { error: "Datos inválidos." });
      return (await setPromotionActive(id, input.active === true))
        ? respond(200, { ok: true })
        : respond(404, { error: "No encontramos esa promoción." });
    }

    if (input.action !== "save") return respond(400, { error: "Datos inválidos." });

    const { data, error } = validatePromotion(input);
    if (!data) return respond(400, { error });

    const decoded = decodeImage(input.imageBase64);
    if (decoded.error) return respond(400, { error: decoded.error });
    const image = decoded.image ?? null;
    if (image && !data.imageAlt) return respond(400, { error: "Describí qué se ve en la foto." });

    const isNew = input.id === undefined || input.id === null;
    if (!isNew && !hasId) return respond(400, { error: "Datos inválidos." });

    // Traducciones: si es nueva o cambió el texto en español, se rehacen solas con DeepL.
    // Si no cambió, se guardan las correcciones hechas a mano en el panel.
    const previous = isNew ? undefined : (await listPromotions()).find((promotion) => promotion.id === id);
    if (!isNew && !previous) return respond(404, { error: "No encontramos esa promoción." });
    let translations: PromotionTranslations;
    if (isNew || input.retranslate === true || !previous?.translations || Object.keys(previous.translations).length === 0) {
      translations = await translatePromotion(data);
    } else {
      translations = { ...previous.translations };
      for (const [locale, edited] of Object.entries(readTranslationEdits(input.translations)) as ["pt" | "en", { title: string; description: string; details: string[] }][]) {
        const current = translations[locale];
        if (current) translations[locale] = { ...current, ...edited };
      }
    }
    const translated = Object.keys(translations).length > 0;

    if (isNew) {
      await createPromotion(data, image, translations);
      return respond(200, { ok: true, translated });
    }
    return (await updatePromotion(id, data, image, input.removeImage === true, translations))
      ? respond(200, { ok: true, translated })
      : respond(404, { error: "No encontramos esa promoción." });
  } catch (saveError) {
    console.error("No se pudo guardar la promoción", saveError);
    return respond(502, { error: "No pudimos guardar el cambio. Probá de nuevo." });
  }
}
