import Link from "next/link";
import type { Cabin } from "@/content/cabins";
import { DemoImage } from "@/components/demo-image";

export function CabinCard({ cabin, eager = false }: { cabin: Cabin; eager?: boolean }) {
  return (
    <article className="cabin-card">
      <Link aria-label={`Ver detalles de ${cabin.displayName}`} className="cabin-card-link" href={`/cabanas/${cabin.slug}`}>
        <DemoImage
          alt={cabin.images[0].alt}
          eager={eager}
          isDemo={cabin.images[0].isDemo}
          src={cabin.images[0].src}
        />
        <div className="cabin-card-meta">
          <div>
            <h3>{cabin.displayName}</h3>
            <p>{cabin.cardSummary}</p>
          </div>
          <span aria-hidden="true" className="cabin-arrow">
            ↗
          </span>
        </div>
      </Link>
    </article>
  );
}