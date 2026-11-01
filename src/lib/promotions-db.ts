import type { Row } from "@libsql/client";
import { getDatabase, isDatabaseConfigured } from "@/lib/db";
import { slugify, type Promotion, type PromotionFields } from "@/lib/promotion";

const columns = "id, slug, title, description, discount, validity, details, conditions, code, image_alt, active, updated_at, image_data IS NOT NULL AS has_image";

function toPromotion(row: Row): Promotion {
  const id = Number(row.id);
  const alt = String(row.image_alt);

  return {
    id,
    slug: String(row.slug),
    title: String(row.title),
    description: String(row.description),
    discount: String(row.discount) || undefined,
    validity: String(row.validity) || undefined,
    details: JSON.parse(String(row.details)) as string[],
    conditions: String(row.conditions) || undefined,
    code: String(row.code) || undefined,
    image: row.has_image ? { src: `/api/promociones/${id}/imagen?v=${encodeURIComponent(String(row.updated_at))}`, alt } : undefined,
    active: Number(row.active) === 1,
  };
}

export async function listPromotions(): Promise<Promotion[]> {
  const database = await getDatabase();
  const { rows } = await database.execute(`SELECT ${columns} FROM promotions ORDER BY active DESC, id DESC`);
  return rows.map(toPromotion);
}

/** Promociones visibles en la web. Si la base falla, la página muestra que no hay promociones activas. */
export async function listActivePromotions(): Promise<Promotion[]> {
  if (!isDatabaseConfigured) return [];
  try {
    const database = await getDatabase();
    const { rows } = await database.execute(`SELECT ${columns} FROM promotions WHERE active = 1 ORDER BY id DESC`);
    return rows.map(toPromotion);
  } catch (error) {
    console.error("No se pudieron leer las promociones", error);
    return [];
  }
}

export async function getActivePromotion(slug: string): Promise<Promotion | undefined> {
  if (!isDatabaseConfigured) return undefined;
  try {
    const database = await getDatabase();
    const { rows } = await database.execute({ sql: `SELECT ${columns} FROM promotions WHERE slug = ? AND active = 1`, args: [slug] });
    return rows[0] ? toPromotion(rows[0]) : undefined;
  } catch (error) {
    console.error("No se pudo leer la promoción", error);
    return undefined;
  }
}

export async function getPromotionImage(id: number) {
  const database = await getDatabase();
  const { rows } = await database.execute({ sql: "SELECT image_data FROM promotions WHERE id = ?", args: [id] });
  return (rows[0]?.image_data as ArrayBuffer | null | undefined) ?? null;
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

export async function createPromotion(fields: PromotionFields, image: Buffer | null) {
  const database = await getDatabase();
  await database.execute({
    sql: `INSERT INTO promotions (slug, title, description, discount, validity, details, conditions, code, image_data, image_alt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      await uniqueSlug(fields.title),
      fields.title,
      fields.description,
      fields.discount,
      fields.validity,
      JSON.stringify(fields.details),
      fields.conditions,
      fields.code,
      image,
      fields.imageAlt,
    ],
  });
}

/** Actualiza los textos. La foto solo cambia si llega una nueva o si se pide quitarla. */
export async function updatePromotion(id: number, fields: PromotionFields, image: Buffer | null, removeImage: boolean) {
  const database = await getDatabase();
  const { rowsAffected } = await database.execute({
    sql: `UPDATE promotions SET title = ?, description = ?, discount = ?, validity = ?, details = ?, conditions = ?, code = ?, image_alt = ?,
        image_data = CASE WHEN ? = 1 THEN NULL WHEN ? IS NOT NULL THEN ? ELSE image_data END,
        updated_at = datetime('now')
      WHERE id = ?`,
    args: [
      fields.title,
      fields.description,
      fields.discount,
      fields.validity,
      JSON.stringify(fields.details),
      fields.conditions,
      fields.code,
      fields.imageAlt,
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
