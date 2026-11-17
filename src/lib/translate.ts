import type { Locale } from "@/i18n/config";

/**
 * Traducción automática con DeepL (https://www.deepl.com/pro-api). La clave va en el secreto DEEPL_API_KEY.
 * Las claves del plan gratis terminan en ":fx" y usan otra dirección. Sin clave, o si DeepL falla,
 * las funciones devuelven null y la web sigue funcionando sin traducir.
 */
const apiKey = process.env.DEEPL_API_KEY?.trim() ?? "";

export const isTranslationConfigured = apiKey.length > 0;

/** Códigos de DeepL: portugués de Brasil, inglés de Estados Unidos y español. */
const deeplLanguage: Record<Locale, string> = { es: "ES", pt: "PT-BR", en: "EN-US" };

/**
 * Traduce varios textos de una vez. Devuelve los textos traducidos en el mismo orden, o null si no se pudo.
 * `from` en null deja que DeepL detecte el idioma (sirve para los mensajes que escriben los huéspedes).
 */
export async function translateTexts(texts: string[], to: Locale, from: Locale | null = "es"): Promise<string[] | null> {
  if (!isTranslationConfigured || texts.length === 0) return null;
  // Los textos vacíos no se mandan: se devuelven vacíos.
  const toSend = texts.map((text) => text.trim()).filter(Boolean);
  if (toSend.length === 0) return texts.map(() => "");

  const host = apiKey.endsWith(":fx") ? "https://api-free.deepl.com" : "https://api.deepl.com";
  try {
    const response = await fetch(`${host}/v2/translate`, {
      method: "POST",
      headers: { Authorization: `DeepL-Auth-Key ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        text: toSend,
        target_lang: deeplLanguage[to],
        ...(from ? { source_lang: deeplLanguage[from].slice(0, 2) } : {}),
        // Respeta los saltos de línea de los mensajes.
        preserve_formatting: true,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`DeepL respondió ${response.status}: ${await response.text()}`);
    const { translations } = (await response.json()) as { translations: { text: string; detected_source_language?: string }[] };
    let index = 0;
    return texts.map((text) => (text.trim() ? translations[index++]?.text ?? text : ""));
  } catch (error) {
    console.error("No se pudo traducir con DeepL", error);
    return null;
  }
}

/** Traduce un solo texto. Devuelve null si no se pudo. */
export async function translateText(text: string, to: Locale, from: Locale | null = "es") {
  const result = await translateTexts([text], to, from);
  return result?.[0] ?? null;
}
