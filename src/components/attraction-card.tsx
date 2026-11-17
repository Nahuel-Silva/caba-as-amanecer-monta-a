import Image from "next/image";
import type { Attraction } from "@/content/attractions";
import type { Locale } from "@/i18n/config";
import { pages } from "@/i18n/pages";
import { ui } from "@/i18n/ui";
import "./attraction-card.css";

type AttractionCardProps = {
  attraction: Attraction;
  eager?: boolean;
  /** Nivel del título, según la sección donde va la tarjeta. */
  headingLevel?: "h2" | "h3";
  locale?: Locale;
};

const officialSource: Record<Locale, string> = { es: "Fuente oficial", pt: "Fonte oficial", en: "Official source" };

export function AttractionCard({ attraction, eager = false, headingLevel: Heading = "h2", locale = "es" }: AttractionCardProps) {
  const { image } = attraction;

  return (
    <article className={`attraction-card${image ? "" : " is-text-only"}`}>
      {image && (
        <div className="attraction-photo">
          <Image
            alt={image.alt}
            fill
            loading={eager ? "eager" : undefined}
            quality={90}
            sizes="(max-width: 600px) 100vw, (max-width: 1100px) 40vw, 420px"
            src={image.src}
          />
        </div>
      )}
      <div className="attraction-body">
        <Heading>{attraction.name}</Heading>
        <p>{attraction.detail}</p>
        {attraction.sourceUrl && (
          <a className="text-link" href={attraction.sourceUrl} rel="noopener noreferrer" target="_blank">
            {attraction.sourceLabel ?? officialSource[locale]}
            <span className="sr-only">{ui[locale].newTab}</span>
          </a>
        )}
        {image && (
          <small className="attraction-credit">
            {pages[locale].malargue.photo}{" "}
            {image.creditUrl ? (
              <a href={image.creditUrl} rel="noopener noreferrer" target="_blank">{image.credit}</a>
            ) : (
              image.credit
            )}
            {" · "}
            {image.licenseUrl ? (
              <a href={image.licenseUrl} rel="noopener noreferrer" target="_blank">{image.license}</a>
            ) : (
              image.license
            )}
          </small>
        )}
      </div>
    </article>
  );
}
