"use client";

import { useLocale } from "@/i18n/locale-context";
import { pages } from "@/i18n/pages";

/** Abre WhatsApp para compartir la página actual con otra persona. */
export function ShareButton({ title }: { title: string }) {
  const locale = useLocale();

  function share() {
    const text = `${title}: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <button className="promotion-share" onClick={share} type="button">
      {pages[locale].promotions.share}
    </button>
  );
}
