import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import { ui } from "@/i18n/ui";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type WhatsAppButtonProps = {
  children: ReactNode;
  className?: string;
  /** Nombre de la cabaña, para que el mensaje precargado la mencione. */
  cabinName?: string;
  locale?: Locale;
};

export function WhatsAppButton({ children, className, cabinName, locale = "es" }: WhatsAppButtonProps) {
  const url = buildWhatsAppUrl({ cabinName }, locale);

  if (!url) return null;

  return (
    <a className={className} href={url} rel="noopener noreferrer" target="_blank">
      {children}
      <span className="sr-only">{ui[locale].contact.whatsappButtonNewTab}</span>
    </a>
  );
}
