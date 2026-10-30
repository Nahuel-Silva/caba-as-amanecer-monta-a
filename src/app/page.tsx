import Image from "next/image";
import Link from "next/link";
import { ContactBand } from "@/components/contact-band";
import { CabinCard } from "@/components/cabin-card";
import { SiteFooter } from "@/components/site-footer";
import { JsonLd } from "@/components/json-ld";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/content/site";
import { getCabins } from "@/lib/cabins";
import { getAmenities } from "@/lib/content";
import { buildLodgingJsonLd, defaultDescription, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Cabañas en Malargüe, Mendoza",
  description: defaultDescription,
  path: "/",
});

export default function Home() {
  const cabins = getCabins();
  const amenities = getAmenities();
  const heroImage = {
    src: "/images/demo-landscape-03.jpg",
    alt: "Paisaje de montaña y lago de demostración; no es una fotografía del complejo.",
    isDemo: true,
  };

  return (
    <>
      <JsonLd data={buildLodgingJsonLd()} />
      <SiteHeader />
      <main>
        <section aria-labelledby="hero-title" className="hero">
          <div className="hero-image">
            <Image
              alt={heroImage.alt}
              fill
              loading="eager"
              sizes="100vw"
              src={heroImage.src}
            />
            {heroImage.isDemo && <span className="hero-demo-label">Foto de demostración</span>}
          </div>
          <div aria-hidden="true" className="hero-shade" />
          <div className="hero-content">
            <p className="eyebrow">Malargüe · Mendoza</p>
            <h1 id="hero-title">
              Cabañas
              <span>Amanecer de Montaña</span>
            </h1>
            <p className="hero-copy">Un descanso entre paisajes abiertos, aire de montaña y la calma del sur mendocino.</p>
            <div className="hero-actions">
              <Link className="button button-light" href="/cabanas">
                Conocer las cabañas
              </Link>
            </div>
          </div>
          <span className="hero-stamp">Una pausa en el sur mendocino</span>
        </section>

        <section className="intro-section">
          <div className="wrap intro-grid">
            <div className="intro-label">El lugar · 01</div>
            <div className="intro-copy">
              <h2>
                Despertar con tiempo,
                <br />
                cerca de <em>la montaña.</em>
              </h2>
              <p>{site.intro}</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="cabins-title" className="section section-muted">
          <div className="wrap">
            <div className="section-heading-row">
              <div>
                <p className="eyebrow">Alojamiento</p>
                <h2 className="section-title" id="cabins-title">Un lugar para cada viaje.</h2>
              </div>
            </div>
            <div className="cabin-grid">
              {cabins.map((cabin) => <CabinCard cabin={cabin} key={cabin.slug} />)}
            </div>
          </div>
        </section>

        <section aria-labelledby="amenities-title" className="section">
          <div className="wrap feature-band">
            <div>
              <p className="eyebrow">Una estadía a tu ritmo</p>
              <h2 className="section-title" id="amenities-title">Lo esencial, en preparación.</h2>
              <p className="section-intro">Estamos reuniendo la información confirmada de cada servicio para compartirla pronto.</p>
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

        <ContactBand />
      </main>
      <SiteFooter />
    </>
  );
}
