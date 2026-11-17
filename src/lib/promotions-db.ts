import { getDatabase, isDatabaseConfigured, type DbRow } from "@/lib/db";
import type { Locale } from "@/i18n/config";
import { slugify, type Promotion, type PromotionFields, type PromotionTranslations } from "@/lib/promotion";

const columns =
  "id, slug, title, description, discount, validity, price, details, conditions, code, image_alt, active, updated_at, translations, image_data IS NOT NULL AS has_image";

function readTranslations(value: unknown): PromotionTranslations {
  try {
    return JSON.parse(String(value ?? "{}")) as PromotionTranslations;
  } catch {
    return {};
  }
}

/**
 * Arma la promoción en el idioma pedido. Si todavía no está traducida (por ejemplo, porque DeepL no respondió),
 * se muestra en español. En el panel (withTranslations) se devuelve en español con sus traducciones aparte.
 */
function toPromotion(row: DbRow, locale: Locale = "es", withTranslations = false): Promotion {
  const id = Number(row.id);
  const translations = readTranslations(row.translations);
  const translated = locale === "es" ? undefined : translations[locale];
  const pick = (spanish: string, other: string | undefined) => (translated && other !== undefined ? other : spanish);

  return {
    id,
    slug: String(row.slug),
    title: pick(String(row.title), translated?.title),
    description: pick(String(row.description), translated?.description),
    discount: pick(String(row.discount), translated?.discount) || undefined,
    validity: pick(String(row.validity), translated?.validity) || undefined,
    price: row.price === null || row.price === undefined ? undefined : Number(row.price),
    details: translated?.details ?? (JSON.parse(String(row.details)) as string[]),
    conditions: pick(String(row.conditions), translated?.conditions) || undefined,
    code: String(row.code) || undefined,
    image: row.has_image
      ? { src: `/api/promociones/${id}/imagen?v=${encodeURIComponent(String(row.updated_at))}`, alt: pick(String(row.image_alt), translated?.imageAlt) }
      : undefined,
    active: Number(row.active) === 1,
    ...(withTranslations ? { translations } : {}),
  };
}

/** Todas las promociones, para el panel: en español y con sus traducciones. */
export async function listPromotions(): Promise<Promotion[]> {
  const database = await getDatabase();
  const { rows } = await database.execute(`SELECT ${columns} FROM promotions ORDER BY active DESC, id DESC`);
  return rows.map((row) => toPromotion(row, "es", true));
}

/** Una promoción en un idioma, para el aviso por mail a quienes se anotaron en ese idioma. */
export async function getPromotionIn(id: number, locale: Locale) {
  const database = await getDatabase();
  const { rows } = await database.execute({ sql: `SELECT ${columns} FROM promotions WHERE id = ?`, args: [id] });
  return rows[0] ? toPromotion(rows[0], locale) : undefined;
}

/** Promociones visibles en la web, en el idioma pedido. Si la base falla, la página muestra que no hay promociones activas. */
export async function listActivePromotions(locale: Locale = "es"): Promise<Promotion[]> {
  if (!isDatabaseConfigured) return [];
  try {
    const database = await getDatabase();
    const { rows } = await database.execute(`SELECT ${columns} FROM promotions WHERE active = 1 ORDER BY id DESC`);
    return rows.map((row) => toPromotion(row, locale));
  } catch (error) {
    console.error("No se pudieron leer las promociones", error);
    return [];
  }
}

export async function getActivePromotion(slug: string, locale: Locale = "es"): Promise<Promotion | undefined> {
  if (!isDatabaseConfigured) return undefined;
  try {
    const database = await getDatabase();
    const { rows } = await database.execute({ sql: `SELECT ${columns} FROM promotions WHERE slug = ? AND active = 1`, args: [slug] });
    return rows[0] ? toPromotion(rows[0], locale) : undefined;
  } catch (error) {
    console.error("No se pudo leer la promoción", error);
    return undefined;
  }
}

export async function getPromotionImage(id: number) {
  const database = await getDatabase();
  const { rows } = await database.execute({ sql: "SELECT image_data FROM promotions WHERE id = ?", args: [id] });
  const value = rows[0]?.image_data;
  // D1 devuelve los BLOB como lista de números; se aceptan también ArrayBuffer y Uint8Array.
  if (value instanceof ArrayBuffer) return value;
  if (Array.isArray(value)) return new Uint8Array(value as number[]).buffer;
  if (value instanceof Uint8Array) return value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength) as ArrayBuffer;
  return null;
}

async function uniqueSlug(title: string) {
  const database = await getDatabase();
  const base = slugify(title);
  const { rows } = await database.execute({ sql: "SELECT slug FROM promotions WHERE slug = ? OR slug LIKE ?", args: [base, `${base}-%`] });
  const taken = new Set(rows.map((row) => String(row.slug)));
  if (!taken.has(base)) return base;
  let suffix = 2;
  while (taken.has(`${base}-${suffix}`)) suffix++;
  return `${base}-${suffix}`;
}

export async function createPromotion(fields: PromotionFields, image: Buffer | null, translations: PromotionTranslations = {}) {
  const database = await getDatabase();
  await database.execute({
    sql: `INSERT INTO promotions (slug, title, description, discount, validity, price, details, conditions, code, image_data, image_alt, translations)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      await uniqueSlug(fields.title),
      fields.title,
      fields.description,
      fields.discount,
      fields.validity,
      fields.price,
      JSON.stringify(fields.details),
      fields.conditions,
      fields.code,
      image,
      fields.imageAlt,
      JSON.stringify(translations),
    ],
  });
}

/** Actualiza los textos. La foto solo cambia si llega una nueva o si se pide quitarla. */
export async function updatePromotion(id: number, fields: PromotionFields, image: Buffer | null, removeImage: boolean, translations: PromotionTranslations = {}) {
  const database = await getDatabase();
  const { rowsAffected } = await database.execute({
    sql: `UPDATE promotions SET title = ?, description = ?, discount = ?, validity = ?, price = ?, details = ?, conditions = ?, code = ?, image_alt = ?, translations = ?,
        image_data = CASE WHEN ? = 1 THEN NULL WHEN ? IS NOT NULL THEN ? ELSE image_data END,
        updated_at = datetime('now')
      WHERE id = ?`,
    args: [
      fields.title,
      fields.description,
      fields.discount,
      fields.validity,
      fields.price,
      JSON.stringify(fields.details),
      fields.conditions,
      fields.code,
      fields.imageAlt,
      JSON.stringify(translations),
      removeImage ? 1 : 0,
      image,
      image,
      id,
    ],
  });
  return rowsAffected === 1;
}

export async function setPromotionActive(id: number, active: boolean) {
  const database = await getDatabase();
  const { rowsAffected } = await database.execute({ sql: "UPDATE promotions SET active = ? WHERE id = ?", args: [active ? 1 : 0, id] });
  return rowsAffected === 1;
}

export async function deletePromotion(id: number) {
  const database = await getDatabase();
  const { rowsAffected } = await database.execute({ sql: "DELETE FROM promotions WHERE id = ?", args: [id] });
  return rowsAffected === 1;
}
