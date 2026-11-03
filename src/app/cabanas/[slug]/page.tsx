import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PhotoGallery } from "@/components/photo-gallery";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { site } from "@/content/site";
import { getCabinBySlug, getCabins } from "@/lib/cabins";
import { showReservationForm } from "@/lib/reservation-email";
import { pageMetadata } from "@/lib/seo";
import "./cabin-page.css";

type CabinPageProps = { params: Promise<{ slug: string }> };

export const instant = false;

export function generateStaticParams() {
  return getCabins().map((cabin) => ({ slug: cabin.slug }));
}

export async function generateMetadata({ params }: CabinPageProps): Promise<Metadata> {
  const { slug } = await params;
  const cabin = getCabinBySlug(slug);

  if (!cabin) return { title: "Cabaña no encontrada", robots: { index: false, follow: false } };

  return pageMetadata({
    title: cabin.displayName,
    description: `${cabin.displayName} en ${site.name}, Malargüe, Mendoza. Consultá disponibilidad y tarifas.`,
    path: `/cabanas/${cabin.slug}`,
  });
}

export default async function CabinPage({ params }: CabinPageProps) {
  const { slug } = await params;
  const cabin = getCabinBySlug(slug);

  if (!cabin) notFound();

  return (
    <>
      <SiteHeader />
      <main>
        <div className="wrap cabin-detail-heading">
          <header className="page-heading">
            <p className="eyebrow">Alojamiento · Malargüe</p>
            <h1>{cabin.displayName}</h1>
            <p className="section-intro">{cabin.cardSummary}</p>
          </header>
        </div>
        <section aria-label={`Galería de ${cabin.displayName}`} className="wrap detail-gallery">
          <PhotoGallery images={cabin.images} />
        </section>

        <section className="wrap cabin-overview">
          <div>
            <p className="eyebrow">Sobre esta cabaña</p>
            <h2>Un espacio para tu estadía.</h2>
            <p>{cabin.description}</p>
            <div className="cabin-actions">
              <WhatsAppButton cabinName={cabin.displayName} className="button button-primary">
                Consultar por esta cabaña <span aria-hidden="true">↗</span>
              </WhatsAppButton>
              {showReservationForm && (
                <Link className="text-link" href="/#reservar">
                  Solicitar reserva <span aria-hidden="true">→</span>
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
          <p className="eyebrow">Características</p>
          <h2 id="cabin-features-title">Qué vas a encontrar.</h2>
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
          <Link className="back-link" href="/cabanas">← Volver a las cabañas</Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
