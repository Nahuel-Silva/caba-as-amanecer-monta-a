import type { Metadata } from "next";
import { AttractionCard } from "@/components/attraction-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { climateSource, monthlyClimate } from "@/content/climate";
import { getAttractions, getAttractionsIntro } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { formatDegrees } from "@/lib/weather";
import "./malargue-page.css";

export const metadata: Metadata = pageMetadata({
  title: "Qué hacer en Malargüe, Mendoza",
  description: "Atractivos para conocer en los alrededores de Malargüe, Mendoza, y el clima habitual de cada mes según el Servicio Meteorológico Nacional.",
  path: "/malargue",
});

export default function MalarguePage() {
  const attractions = getAttractions();
  const withPhoto = attractions.filter((attraction) => attraction.image);
  const withoutPhoto = attractions.filter((attraction) => !attraction.image);

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
            {withPhoto.map((attraction, index) => (
              <AttractionCard attraction={attraction} eager={index < 2} key={attraction.name} />
            ))}
          </div>
          {withoutPhoto.length > 0 && (
            <>
              <h2 className="attraction-more-title">Más lugares para conocer</h2>
              <div className="attraction-grid attraction-grid-text">
                {withoutPhoto.map((attraction) => (
                  <AttractionCard attraction={attraction} headingLevel="h3" key={attraction.name} />
                ))}
              </div>
            </>
          )}
          <p className="attraction-credits-note">Fotos de Wikimedia Commons, redimensionadas para la web. Las licencias se indican en cada una.</p>
        </section>

        <section aria-labelledby="climate-title" className="wrap section climate">
          <p className="eyebrow">Clima</p>
          <h2 id="climate-title">¿Qué tiempo hace en Malargüe cada mes?</h2>
          <p className="section-intro">Temperaturas promedio de cada mes, para elegir cuándo venir y qué traer. Llueve poco todo el año y la diferencia de temperatura entre el día y la noche es grande.</p>
          <ul className="climate-grid">
            {monthlyClimate.map((month) => (
              <li key={month.month}>
                <h3>{month.month}</h3>
                <p className="climate-temps">
                  <span><small>Máx.</small> {formatDegrees(month.max)}</span>
                  <span><small>Mín.</small> {formatDegrees(month.min)}</span>
                </p>
                <p className="climate-rain">{Math.round(month.rainDays)} días de lluvia o nieve</p>
              </li>
            ))}
          </ul>
          <p className="climate-source">
            Promedios de 1991 a 2020 de la estación Malargüe Aero, según el{" "}
            <a href={climateSource.url} rel="noopener noreferrer" target="_blank">
              {climateSource.label}
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
            . Al reservar, te mostramos el pronóstico de tus días si ya está disponible.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
