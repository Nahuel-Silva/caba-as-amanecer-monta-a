import type { Metadata } from "next";
import { CabinCard } from "@/components/cabin-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCabins } from "@/lib/cabins";

export const metadata: Metadata = {
  title: "Cabañas | Amanecer de Montaña",
  description: "Conocé las cabañas de Amanecer de Montaña en Malargüe. Características e información en preparación.",
};

export default function CabinsPage() {
  const cabins = getCabins();

  return (
    <>
      <SiteHeader />
      <main>
        <header className="wrap page-heading">
          <p className="eyebrow">Amanecer de Montaña · Malargüe</p>
          <h1>Nuestras cabañas.</h1>
          <p className="section-intro">La información de cada alojamiento se completará cuando estén confirmados sus nombres y características.</p>
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