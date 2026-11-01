import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { ContactBand } from "@/components/contact-band";
import { PromotionCard } from "@/components/promotion-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { listActivePromotions } from "@/lib/promotions-db";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Promociones",
  description: "Promociones vigentes de Cabañas Amanecer de Montaña en Malargüe, Mendoza.",
  path: "/promociones",
});

/** Lee las promociones en cada visita, para mostrar enseguida los cambios del panel. */
async function PromotionList() {
  await connection();
  const promotions = await listActivePromotions();

  if (promotions.length === 0) {
    return (
      <div className="promotion-empty">
        <h2>Por ahora no hay promociones activas.</h2>
        <p>Volvé a visitarnos pronto o escribinos para consultar disponibilidad y tarifas.</p>
      </div>
    );
  }

  return (
    <div className="promotion-grid">
      {promotions.map((promotion) => (
        <PromotionCard key={promotion.id} promotion={promotion} />
      ))}
    </div>
  );
}

export default function PromotionsPage() {
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
          <Suspense fallback={<p>Cargando promociones…</p>}>
            <PromotionList />
          </Suspense>
        </section>
        <ContactBand />
      </main>
      <SiteFooter />
    </>
  );
}
