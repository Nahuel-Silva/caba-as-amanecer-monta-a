import Link from "next/link";
import type { ReactNode } from "react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type WhatsAppButtonProps = {
  children: ReactNode;
  className?: string;
  /** Nombre de la cabaña, para que el mensaje precargado la mencione. */
  cabinName?: string;
  /**
   * Destino alternativo mientras el número de WhatsApp no esté configurado
   * (por ejemplo "#contacto"). Si no se indica, el botón no se muestra.
   */
  fallbackHref?: string;
};

export function WhatsAppButton({ children, className, cabinName, fallbackHref }: WhatsAppButtonProps) {
  const url = buildWhatsAppUrl({ cabinName });

  if (url) {
    return (
      <a className={className} href={url} rel="noopener noreferrer" target="_blank">
        {children}
        <span className="sr-only"> (se abre WhatsApp en una pestaña nueva)</span>
      </a>
    );
  }

  if (fallbackHref) {
    return (
      <Link className={className} href={fallbackHref}>
        {children}
      </Link>
    );
  }

  return null;
}
