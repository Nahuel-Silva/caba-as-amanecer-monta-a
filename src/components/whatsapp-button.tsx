import type { ReactNode } from "react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type WhatsAppButtonProps = {
  children: ReactNode;
  className?: string;
  /** Nombre de la cabaña, para que el mensaje precargado la mencione. */
  cabinName?: string;
  /** Mensaje para avisar la hora de llegada, en lugar de una consulta. */
  isArrivalNotice?: boolean;
};

export function WhatsAppButton({ children, className, cabinName, isArrivalNotice }: WhatsAppButtonProps) {
  const url = buildWhatsAppUrl({ cabinName, isArrivalNotice });

  if (!url) return null;

  return (
    <a className={className} href={url} rel="noopener noreferrer" target="_blank">
      {children}
      <span className="sr-only"> (se abre WhatsApp en una pestaña nueva)</span>
    </a>
  );
}
