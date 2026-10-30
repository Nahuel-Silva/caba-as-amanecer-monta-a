import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { site } from "@/content/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link aria-label={`${site.name}, inicio`} className="brand" href="/">
          <span aria-hidden="true" className="brand-symbol">
            A
          </span>
          <span className="brand-copy">
            <span className="brand-name">Amanecer de Montaña</span>
            <span className="brand-location">Malargüe · Mendoza</span>
          </span>
        </Link>
        <SiteNav />
        <WhatsAppButton className="button button-primary header-cta" fallbackHref="/#contacto">
          Consultar <span aria-hidden="true">↗</span>
        </WhatsAppButton>
      </div>
    </header>
  );
}