/** 4 -> "4 personas", 1 -> "1 persona". Si el dato todavía es texto (por ejemplo PENDIENTE), se devuelve tal cual. */
export function formatCount(value: number | string, singular: string, plural: string): string {
  if (typeof value !== "number") return value;
  return `${value} ${value === 1 ? singular : plural}`;
}
