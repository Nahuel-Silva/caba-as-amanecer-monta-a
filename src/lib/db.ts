/**
 * Base de datos: Cloudflare D1 (SQLite), binding `DB` (ver wrangler.jsonc).
 * - En Cloudflare Workers es la base real "cabanas-amanecer".
 * - En desarrollo (`next dev`), next.config.ts llama a initOpenNextCloudflareForDev() y la web usa una D1 simulada
 *   que se guarda en la carpeta .wrangler (ignorada por git). Las tablas se crean solas.
 */

/** La web siempre tiene base de datos (D1). Se mantiene para que las funciones que la usan lo dejen explícito. */
export const isDatabaseConfigured = true;

export type DbRow = Record<string, unknown>;
export type DbResult = { rows: DbRow[]; rowsAffected: number };
export type DbQuery = string | { sql: string; args?: unknown[] };
/** Lo único que la web necesita de la base: ejecutar una consulta con parámetros. */
export type Database = { execute(query: DbQuery): Promise<DbResult> };

const schema = [
  `CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cabin_slug TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    arrival TEXT NOT NULL,
    departure TEXT NOT NULL,
    guests TEXT NOT NULL,
    has_baby INTEGER NOT NULL DEFAULT 0,
    message TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected')),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  "CREATE INDEX IF NOT EXISTS reservations_stay ON reservations (cabin_slug, status, arrival, departure)",
  `CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author TEXT NOT NULL,
    title TEXT NOT NULL,
    quote TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS promotions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    discount TEXT NOT NULL DEFAULT '',
    validity TEXT NOT NULL DEFAULT '',
    details TEXT NOT NULL DEFAULT '[]',
    conditions TEXT NOT NULL DEFAULT '',
    code TEXT NOT NULL DEFAULT '',
    image_data BLOB,
    image_alt TEXT NOT NULL DEFAULT '',
    active INTEGER NOT NULL DEFAULT 1,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  // Ajustes del panel, por ejemplo los datos para el pago de la seña.
  "CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)",
  // Personas que aceptaron recibir promociones. "pending": se anotó en la web y falta que confirme desde su mail.
  // Al darse de baja, la fila se borra: no se guarda nada de quien ya no quiere recibir avisos.
  `CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    source TEXT NOT NULL CHECK (source IN ('reserva', 'web')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active')),
    token TEXT NOT NULL UNIQUE,
    consent_version TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    confirmed_at TEXT NOT NULL DEFAULT ''
  )`,
  // A quién ya se le avisó cada promoción, para no mandarle el mismo mail dos veces.
  `CREATE TABLE IF NOT EXISTS promotion_notices (
    promotion_id INTEGER NOT NULL,
    subscriber_id INTEGER NOT NULL,
    sent_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (promotion_id, subscriber_id)
  )`,
];

/** Columnas agregadas después de crear cada tabla: se suman solas a las bases existentes. */
const addedReservationColumns = [
  ["has_baby", "INTEGER NOT NULL DEFAULT 0"],
  // Montos en pesos de la tarifa y la seña, y cuándo se le mandó el mensaje de la seña al huésped.
  ["price_total", "INTEGER"],
  ["deposit", "INTEGER"],
  ["deposit_sent_at", "TEXT NOT NULL DEFAULT ''"],
];

const addedPromotionColumns = [
  // Precio total de la promoción en pesos (opcional).
  ["price", "INTEGER"],
];

const addedColumns: [table: string, columns: string[][]][] = [
  ["reservations", addedReservationColumns],
  ["promotions", addedPromotionColumns],
];

type D1Like = {
  prepare(sql: string): { bind(...values: unknown[]): { all(): Promise<{ results: DbRow[]; meta: { changes?: number } }> } };
};

/** D1 no acepta Buffer ni undefined: los BLOB van como ArrayBuffer y lo vacío como null. */
function toD1Value(value: unknown) {
  if (value === undefined) return null;
  if (typeof value === "boolean") return value ? 1 : 0;
  if (value instanceof Uint8Array) return value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength);
  return value;
}

let d1SchemaReady = false;

/**
 * En Workers, una visita no puede esperar algo creado por otra visita: la conexión a D1 se arma en cada visita
 * (es instantánea) y solo se recuerda que las tablas ya existen.
 */
async function connectD1(): Promise<Database> {
  const { getCloudflareContext } = await import("@opennextjs/cloudflare");
  const d1 = (getCloudflareContext().env as unknown as { DB?: D1Like }).DB;
  if (!d1) throw new Error("Falta el binding DB de Cloudflare D1.");
  const database: Database = {
    async execute(query) {
      const { sql, args = [] } = typeof query === "string" ? { sql: query } : query;
      const result = await d1.prepare(sql).bind(...args.map(toD1Value)).all();
      return { rows: result.results ?? [], rowsAffected: result.meta?.changes ?? 0 };
    },
  };
  if (!d1SchemaReady) {
    await prepareSchema(database);
    d1SchemaReady = true;
  }
  return database;
}

/* ---------- Común ---------- */

/** Crea las tablas si no existen y suma las columnas nuevas a las bases que ya existían. */
async function prepareSchema(database: Database) {
  for (const statement of schema) await database.execute(statement);

  for (const [table, columns] of addedColumns) {
    const { rows } = await database.execute(`SELECT name FROM pragma_table_info('${table}')`);
    const existing = new Set(rows.map((row) => String(row.name)));
    for (const [column, definition] of columns) {
      if (existing.has(column)) continue;
      await database.execute(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`).catch((error: unknown) => {
        if (!String(error).includes("duplicate column")) throw error;
      });
    }
  }
}

/** Conexión a la base. Crea las tablas la primera vez. */
export function getDatabase(): Promise<Database> {
  return connectD1();
}
