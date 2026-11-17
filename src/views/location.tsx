import { LocationSection } from "@/components/location-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { Locale } from "@/i18n/config";
import { pages } from "@/i18n/pages";
import { getDistances } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import "@/views/location-page.css";

export function locationMetadata(locale: Locale) {
  const t = pages[locale].location;
  return pageMetadata({ title: t.metaTitle, description: t.metaDescription, path: "/ubicacion", locale });
}

export function LocationView({ locale }: { locale: Locale }) {
  const t = pages[locale].location;

  return (
    <>
      <SiteHeader locale={locale} />
      <main>
        <header className="wrap page-heading">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
        </header>
        <section aria-label={t.mapLabel} className="wrap section" style={{ paddingTop: 0 }}>
          <LocationSection locale={locale} />

          <section aria-labelledby="distances-title" className="distances" id="distancias">
            <p className="eyebrow">{t.distancesEyebrow}</p>
            <h2 id="distances-title">{t.distancesTitle}</h2>

            <div className="distances-group">
              <h3>{t.distancesSubtitle}</h3>
              <ul className="distance-list">
                {getDistances(locale).map((item) => (
                  <li key={item.place}>
                    <span>{item.place}</span>
                    <strong>{item.distance}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
