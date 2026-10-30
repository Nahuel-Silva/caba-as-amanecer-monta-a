import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <Link aria-label={`${site.name}, inicio`} className="brand" href="/">
          <BrandLogo tone="light" />
        </Link>
        <nav aria-label="Enlaces del pie de página" className="footer-links">
          <Link href="/cabanas">Cabañas</Link>
          <Link href="/promociones">Promociones</Link>
          <Link href="/malargue">Malargüe</Link>
          <Link href="/ubicacion">Ubicación</Link>
          <Link href="/preguntas">Preguntas</Link>
        </nav>
      </div>
    </footer>
  );
}