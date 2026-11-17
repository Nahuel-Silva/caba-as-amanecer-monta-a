import { ArrowUpRightIcon } from "@/components/arrow-icon";
import { site } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { pages } from "@/i18n/pages";
import { getSiteTexts } from "@/lib/content";
import { getLocation, isConfirmed } from "@/lib/location";

/** Panel de dirección + mapa. Solo muestra datos confirmados; si faltan, deja un aviso claro. */
export function LocationSection({ locale = "es" }: { locale?: Locale }) {
  const location = getLocation();
  const t = pages[locale].location;
  const directions = getSiteTexts(locale).directions;

  if (!location) {
    return (
      <div className="location-grid">
        <div className="location-copy">
          <div>
            <span className="pending-note">{t.pendingAddress} {site.address}</span>
            <p>{t.pendingText}</p>
          </div>
          <p>{site.location}</p>
        </div>
        <div aria-label={t.pendingMapLabel} className="map-placeholder" role="img">
          <div className="map-placeholder-inner">
            <span className="pending-note">{t.pendingMap}</span>
            <p>{t.pendingMapText}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="location-grid">
      <div className="location-copy">
        <div>
          {isConfirmed(site.address) && <p className="location-address">{site.address}</p>}
          <p>{site.location}</p>
          {isConfirmed(site.directions) && <p className="location-directions">{directions}</p>}
        </div>
        <div className="location-actions">
          <a className="button button-light" href={location.directionsUrl} rel="noopener noreferrer" target="_blank">
            {t.directions} <ArrowUpRightIcon />
            <span className="sr-only">{t.mapsNewTab}</span>
          </a>
          <a className="button button-outline" href={location.openUrl} rel="noopener noreferrer" target="_blank">
            {t.openMap}
            <span className="sr-only">{t.mapsNewTab}</span>
          </a>
        </div>
      </div>
      <div className="map-embed">
        <iframe allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={location.embedUrl} title={t.mapTitle(site.name)} />
      </div>
    </div>
  );
}
