import type { Metadata } from "next";
import Image from "next/image";
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
          <figure className="location-entrance">
            <div className="location-entrance-photo">
              <Image
                alt="Portón negro de la entrada al complejo, con el cartel de Amanecer de Montaña."
                fill
                quality={90}
                sizes="(max-width: 1264px) 100vw, 1200px"
                src="/images/alrededor/entrada.jpg"
              />
            </div>
            <figcaption>La entrada al complejo, con nuestro cartel en el portón.</figcaption>
          </figure>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
