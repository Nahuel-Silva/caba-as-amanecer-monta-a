import type { Metadata } from "next";
import { LocationSection } from "@/components/location-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { attractionDistances, attractionDistancesSource, nearbyDistances, type Distance } from "@/content/location";
import { pageMetadata } from "@/lib/seo";
import "./location-page.css";

export const metadata: Metadata = pageMetadata({
  title: "Cómo llegar a las cabañas en Malargüe",
  description: "Ubicación de Cabañas Amanecer de Montaña en Malargüe, Mendoza: dirección, mapa y distancias a los atractivos de la zona.",
  path: "/ubicacion",
});

function DistanceList({ items }: { items: Distance[] }) {
  return (
    <ul className="distance-list">
      {items.map((item) => (
        <li key={item.place}>
          <span>{item.place}</span>
          <strong>{item.distance}</strong>
        </li>
      ))}
    </ul>
  );
}

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

          <section aria-labelledby="distances-title" className="distances">
            <p className="eyebrow">Distancias</p>
            <h2 id="distances-title">¿A cuánto queda cada lugar?</h2>

            <div className="distances-group">
              <h3>Desde las cabañas</h3>
              <DistanceList items={nearbyDistances} />
            </div>

            <div className="distances-group">
              <h3>Atractivos, desde la ciudad de Malargüe</h3>
              <p>Como las cabañas están a ~1 km del centro, es casi la misma distancia desde acá.</p>
              <DistanceList items={attractionDistances} />
            </div>

            <p className="distances-source">
              Distancias aproximadas por ruta, según{" "}
              <a href={attractionDistancesSource.url} rel="noopener noreferrer" target="_blank">
                {attractionDistancesSource.label}
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
              . Antes de salir, confirmá el estado de los caminos.
            </p>
          </section>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
