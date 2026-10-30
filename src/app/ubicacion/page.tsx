import type { Metadata } from "next";
import { LocationSection } from "@/components/location-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Cómo llegar a las cabañas en Malargüe",
  description: "Ubicación de Cabañas Amanecer de Montaña en Malargüe, Mendoza: dirección, mapa y cómo llegar.",
  path: "/ubicacion",
});

export default function LocationPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <header className="wrap page-heading">
          <p className="eyebrow">Cómo llegar</p>
          <h1>En Malargüe, Mendoza.</h1>
        </header>
        <section aria-label="Mapa y dirección" className="wrap section" style={{ paddingTop: 0 }}>
          <LocationSection />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
