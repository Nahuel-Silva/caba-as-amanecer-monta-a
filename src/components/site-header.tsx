import Link from "next/link";
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
        <nav aria-label="Navegación principal" className="main-nav">
          <Link href="/">Inicio</Link>
          <Link href="/cabanas">Cabañas</Link>
          <Link href="/#malargue">Malargüe</Link>
        </nav>
        <Link className="button button-primary header-cta" href="/#contacto">
          Consultar <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </header>
  );
}