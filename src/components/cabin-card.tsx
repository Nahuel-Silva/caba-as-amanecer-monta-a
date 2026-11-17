import Link from "next/link";
import type { Cabin } from "@/content/cabins";
import { ArrowUpRightIcon } from "@/components/arrow-icon";
import { DemoImage } from "@/components/demo-image";
import { localizePath, type Locale } from "@/i18n/config";
import { ui } from "@/i18n/ui";

export function CabinCard({ cabin, eager = false, locale = "es" }: { cabin: Cabin; eager?: boolean; locale?: Locale }) {
  return (
    <article className="cabin-card">
      <Link aria-label={ui[locale].cabinCard.view(cabin.displayName)} className="cabin-card-link" href={localizePath(locale, `/cabanas/${cabin.slug}`)}>
        <DemoImage
          alt={cabin.images[0].alt}
          eager={eager}
          isDemo={cabin.images[0].isDemo}
          locale={locale}
          src={cabin.images[0].src}
        />
        <div className="cabin-card-meta">
          <div>
            <h3>{cabin.displayName}</h3>
            <p>{cabin.cardSummary}</p>
          </div>
          <span aria-hidden="true" className="cabin-arrow">
            <ArrowUpRightIcon />
          </span>
        </div>
      </Link>
    </article>
  );
}
