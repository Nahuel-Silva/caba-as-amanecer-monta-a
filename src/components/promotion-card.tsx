import Image from "next/image";
import Link from "next/link";
import { localizePath, type Locale } from "@/i18n/config";
import { pages } from "@/i18n/pages";
import { formatPesos } from "@/lib/guest-messages";
import type { Promotion } from "@/lib/promotion";
import "./promotion-card.css";

export function PromotionCard({ promotion, locale = "es" }: { promotion: Promotion; locale?: Locale }) {
  const { image, discount } = promotion;
  const t = pages[locale].promotions;

  return (
    <article className="promotion-card">
      {image && (
        <div className="promotion-photo">
          <Image alt={image.alt} fill sizes="(max-width: 760px) 100vw, 360px" src={image.src} unoptimized />
          {discount && <span className="promotion-badge">{discount}</span>}
        </div>
      )}
      <div className="promotion-body">
        {!image && discount && <span className="promotion-badge promotion-badge-inline">{discount}</span>}
        {promotion.validity && <p className="promotion-validity">{promotion.validity}</p>}
        <h2>{promotion.title}</h2>
        <p>{promotion.description}</p>
        {promotion.price !== undefined && (
          <p className="promotion-price">
            <span>{t.price}</span> <strong>{formatPesos(promotion.price)}</strong>
          </p>
        )}
        <Link aria-label={t.viewLabel(promotion.title)} className="button button-primary" href={localizePath(locale, `/promociones/${promotion.slug}`)}>
          {t.view} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
