import type { Metadata } from "next";
import { AttractionCard } from "@/components/attraction-card";
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
          <div className="attraction-grid">
            {attractions.map((attraction, index) => (
              <AttractionCard attraction={attraction} eager={index < 2} key={attraction.name} />
            ))}
          </div>
          <p className="attraction-credits-note">Fotos de Wikimedia Commons, redimensionadas para la web. Las licencias se indican en cada una.</p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
