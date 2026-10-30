import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PromotionInquiry } from "@/components/promotion-inquiry";
import { ShareButton } from "@/components/share-button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPromotionBySlug, getPromotions } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import "@/components/promotion-card.css";

type PromotionPageProps = { params: Promise<{ slug: string }> };

export const instant = false;

export function generateStaticParams() {
  const slugs = getPromotions().map((promotion) => ({ slug: promotion.slug }));
  // Cache Components exige al menos un parámetro: sin promociones se usa uno que da "no encontrada".
  return slugs.length > 0 ? slugs : [{ slug: "sin-promociones" }];
}

export async function generateMetadata({ params }: PromotionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const promotion = getPromotionBySlug(slug);

  if (!promotion) return { title: "Promoción no encontrada", robots: { index: false, follow: false } };

  return pageMetadata({
    title: promotion.title,
    description: promotion.description,
    path: `/promociones/${promotion.slug}`,
  });
}

export default async function PromotionPage({ params }: PromotionPageProps) {
  const { slug } = await params;
  const promotion = getPromotionBySlug(slug);

  if (!promotion) notFound();

  const { image, discount, details, conditions, code, validity } = promotion;

  return (
    <>
      <SiteHeader />
      <main className="wrap promotion-detail">
        <article>
          <Link className="back-link" href="/promociones">← Volver a promociones</Link>
          {image && (
            <div className="promotion-photo promotion-detail-photo">
              <Image
                alt={image.alt}
                fill
                loading="eager"
                quality={90}
                sizes="(max-width: 960px) 100vw, 720px"
                src={image.src}
              />
              {discount && <span className="promotion-badge">{discount}</span>}
            </div>
          )}
          {!image && discount && <span className="promotion-badge promotion-badge-inline">{discount}</span>}
          {validity && <p className="promotion-validity">{validity}</p>}
          <h1>{promotion.title}</h1>
          <p className="promotion-lead">{promotion.description}</p>
          {details && details.length > 0 && (
            <ul className="promotion-details">
              {details.map((detail) => <li key={detail}>{detail}</li>)}
            </ul>
          )}
          {code && <p className="promotion-code">Código: <strong>{code}</strong></p>}
          {conditions && <p className="promotion-conditions">{conditions}</p>}
          <ShareButton title={promotion.title} />
        </article>
        <aside>
          <PromotionInquiry code={code} title={promotion.title} />
        </aside>
      </main>
      <SiteFooter />
    </>
  );
}
