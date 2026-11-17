import { isLocale, type Locale } from "@/i18n/config";
import { getDatabase, type DbRow } from "@/lib/db";
import { consentVersion, type PromotionNoticeSummary, type SubscriberRecord, type SubscriberSource } from "@/lib/subscribers";

/** Máximo de mails por cada vez que se toca "Avisar": el plan gratis de Resend permite 100 por día. */
export const noticeBatchSize = 100;

/** Las suscripciones de la web sin confirmar se descartan después de una semana. */
const pendingDays = 7;

function newToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function toSubscriber(row: DbRow): SubscriberRecord {
  return {
    id: Number(row.id),
    email: String(row.email),
    name: String(row.name),
    phone: String(row.phone),
    source: String(row.source) as SubscriberSource,
    status: String(row.status) as SubscriberRecord["status"],
    createdAt: String(row.created_at),
    confirmedAt: String(row.confirmed_at),
    locale: isLocale(row.locale) ? row.locale : "es",
  };
}

async function deleteStalePending() {
  const database = await getDatabase();
  await database.execute({
    sql: "DELETE FROM subscribers WHERE status = 'pending' AND created_at < datetime('now', ?)",
    args: [`-${pendingDays} days`],
  });
}

export async function listSubscribers(): Promise<SubscriberRecord[]> {
  await deleteStalePending();
  const database = await getDatabase();
  const { rows } = await database.execute("SELECT * FROM subscribers ORDER BY status = 'active' DESC, id DESC");
  return rows.map(toSubscriber);
}

/**
 * Anota a quien marcó la casilla en el formulario de reserva. Queda activa enseguida: es su propio mail,
 * el que usó para reservar. Si ya estaba anotada, se actualizan su nombre y teléfono.
 */
export async function subscribeFromReservation(email: string, name: string, phone: string, locale: Locale = "es") {
  const database = await getDatabase();
  await database.execute({
    sql: `INSERT INTO subscribers (email, name, phone, source, status, token, consent_version, confirmed_at, locale)
      VALUES (?, ?, ?, 'reserva', 'active', ?, ?, datetime('now'), ?)
      ON CONFLICT (email) DO UPDATE SET name = excluded.name, phone = excluded.phone, consent_version = excluded.consent_version,
        locale = excluded.locale,
        source = CASE WHEN subscribers.status = 'active' THEN subscribers.source ELSE 'reserva' END,
        confirmed_at = CASE WHEN subscribers.status = 'active' THEN subscribers.confirmed_at ELSE excluded.confirmed_at END,
        status = 'active'`,
    args: [email, name, phone, newToken(), consentVersion, locale],
  });
}

/**
 * Anota un mail desde la página Promociones. Como cualquiera puede escribir cualquier mail, queda pendiente
 * hasta que la persona confirme desde el mail que le llega. Devuelve el código para armar ese enlace,
 * o null si ya estaba confirmada.
 */
export async function subscribeFromWeb(email: string, locale: Locale = "es"): Promise<string | null> {
  await deleteStalePending();
  const database = await getDatabase();
  const { rows } = await database.execute({ sql: "SELECT status, token FROM subscribers WHERE email = ?", args: [email] });
  if (rows[0]?.status === "active") return null;
  if (rows[0]) {
    await database.execute({ sql: "UPDATE subscribers SET locale = ? WHERE email = ?", args: [locale, email] });
    return String(rows[0].token);
  }

  const token = newToken();
  await database.execute({
    sql: "INSERT INTO subscribers (email, source, status, token, consent_version, locale) VALUES (?, 'web', 'pending', ?, ?, ?)",
    args: [email, token, consentVersion, locale],
  });
  return token;
}

/** Confirma la suscripción desde el enlace del mail. */
export async function confirmSubscription(token: string) {
  const database = await getDatabase();
  const { rowsAffected } = await database.execute({
    sql: "UPDATE subscribers SET status = 'active', confirmed_at = CASE WHEN confirmed_at = '' THEN datetime('now') ELSE confirmed_at END WHERE token = ?",
    args: [token],
  });
  return rowsAffected === 1;
}

/** Da de baja: borra a la persona y su historial de avisos. */
export async function unsubscribe(token: string) {
  const database = await getDatabase();
  const { rows } = await database.execute({ sql: "SELECT id FROM subscribers WHERE token = ?", args: [token] });
  if (!rows[0]) return false;
  return removeSubscriber(Number(rows[0].id));
}

/** Saca a una persona de la lista desde el panel (por ejemplo, si lo pidió por WhatsApp). */
export async function removeSubscriber(id: number) {
  const database = await getDatabase();
  await database.execute({ sql: "DELETE FROM promotion_notices WHERE subscriber_id = ?", args: [id] });
  const { rowsAffected } = await database.execute({ sql: "DELETE FROM subscribers WHERE id = ?", args: [id] });
  return rowsAffected === 1;
}

/** Personas confirmadas que todavía no recibieron el aviso de esta promoción (como mucho, una tanda). */
export async function subscribersToNotify(promotionId: number) {
  const database = await getDatabase();
  const { rows } = await database.execute({
    sql: `SELECT id, email, token, locale FROM subscribers
      WHERE status = 'active' AND id NOT IN (SELECT subscriber_id FROM promotion_notices WHERE promotion_id = ?)
      ORDER BY id LIMIT ?`,
    args: [promotionId, noticeBatchSize],
  });
  return rows.map((row) => ({ id: Number(row.id), email: String(row.email), token: String(row.token), locale: (isLocale(row.locale) ? row.locale : "es") as Locale }));
}

/** Cuántas personas confirmadas faltan avisar de esta promoción. */
export async function countPendingNotices(promotionId: number) {
  const database = await getDatabase();
  const { rows } = await database.execute({
    sql: `SELECT COUNT(*) AS total FROM subscribers
      WHERE status = 'active' AND id NOT IN (SELECT subscriber_id FROM promotion_notices WHERE promotion_id = ?)`,
    args: [promotionId],
  });
  return Number(rows[0]?.total ?? 0);
}

/** Registra a quiénes se les mandó el aviso. Los id van como una lista JSON (D1 limita la cantidad de parámetros). */
export async function recordNotices(promotionId: number, subscriberIds: number[]) {
  if (subscriberIds.length === 0) return;
  const database = await getDatabase();
  await database.execute({
    sql: "INSERT OR IGNORE INTO promotion_notices (promotion_id, subscriber_id) SELECT ?, value FROM json_each(?)",
    args: [promotionId, JSON.stringify(subscriberIds)],
  });
}

export async function getNoticeSummary(): Promise<PromotionNoticeSummary> {
  const database = await getDatabase();
  const { rows } = await database.execute(
    "SELECT promotion_id, COUNT(*) AS sent, MAX(sent_at) AS last_sent_at FROM promotion_notices GROUP BY promotion_id",
  );
  return Object.fromEntries(rows.map((row) => [Number(row.promotion_id), { sent: Number(row.sent), lastSentAt: String(row.last_sent_at) }]));
}

/** Al borrar una promoción se borra también su historial de avisos. */
export async function deleteNoticesFor(promotionId: number) {
  const database = await getDatabase();
  await database.execute({ sql: "DELETE FROM promotion_notices WHERE promotion_id = ?", args: [promotionId] });
}
