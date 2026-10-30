import type { Metadata } from "next";
import { ContactBand } from "@/components/contact-band";
import { PromotionCard } from "@/components/promotion-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPromotions } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Promociones",
  description: "Promociones vigentes de Cabañas Amanecer de Montaña en Malargüe, Mendoza.",
  path: "/promociones",
});

export default function PromotionsPage() {
  const promotions = getPromotions();

  return (
    <>
      <SiteHeader />
      <main>
        <header className="wrap page-heading">
          <p className="eyebrow">Ofertas de temporada</p>
          <h1>Promociones.</h1>
          <p className="section-intro">Las promociones vigentes para tu próxima estadía en Malargüe.</p>
        </header>
        <section aria-label="Promociones vigentes" className="wrap section" style={{ paddingTop: 0 }}>
          {promotions.length > 0 ? (
            <div className="promotion-grid">
              {promotions.map((promotion) => (
                <PromotionCard key={promotion.slug} promotion={promotion} />
              ))}
            </div>
          ) : (
            <div className="promotion-empty">
              <h2>Por ahora no hay promociones activas.</h2>
              <p>Volvé a visitarnos pronto o escribinos para consultar disponibilidad y tarifas.</p>
            </div>
          )}
        </section>
        <ContactBand />
      </main>
      <SiteFooter />
    </>
  );
}
