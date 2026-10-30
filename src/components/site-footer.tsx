import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { PENDING, site } from "@/content/site";
import { isWhatsAppConfigured } from "@/lib/whatsapp";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <div>
          <Link aria-label={`${site.name}, inicio`} className="brand" href="/">
            <BrandLogo tone="light" />
          </Link>
          {isWhatsAppConfigured ? (
            <WhatsAppButton className="footer-wa">Consultar por WhatsApp</WhatsAppButton>
          ) : (
            <p className="footer-pending">Contacto y redes sociales: {PENDING}</p>
          )}
        </div>
        <nav aria-label="Enlaces del pie de página" className="footer-links">
          <Link href="/cabanas">Cabañas</Link>
          <Link href="/malargue">Malargüe</Link>
          <Link href="/ubicacion">Ubicación</Link>
          <Link href="/preguntas">Preguntas</Link>
        </nav>
      </div>
    </footer>
  );
}