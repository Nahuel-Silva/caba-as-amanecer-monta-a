import Image from "next/image";
import Link from "next/link";
import { CabinCard } from "@/components/cabin-card";
import { PhotoGallery } from "@/components/photo-gallery";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { attractions, amenities, faqs, site } from "@/content/site";
import { getCabins } from "@/lib/cabins";

export default function Home() {
  const cabins = getCabins();
  const heroImage = {
    src: "/images/demo-landscape-03.jpg",
    alt: "Paisaje de montaña y lago de demostración; no es una fotografía del complejo.",
    isDemo: true,
  };
  const gallery = [
    heroImage,
    ...cabins[0].images.filter((image) => image.src !== heroImage.src),
  ];

  return (
    <>
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
              <a className="button button-light" href="#contacto">
                Consultar disponibilidad <span aria-hidden="true">↗</span>
              </a>
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

        <section aria-labelledby="malargue-title" className="section" id="malargue">
          <div className="wrap">
            <p className="eyebrow">Alrededores</p>
            <h2 className="section-title" id="malargue-title">Malargüe, por descubrir.</h2>
            <p className="section-intro">Una selección de lugares mencionados entre los atractivos de la zona. La información práctica está pendiente de verificación.</p>
            <div className="destination-list">
              {attractions.map((attraction) => (
                <article key={attraction.name}>
                  <h3>{attraction.name}</h3>
                  <p>{attraction.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="location-title" className="section section-muted" id="ubicacion">
          <div className="wrap">
            <p className="eyebrow">Cómo llegar</p>
            <h2 className="section-title" id="location-title">En Malargüe, Mendoza.</h2>
            <div className="location-grid">
              <div className="location-copy">
                <div>
                  <span className="pending-note">Dirección: {site.address}</span>
                  <p>La ubicación exacta y las indicaciones se agregarán cuando estén confirmadas.</p>
                </div>
                <p>{site.location}</p>
              </div>
              <div aria-label="Mapa pendiente de ubicación confirmada" className="map-placeholder" role="img">
                <div className="map-placeholder-inner">
                  <span className="pending-note">Mapa: {site.address}</span>
                  <p>Se mostrará aquí la ubicación del alojamiento.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="faq-title" className="section">
          <div className="wrap">
            <p className="eyebrow">Información útil</p>
            <h2 className="section-title" id="faq-title">Preguntas frecuentes.</h2>
            <div className="faq-list">
              {faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <div className="faq-answer">{faq.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="wrap cta-band" id="contacto">
          <div>
            <p className="eyebrow">Contacto</p>
            <h2>¿Planeando una visita a Malargüe?</h2>
            <p>{site.contactNote}</p>
          </div>
          <span className="pending-note">WhatsApp: {site.whatsappNumber}</span>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
