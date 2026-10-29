import type { Metadata } from "next";
import { CabinCard } from "@/components/cabin-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCabins } from "@/lib/cabins";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Cabañas en Malargüe",
  description: "Conocé las cabañas de Amanecer de Montaña en Malargüe, Mendoza. Consultá disponibilidad y tarifas.",
  path: "/cabanas",
});

export default function CabinsPage() {
  const cabins = getCabins();

  return (
    <>
      <SiteHeader />
      <main>
        <header className="wrap page-heading">
          <p className="eyebrow">Amanecer de Montaña · Malargüe</p>
          <h1>Nuestras cabañas.</h1>
          <p className="section-intro">Dos cabañas para 5 personas cada una, dentro del mismo complejo.</p>
        </header>
        <section aria-label="Cabañas disponibles" className="wrap section" style={{ paddingTop: 0 }}>
          <div className="cabin-grid">
            {cabins.map((cabin, index) => (
              <CabinCard cabin={cabin} eager={index === 0} key={cabin.slug} />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}