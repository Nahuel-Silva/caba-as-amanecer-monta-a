import Link from "next/link";
import { AttractionCard } from "@/components/attraction-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { climateSource, monthlyClimate } from "@/content/climate";
import { localizePath, type Locale } from "@/i18n/config";
import { monthName } from "@/i18n/format";
import { pages } from "@/i18n/pages";
import { ui } from "@/i18n/ui";
import { getAttractions, getAttractionsIntro } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { formatDegrees } from "@/lib/weather";
import "@/views/malargue-page.css";

export function malargueMetadata(locale: Locale) {
  const t = pages[locale].malargue;
  return pageMetadata({ title: t.metaTitle, description: t.metaDescription, path: "/malargue", locale });
}

export function MalargueView({ locale }: { locale: Locale }) {
  const t = pages[locale].malargue;
  const attractions = getAttractions(locale);
  const withPhoto = attractions.filter((attraction) => attraction.image);
  const withoutPhoto = attractions.filter((attraction) => !attraction.image);

  return (
    <>
      <SiteHeader locale={locale} />
      <main>
        <header className="wrap page-heading">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p className="section-intro">{getAttractionsIntro(locale)}</p>
          <p className="section-intro attractions-distances-link">
            {t.distancesBefore}
            <Link href={`${localizePath(locale, "/ubicacion")}#distancias`}>{t.distancesLink}</Link>.
          </p>
        </header>
        <section aria-label={t.listLabel} className="wrap section attractions-section" style={{ paddingTop: 0 }}>
          <div className="attraction-grid">
            {withPhoto.map((attraction, index) => (
              <AttractionCard attraction={attraction} eager={index < 2} key={attraction.name} locale={locale} />
            ))}
          </div>
          {withoutPhoto.length > 0 && (
            <>
              <h2 className="attraction-more-title">{t.more}</h2>
              <div className="attraction-grid attraction-grid-text">
                {withoutPhoto.map((attraction) => (
                  <AttractionCard attraction={attraction} headingLevel="h3" key={attraction.name} locale={locale} />
                ))}
              </div>
            </>
          )}
          <p className="attraction-credits-note">{t.credits}</p>
        </section>

        <section aria-labelledby="climate-title" className="wrap section climate">
          <p className="eyebrow">{t.climateEyebrow}</p>
          <h2 id="climate-title">{t.climateTitle}</h2>
          <p className="section-intro">{t.climateIntro}</p>
          <ul className="climate-grid">
            {monthlyClimate.map((month, index) => (
              <li key={month.month}>
                <h3>{monthName(index, locale)}</h3>
                <p className="climate-temps">
                  <span><small>{t.max}</small> {formatDegrees(month.max)}</span>
                  <span><small>{t.min}</small> {formatDegrees(month.min)}</span>
                </p>
                <p className="climate-rain">{t.rainDays(Math.round(month.rainDays))}</p>
              </li>
            ))}
          </ul>
          <p className="climate-source">
            {t.climateSourceBefore}
            <a href={climateSource.url} rel="noopener noreferrer" target="_blank">
              {climateSource.label}
              <span className="sr-only">{ui[locale].newTab}</span>
            </a>
            {t.climateSourceAfter}
          </p>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
