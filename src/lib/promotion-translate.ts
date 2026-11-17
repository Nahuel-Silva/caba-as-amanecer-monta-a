import { prefixedLocales } from "@/i18n/config";
import { spanishTexts, type PromotionFields, type PromotionTexts, type PromotionTranslations } from "@/lib/promotion";
import { translateTexts } from "@/lib/translate";

/**
 * Traduce los textos de una promoción al portugués y al inglés con DeepL.
 * Devuelve solo los idiomas que se pudieron traducir: los que falten se muestran en español.
 */
export async function translatePromotion(fields: PromotionFields): Promise<PromotionTranslations> {
  const source = spanishTexts(fields);
  // Todos los textos en una sola lista, para hacer un único pedido por idioma.
  const flat = [source.title, source.description, source.discount, source.validity, source.conditions, source.imageAlt, ...source.details];
  const result: PromotionTranslations = {};

  for (const locale of prefixedLocales) {
    const translated = await translateTexts(flat, locale);
    if (!translated) continue;
    const [title, description, discount, validity, conditions, imageAlt, ...details] = translated;
    result[locale] = { title, description, discount, validity, conditions, imageAlt, details } satisfies PromotionTexts;
  }
  return result;
}
