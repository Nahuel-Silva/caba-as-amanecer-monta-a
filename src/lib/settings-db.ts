import { getDatabase } from "@/lib/db";

/** Ajustes del panel guardados en la base de datos. */
export type AdminSettings = {
  /** Alias, CBU u otros datos para pagar la seña. Se reutiliza en todos los mensajes. */
  paymentDetails: string;
};

const keys: Record<keyof AdminSettings, string> = { paymentDetails: "payment_details" };

export async function getSettings(): Promise<AdminSettings> {
  const database = await getDatabase();
  const { rows } = await database.execute("SELECT key, value FROM settings");
  const values = new Map(rows.map((row) => [String(row.key), String(row.value)]));
  return { paymentDetails: values.get(keys.paymentDetails) ?? "" };
}

export async function saveSetting(name: keyof AdminSettings, value: string) {
  const database = await getDatabase();
  await database.execute({
    sql: "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    args: [keys[name], value],
  });
}
