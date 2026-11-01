import Image from "next/image";
import Link from "next/link";
import type { Promotion } from "@/lib/promotion";
import "./promotion-card.css";

export function PromotionCard({ promotion }: { promotion: Promotion }) {
  const { image, discount } = promotion;

  return (
    <article className="promotion-card">
      {image && (
        <div className="promotion-photo">
          <Image
            alt={image.alt}
            fill
            sizes="(max-width: 760px) 100vw, 360px"
            src={image.src}
            unoptimized
          />
          {discount && <span className="promotion-badge">{discount}</span>}
        </div>
      )}
      <div className="promotion-body">
        {!image && discount && <span className="promotion-badge promotion-badge-inline">{discount}</span>}
        {promotion.validity && <p className="promotion-validity">{promotion.validity}</p>}
        <h2>{promotion.title}</h2>
        <p>{promotion.description}</p>
        <Link
          aria-label={`Ver la promoción ${promotion.title}`}
          className="button button-primary"
          href={`/promociones/${promotion.slug}`}
        >
          Ver promoción <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
