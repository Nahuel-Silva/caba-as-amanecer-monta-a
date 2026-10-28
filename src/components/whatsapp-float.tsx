import { buildWhatsAppUrl } from "@/lib/whatsapp";

/** Botón fijo para celulares. No se muestra hasta que el número de WhatsApp esté configurado. */
export function WhatsAppFloat() {
  const url = buildWhatsAppUrl();
  if (!url) return null;

  return (
    <a className="wa-float" href={url} rel="noopener noreferrer" target="_blank">
      Consultar por WhatsApp
      <span className="sr-only"> (se abre WhatsApp en una pestaña nueva)</span>
    </a>
  );
}
