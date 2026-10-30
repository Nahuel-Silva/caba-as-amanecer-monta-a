import type { ReactNode } from "react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type WhatsAppButtonProps = {
  children: ReactNode;
  className?: string;
  /** Nombre de la cabaña, para que el mensaje precargado la mencione. */
  cabinName?: string;
};

export function WhatsAppButton({ children, className, cabinName }: WhatsAppButtonProps) {
  const url = buildWhatsAppUrl({ cabinName });

  if (!url) return null;

  return (
    <a className={className} href={url} rel="noopener noreferrer" target="_blank">
      {children}
      <span className="sr-only"> (se abre WhatsApp en una pestaña nueva)</span>
    </a>
  );
}
