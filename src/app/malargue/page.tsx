import type { Metadata } from "next";
import { ContactBand } from "@/components/contact-band";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getAttractions, getAttractionsIntro } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Qué hacer en Malargüe, Mendoza",
  description: "Atractivos para conocer en los alrededores de Malargüe, Mendoza, según fuentes del Gobierno de Mendoza.",
  path: "/malargue",
});

export default function MalarguePage() {
  const attractions = getAttractions();

  return (
    <>
      <SiteHeader />
      <main>
        <header className="wrap page-heading">
          <p className="eyebrow">Alrededores</p>
          <h1>Malargüe, por descubrir.</h1>
          <p className="section-intro">{getAttractionsIntro()}</p>
        </header>
        <section aria-label="Atractivos de Malargüe" className="wrap section" style={{ paddingTop: 0 }}>
          <div className="destination-list" style={{ marginTop: 0 }}>
            {attractions.map((attraction) => (
              <article key={attraction.name}>
                <h3>{attraction.name}</h3>
                <p>{attraction.detail}</p>
                {attraction.sourceUrl && (
                  <a className="text-link" href={attraction.sourceUrl} rel="noopener noreferrer" target="_blank">
                    {attraction.sourceLabel ?? "Fuente oficial"}{" "}
                    <span className="sr-only">(se abre en una pestaña nueva)</span>
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>
        <ContactBand />
      </main>
      <SiteFooter />
    </>
  );
}
