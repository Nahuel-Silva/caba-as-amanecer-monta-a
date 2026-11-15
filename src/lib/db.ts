import { createClient, type Client } from "@libsql/client";

/**
 * Base de datos Turso. Sin TURSO_DATABASE_URL, en desarrollo se usa el archivo local.db
 * (ignorado por git) y en producción las funciones que la necesitan quedan desactivadas.
 */
const isDevelopment = process.env.NODE_ENV === "development";
const databaseUrl = process.env.TURSO_DATABASE_URL || (isDevelopment ? "file:local.db" : "");

export const isDatabaseConfigured = databaseUrl !== "";

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
];

/** Columnas agregadas después de crear la tabla de reservas: se suman solas a las bases existentes. */
const addedReservationColumns = [
  ["has_baby", "INTEGER NOT NULL DEFAULT 0"],
  // Montos en pesos de la tarifa y la seña, y cuándo se le mandó el mensaje de la seña al huésped.
  ["price_total", "INTEGER"],
  ["deposit", "INTEGER"],
  ["deposit_sent_at", "TEXT NOT NULL DEFAULT ''"],
];

let database: Promise<Client> | null = null;

async function connect() {
  const client = createClient({ url: databaseUrl, authToken: process.env.TURSO_AUTH_TOKEN });
  await client.batch(schema, "write");

  const { rows } = await client.execute("SELECT name FROM pragma_table_info('reservations')");
  const existing = new Set(rows.map((row) => String(row.name)));
  for (const [column, definition] of addedReservationColumns) {
    if (existing.has(column)) continue;
    await client.execute(`ALTER TABLE reservations ADD COLUMN ${column} ${definition}`).catch((error: unknown) => {
      if (!String(error).includes("duplicate column")) throw error;
    });
  }
  return client;
}

/** Conexión compartida. Crea las tablas la primera vez y reintenta si falló la conexión anterior. */
export function getDatabase() {
  if (!isDatabaseConfigured) throw new Error("La base de datos no está configurada.");
  database ??= connect().catch((error) => {
    database = null;
    throw error;
  });
  return database;
}
