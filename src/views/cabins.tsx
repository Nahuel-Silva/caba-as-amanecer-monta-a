import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRightIcon } from "@/components/arrow-icon";
import { CabinCard } from "@/components/cabin-card";
import { PhotoGallery } from "@/components/photo-gallery";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { site } from "@/content/site";
import { localizePath, type Locale } from "@/i18n/config";
import { pages } from "@/i18n/pages";
import { getCabinBySlug, getCabins } from "@/lib/cabins";
import { showReservationForm } from "@/lib/reservation-email";
import { pageMetadata } from "@/lib/seo";
import "@/views/cabin-page.css";

export function cabinsMetadata(locale: Locale) {
  const t = pages[locale].cabins;
  return pageMetadata({ title: t.metaTitle, description: t.metaDescription, path: "/cabanas", locale });
}

/** Listado de cabañas. */
export function CabinsView({ locale }: { locale: Locale }) {
  const t = pages[locale].cabins;
  const cabins = getCabins(locale);

  return (
    <>
      <SiteHeader locale={locale} />
      <main>
        <header className="wrap page-heading">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p className="section-intro">{t.intro}</p>
        </header>
        <section aria-label={t.listLabel} className="wrap section" style={{ paddingTop: 0 }}>
          <div className="cabin-grid">
            {cabins.map((cabin, index) => (
              <CabinCard cabin={cabin} eager={index === 0} key={cabin.slug} locale={locale} />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}

export function cabinMetadata(slug: string, locale: Locale) {
  const cabin = getCabinBySlug(slug, locale);
  const t = pages[locale].cabin;
  if (!cabin) return { title: t.notFound, robots: { index: false, follow: false } };
  return pageMetadata({ title: cabin.displayName, description: t.metaDescription(cabin.displayName, site.name), path: `/cabanas/${cabin.slug}`, locale });
}

/** Página de cada cabaña. */
export function CabinView({ slug, locale }: { slug: string; locale: Locale }) {
  const cabin = getCabinBySlug(slug, locale);
  if (!cabin) notFound();
  const t = pages[locale].cabin;

  return (
    <>
      <SiteHeader locale={locale} />
      <main>
        <div className="wrap cabin-detail-heading">
          <header className="page-heading">
            <p className="eyebrow">{t.eyebrow}</p>
            <h1>{cabin.displayName}</h1>
            <p className="section-intro">{cabin.cardSummary}</p>
          </header>
        </div>
        <section aria-label={t.gallery(cabin.displayName)} className="wrap detail-gallery">
          <PhotoGallery images={cabin.images} />
        </section>

        <section className="wrap cabin-overview">
          <div>
            <p className="eyebrow">{t.aboutEyebrow}</p>
            <h2>{t.aboutTitle}</h2>
            <p>{cabin.description}</p>
            <div className="cabin-actions">
              <WhatsAppButton cabinName={cabin.displayName} className="button button-primary" locale={locale}>
                {t.ask} <ArrowUpRightIcon />
              </WhatsAppButton>
              {showReservationForm && (
                <Link className="text-link" href={`${localizePath(locale, "/")}#reservar`}>
                  {t.book} <span aria-hidden="true">→</span>
                </Link>
              )}
            </div>
          </div>
          <dl className="cabin-facts">
            {cabin.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="cabin-features-title" className="wrap cabin-features">
          <p className="eyebrow">{t.featuresEyebrow}</p>
          <h2 id="cabin-features-title">{t.featuresTitle}</h2>
          <div className="cabin-feature-grid">
            {cabin.featureGroups.map((group) => (
              <article className="cabin-feature-card" key={group.title}>
                <h3>{group.title}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <Link className="back-link" href={localizePath(locale, "/cabanas")}>{t.back}</Link>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
