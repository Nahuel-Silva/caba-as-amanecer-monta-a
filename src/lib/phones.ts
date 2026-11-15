/**
 * Teléfonos para reservar por llamada. Única fuente: la variable de entorno NEXT_PUBLIC_PHONE_NUMBERS
 * (ver .env.example y README.md). Mientras no esté cargada, el botón de llamada no se muestra
 * y nunca se publica un número inventado.
 *
 * Formato: entradas separadas por ";", cada una "Nombre | número". El nombre es opcional.
 * Ejemplo (NO son números reales): "Nahuel | +54 9 260 400-0000; María | +54 9 260 400-0001"
 */

export type PhoneContact = {
  /** Nombre que se muestra arriba del número (puede estar vacío). */
  name: string;
  /** Número tal como se muestra, por ejemplo "+54 9 260 400-0000". */
  display: string;
  /** Enlace para llamar, por ejemplo "tel:+5492604000000". */
  href: string;
};

export function parsePhoneNumbers(value: string | undefined): PhoneContact[] {
  return (value ?? "")
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [first, second] = entry.split("|").map((part) => part.trim());
      const [name, display] = second === undefined ? ["", first] : [first, second];
      const digits = display.replace(/\D/g, "");
      const href = `tel:${display.trim().startsWith("+") ? "+" : ""}${digits}`;
      return { name, display, href, digits };
    })
    .filter((phone) => phone.digits.length >= 8 && phone.digits.length <= 15)
    .map(({ name, display, href }) => ({ name, display, href }));
}

export const phoneContacts = parsePhoneNumbers(process.env.NEXT_PUBLIC_PHONE_NUMBERS);
