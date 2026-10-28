import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PhotoGallery } from "@/components/photo-gallery";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { site } from "@/content/site";
import { getCabinBySlug, getCabins } from "@/lib/cabins";
import { pageMetadata } from "@/lib/seo";

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

  const details = [
    ["Capacidad", cabin.capacity],
    ["Dormitorios", cabin.bedrooms],
    ["Camas", cabin.beds],
    ["Baños", cabin.bathrooms],
    ["Cocina y equipamiento", cabin.kitchen],
    ["Servicios incluidos", cabin.services],
    ["Acceso", cabin.access],
    ["Reglas", cabin.rules],
  ];

  return (
    <>
      <SiteHeader />
      <main>
        <div className="wrap cabin-detail-heading">
          <header className="page-heading">
            <p className="eyebrow">Alojamiento · Información pendiente</p>
            <h1>{cabin.displayName}</h1>
            <p className="section-intro">Nombre real, descripción y datos del alojamiento: {cabin.nameStatus}.</p>
          </header>
          <Link className="button button-primary" href="/cabanas">Todas las cabañas</Link>
        </div>
        <section aria-label={`Galería de ${cabin.displayName}`} className="wrap detail-gallery">
          <PhotoGallery images={cabin.images} />
        </section>
        <section className="wrap detail-content">
          <div>
            <p className="eyebrow">Sobre esta cabaña</p>
            <h2>Un espacio para tu estadía.</h2>
            <p>{cabin.description}</p>
            <div className="detail-cta">
              <WhatsAppButton cabinName={cabin.displayName} className="button button-primary">
                Consultar por esta cabaña <span aria-hidden="true">↗</span>
              </WhatsAppButton>
            </div>
            <Link className="back-link" href="/cabanas">← Volver a las cabañas</Link>
          </div>
          <div>
            <p className="eyebrow">Características</p>
            <ul className="detail-list">
              {details.map(([label, value]) => (
                <li key={label}>
                  <strong>{label}</strong>
                  <span>{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}