import Image from "next/image";
import Link from "next/link";
import { ContactBand } from "@/components/contact-band";
import { CabinCard } from "@/components/cabin-card";
import { PhotoGallery } from "@/components/photo-gallery";
import { ReviewsSection } from "@/components/reviews-section";
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
    src: "/images/alrededor/portada.jpg",
    alt: "Dos cabañas del complejo a los lados de un camino, al pie de una hilera de álamos.",
    isDemo: false,
  };
  const surroundings = [
    {
      src: "/images/alrededor/20.jpg",
      alt: "Parque de césped con las galerías de las cabañas a un lado y árboles al fondo.",
      isDemo: false,
    },
    {
      src: "/images/alrededor/sauce.jpg",
      alt: "Cabaña verde junto a un sauce y un camino de tierra, con álamos al fondo.",
      isDemo: false,
    },
    {
      src: "/images/alrededor/jardin.jpg",
      alt: "Parque de césped con arbustos y árboles, y una cabaña al fondo.",
      isDemo: false,
    },
    {
      src: "/images/alrededor/parque.jpg",
      alt: "Dos cabañas del complejo con sus cocheras techadas, frente al parque y los álamos.",
      isDemo: false,
    },
    {
      src: "/images/alrededor/hojas.jpg",
      alt: "Cabaña con galería vista entre las hojas de un árbol, con el parque delante.",
      isDemo: false,
    },
    {
      src: "/images/alrededor/cabana-alamos.jpg",
      alt: "Cabaña en el parque, al pie de una hilera de álamos y un cielo de tormenta.",
      isDemo: false,
    },
    {
      src: "/images/alrededor/cabana-piedra.jpg",
      alt: "Cabaña con chimenea de piedra y galería, rodeada de plantas y álamos.",
      isDemo: false,
    },
    {
      src: "/images/alrededor/cabana-tormenta.jpg",
      alt: "Cabaña entre plantas, con álamos altos y el cielo cubierto.",
      isDemo: false,
    },
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
              quality={90}
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
        </section>

        <section className="intro-section">
          <div className="wrap intro-grid">
            <div className="intro-photo">
              <Image
                alt="Lateral de una cabaña con el parque de césped y árboles, bajo un cielo con nubes."
                fill
                quality={90}
                sizes="(max-width: 760px) 100vw, 420px"
                src="/images/alrededor/intro.jpg"
              />
            </div>
            <div className="intro-copy">
              <p className="intro-label">El lugar</p>
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
              <h2 className="section-title" id="amenities-title">Lo esencial, resuelto.</h2>
              <p className="section-intro">El complejo está atendido por sus dueños, con atención personalizada.</p>
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
            <p className="eyebrow">El entorno</p>
            <h2 className="section-title section-title-spaced" id="surroundings-title">Espacio verde para estar afuera.</h2>
            <PhotoGallery images={surroundings} panOnHover />
          </div>
        </section>

        <ReviewsSection />

        <ContactBand />
      </main>
      <SiteFooter />
    </>
  );
}
