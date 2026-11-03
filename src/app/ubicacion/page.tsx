import type { Metadata } from "next";
import { LocationSection } from "@/components/location-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { arrivalSteps, distances, stayTimes } from "@/content/location";
import { pageMetadata } from "@/lib/seo";
import "./location-page.css";

export const metadata: Metadata = pageMetadata({
  title: "Cómo llegar a las cabañas en Malargüe",
  description: "Ubicación de Cabañas Amanecer de Montaña en Malargüe, Mendoza: dirección, mapa, distancias y cómo llegar.",
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

          <div className="location-info">
            <article className="location-card">
              <h2>Distancias</h2>
              <ul className="location-distances">
                {distances.map((item) => (
                  <li key={item.place}>
                    <span>{item.place}{item.fromCity && <sup aria-hidden="true">*</sup>}</span>
                    <strong>{item.distance}</strong>
                  </li>
                ))}
              </ul>
              <p className="location-note">* Desde la ciudad de Malargüe, según el Gobierno de Mendoza.</p>
            </article>

            <article className="location-card">
              <h2>Cómo llegar</h2>
              <ol className="location-steps">
                {arrivalSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </article>

            <article className="location-card">
              <h2>Llegada y salida</h2>
              <dl className="location-times">
                {stayTimes.map((time) => (
                  <div key={time.label}>
                    <dt>{time.label}</dt>
                    <dd>{time.value}</dd>
                  </div>
                ))}
              </dl>
              <p>Si ya tenés tu reserva, avisanos a qué hora vas a llegar.</p>
              <WhatsAppButton className="button button-primary location-arrival-button" isArrivalNotice>
                Avisar mi hora de llegada
              </WhatsAppButton>
            </article>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
