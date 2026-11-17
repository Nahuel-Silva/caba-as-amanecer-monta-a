import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { ContactBand } from "@/components/contact-band";
import { PromoSubscribe } from "@/components/promo-subscribe";
import { PromotionCard } from "@/components/promotion-card";
import { ShareButton } from "@/components/share-button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { localizePath, type Locale } from "@/i18n/config";
import { pages } from "@/i18n/pages";
import { formatPesos } from "@/lib/guest-messages";
import { getActivePromotion, listActivePromotions } from "@/lib/promotions-db";
import { pageMetadata } from "@/lib/seo";
import "@/components/promotion-card.css";

export function promotionsMetadata(locale: Locale) {
  const t = pages[locale].promotions;
  return pageMetadata({ title: t.metaTitle, description: t.metaDescription, path: "/promociones", locale });
}

/** Lee las promociones en cada visita, para mostrar enseguida los cambios del panel. */
async function PromotionList({ locale }: { locale: Locale }) {
  await connection();
  const promotions = await listActivePromotions(locale);
  const t = pages[locale].promotions;

  if (promotions.length === 0) {
    return (
      <div className="promotion-empty">
        <h2>{t.emptyTitle}</h2>
        <p>{t.emptyText}</p>
      </div>
    );
  }

  return (
    <div className="promotion-grid">
      {promotions.map((promotion) => (
        <PromotionCard key={promotion.id} locale={locale} promotion={promotion} />
      ))}
    </div>
  );
}

export function PromotionsView({ locale }: { locale: Locale }) {
  const t = pages[locale].promotions;

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
          <Suspense fallback={<p>{t.loading}</p>}>
            <PromotionList locale={locale} />
          </Suspense>
          <PromoSubscribe />
        </section>
        <ContactBand locale={locale} />
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}

export async function promotionMetadata(slug: string, locale: Locale): Promise<Metadata> {
  await connection();
  const promotion = await getActivePromotion(slug, locale);
  if (!promotion) return { title: pages[locale].promotions.notFound, robots: { index: false, follow: false } };
  return pageMetadata({ title: promotion.title, description: promotion.description, path: `/promociones/${promotion.slug}`, locale });
}

/** Lee la promoción en cada visita, para mostrar enseguida los cambios del panel. */
async function PromotionDetail({ slug, locale }: { slug: string; locale: Locale }) {
  await connection();
  const promotion = await getActivePromotion(slug, locale);
  if (!promotion) notFound();

  const t = pages[locale].promotions;
  const { image, discount, details, conditions, code, validity, price } = promotion;

  return (
    <main className="wrap promotion-detail">
      <article>
        <Link className="back-link" href={localizePath(locale, "/promociones")}>{t.back}</Link>
        {image && (
          <div className="promotion-photo promotion-detail-photo">
            <Image alt={image.alt} fill loading="eager" sizes="(max-width: 960px) 100vw, 720px" src={image.src} unoptimized />
            {discount && <span className="promotion-badge">{discount}</span>}
          </div>
        )}
        {!image && discount && <span className="promotion-badge promotion-badge-inline">{discount}</span>}
        {validity && <p className="promotion-validity">{validity}</p>}
        <h1>{promotion.title}</h1>
        <p className="promotion-lead">{promotion.description}</p>
        {price !== undefined && (
          <p className="promotion-price promotion-price-large">
            <span>{t.price}</span> <strong>{formatPesos(price)}</strong>
          </p>
        )}
        {details.length > 0 && (
          <ul className="promotion-details">
            {details.map((detail) => <li key={detail}>{detail}</li>)}
          </ul>
        )}
        {code && <p className="promotion-code">{t.code} <strong>{code}</strong></p>}
        {conditions && <p className="promotion-conditions">{conditions}</p>}
        <ShareButton title={promotion.title} />
      </article>
    </main>
  );
}

export function PromotionView({ slug, locale }: { slug: string; locale: Locale }) {
  return (
    <>
      <SiteHeader locale={locale} />
      <Suspense fallback={<main className="wrap promotion-detail"><p>{pages[locale].promotions.loadingOne}</p></main>}>
        <PromotionDetail locale={locale} slug={slug} />
      </Suspense>
      <SiteFooter locale={locale} />
    </>
  );
}
