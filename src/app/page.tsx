import Image from "next/image";
import Link from "next/link";
import { ContactBand } from "@/components/contact-band";
import { CabinCard } from "@/components/cabin-card";
import { PhotoGallery } from "@/components/photo-gallery";
import { SiteFooter } from "@/components/site-footer";
import { JsonLd } from "@/components/json-ld";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppButton } from "@/components/whatsapp-button";
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
  const gallery = [
    heroImage,
    ...(cabins[0]?.images ?? []).filter((image) => image.src !== heroImage.src),
  ];

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
              <WhatsAppButton className="button button-light" fallbackHref="#contacto">
                Consultar disponibilidad <span aria-hidden="true">↗</span>
              </WhatsAppButton>
              <Link className="button button-outline" href="/cabanas">
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
              <Link className="text-link" href="/cabanas">
                Explorar las cabañas <span aria-hidden="true">→</span>
              </Link>
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
              <Link className="text-link" href="/cabanas">
                Ver todas las cabañas <span aria-hidden="true">→</span>
              </Link>
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

        <section aria-labelledby="gallery-title" className="section section-muted">
          <div className="wrap">
            <div className="section-heading-row">
              <div>
                <p className="eyebrow">Paisajes de muestra</p>
                <h2 className="section-title" id="gallery-title">Una idea de lo que inspira el viaje.</h2>
                <p className="section-intro">Estas imágenes son ilustrativas y no corresponden a las cabañas.</p>
              </div>
            </div>
            <PhotoGallery images={gallery} />
          </div>
        </section>




        <ContactBand />
      </main>
      <SiteFooter />
    </>
  );
}
