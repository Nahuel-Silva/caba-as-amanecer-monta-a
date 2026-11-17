import Image from "next/image";
import { ArrowUpRightIcon } from "@/components/arrow-icon";
import { WhatsAppButton } from "@/components/whatsapp-button";
import type { Locale } from "@/i18n/config";
import { ui } from "@/i18n/ui";
import { getSiteTexts } from "@/lib/content";
import { isWhatsAppConfigured } from "@/lib/whatsapp";
import "./contact-band.css";

/** Bloque de contacto que se repite al final de las páginas principales. */
export function ContactBand({ locale = "es" }: { locale?: Locale }) {
  const t = ui[locale].contactBand;

  return (
    <section className="wrap cta-band contact-panel">
      <div className="contact-panel-photo">
        <Image alt="" fill quality={90} sizes="(max-width: 1264px) 100vw, 1200px" src="/images/alrededor/parque.jpg" />
      </div>
      <div aria-hidden="true" className="contact-panel-shade" />
      <div>
        <p className="eyebrow">{t.eyebrow}</p>
        <h2>{t.title}</h2>
        <p>{isWhatsAppConfigured ? t.text : getSiteTexts(locale).contactNote}</p>
      </div>
      {isWhatsAppConfigured ? (
        <WhatsAppButton className="button button-light" locale={locale}>
          {t.button} <ArrowUpRightIcon />
        </WhatsAppButton>
      ) : (
        <span className="pending-note">{t.pending}</span>
      )}
    </section>
  );
}
