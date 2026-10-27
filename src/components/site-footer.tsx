import Link from "next/link";
import { site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <div>
          <Link aria-label={`${site.name}, inicio`} className="brand" href="/">
            <span aria-hidden="true" className="brand-symbol">
              A
            </span>
            <span className="brand-copy">
              <span className="brand-name">Amanecer de Montaña</span>
              <span className="brand-location">Malargüe · Mendoza</span>
            </span>
          </Link>
          <p className="footer-pending">Contacto y redes sociales: {site.whatsappNumber}</p>
        </div>
        <nav aria-label="Enlaces del pie de página" className="footer-links">
          <Link href="/cabanas">Cabañas</Link>
          <Link href="/#malargue">Malargüe</Link>
          <Link href="/#ubicacion">Ubicación</Link>
        </nav>
      </div>
    </footer>
  );
}