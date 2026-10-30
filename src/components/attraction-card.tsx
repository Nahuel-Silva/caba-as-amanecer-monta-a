import Image from "next/image";
import type { Attraction } from "@/content/attractions";
import "./attraction-card.css";

export function AttractionCard({ attraction, eager = false }: { attraction: Attraction; eager?: boolean }) {
  const { image } = attraction;

  return (
    <article className="attraction-card">
      {image && (
        <div className="attraction-photo">
          <Image
            alt={image.alt}
            fill
            loading={eager ? "eager" : undefined}
            quality={90}
            sizes="(max-width: 760px) 100vw, 590px"
            src={image.src}
          />
        </div>
      )}
      <div className="attraction-body">
        <h2>{attraction.name}</h2>
        <p>{attraction.detail}</p>
        {attraction.sourceUrl && (
          <a className="text-link" href={attraction.sourceUrl} rel="noopener noreferrer" target="_blank">
            {attraction.sourceLabel ?? "Fuente oficial"}{" "}
            <span className="sr-only">(se abre en una pestaña nueva)</span>
          </a>
        )}
        {image && (
          <small className="attraction-credit">
            Foto:{" "}
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
