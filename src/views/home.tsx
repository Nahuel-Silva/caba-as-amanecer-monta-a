import Image from "next/image";
import Link from "next/link";
import { BookingBar } from "@/components/booking-bar";
import { CabinCard } from "@/components/cabin-card";
import { ContactBand } from "@/components/contact-band";
import { JsonLd } from "@/components/json-ld";
import { PhotoGallery } from "@/components/photo-gallery";
import { ReviewsSection } from "@/components/reviews-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { localizePath, type Locale } from "@/i18n/config";
import { ui } from "@/i18n/ui";
import { getCabins } from "@/lib/cabins";
import { getAmenities, getSiteTexts } from "@/lib/content";
import { showReservationForm } from "@/lib/reservation-email";
import { buildLodgingJsonLd, defaultDescriptions, pageMetadata } from "@/lib/seo";

const surroundingPhotos = [
  "/images/alrededor/20.jpg",
  "/images/alrededor/sauce.jpg",
  "/images/alrededor/jardin.jpg",
  "/images/alrededor/parque.jpg",
  "/images/alrededor/hojas.jpg",
  "/images/alrededor/cabana-alamos.jpg",
  "/images/alrededor/cabana-piedra.jpg",
  "/images/alrededor/cabana-tormenta.jpg",
];

export function homeMetadata(locale: Locale) {
  return pageMetadata({ title: ui[locale].home.metaTitle, description: defaultDescriptions[locale], path: "/", locale });
}

/** Página de inicio, en el idioma pedido. */
export function HomeView({ locale }: { locale: Locale }) {
  const t = ui[locale].home;
  const cabins = getCabins(locale);
  const amenities = getAmenities(locale);
  const surroundings = surroundingPhotos.map((src, index) => ({ src, alt: t.surroundingsAlts[index], isDemo: false }));
  const [titleStart, titleMiddle, titleEnd] = t.introTitle;

  return (
    <>
      <JsonLd data={buildLodgingJsonLd()} />
      <SiteHeader locale={locale} />
      <main>
        <section aria-labelledby="hero-title" className="hero">
          <div className="hero-image">
            <Image alt={t.heroAlt} fill loading="eager" quality={90} sizes="100vw" src="/images/alrededor/portada.jpg" />
          </div>
          <div aria-hidden="true" className="hero-shade" />
          <div className="hero-content">
            <p className="eyebrow">Malargüe · Mendoza</p>
            <h1 id="hero-title">
              Cabañas
              <span>Amanecer de Montaña</span>
            </h1>
            <p className="hero-copy">{t.heroCopy}</p>
            <div className="hero-actions">
              <Link className="button button-light" href={localizePath(locale, "/cabanas")}>
                {t.heroCta}
              </Link>
            </div>
          </div>
        </section>

        {showReservationForm && (
          <div className="wrap booking-bar-overlap" id="reservar">
            <BookingBar cabins={cabins.map(({ slug, displayName }) => ({ slug, name: displayName }))} />
          </div>
        )}

        <section className="intro-section">
          <div className="wrap intro-grid">
            <div className="intro-photo">
              <Image alt={t.introAlt} fill quality={90} sizes="(max-width: 760px) 100vw, 420px" src="/images/alrededor/intro.jpg" />
            </div>
            <div className="intro-copy">
              <p className="intro-label">{t.introLabel}</p>
              <h2>
                {titleStart}
                <br />
                {titleMiddle}
                <em>{titleEnd}</em>
              </h2>
              <p>{getSiteTexts(locale).intro}</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="cabins-title" className="section section-muted">
          <div className="wrap">
            <div className="section-heading-row">
              <div>
                <p className="eyebrow">{t.cabinsEyebrow}</p>
                <h2 className="section-title" id="cabins-title">{t.cabinsTitle}</h2>
              </div>
            </div>
            <div className="cabin-grid">
              {cabins.map((cabin) => <CabinCard cabin={cabin} key={cabin.slug} locale={locale} />)}
            </div>
          </div>
        </section>

        <section aria-labelledby="amenities-title" className="section">
          <div className="wrap feature-band">
            <div>
              <p className="eyebrow">{t.amenitiesEyebrow}</p>
              <h2 className="section-title" id="amenities-title">{t.amenitiesTitle}</h2>
              <p className="section-intro">{t.amenitiesIntro}</p>
            </div>
            <ul className="feature-list">
              {amenities.map((amenity) => (
                <li key={amenity.name}>
                  <strong>{amenity.name}</strong>
                  <span>{amenity.detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="surroundings-title" className="section section-muted photo-zoom">
          <div className="wrap">
            <p className="eyebrow">{t.surroundingsEyebrow}</p>
            <h2 className="section-title section-title-spaced" id="surroundings-title">{t.surroundingsTitle}</h2>
            <PhotoGallery images={surroundings} panOnHover />
          </div>
        </section>

        <ReviewsSection locale={locale} />

        <ContactBand locale={locale} />
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
