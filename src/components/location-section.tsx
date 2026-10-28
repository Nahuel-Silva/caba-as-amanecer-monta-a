import { site } from "@/content/site";
import { getLocation, isConfirmed } from "@/lib/location";

/** Panel de dirección + mapa. Solo muestra datos confirmados; si faltan, deja un aviso claro. */
export function LocationSection() {
  const location = getLocation();

  if (!location) {
    return (
      <div className="location-grid">
        <div className="location-copy">
          <div>
            <span className="pending-note">Dirección: {site.address}</span>
            <p>La ubicación exacta y las indicaciones se agregarán cuando estén confirmadas.</p>
          </div>
          <p>{site.location}</p>
        </div>
        <div aria-label="Mapa pendiente de ubicación confirmada" className="map-placeholder" role="img">
          <div className="map-placeholder-inner">
            <span className="pending-note">Mapa: pendiente</span>
            <p>Se mostrará aquí la ubicación del alojamiento.</p>
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
          {isConfirmed(site.directions) && <p className="location-directions">{site.directions}</p>}
        </div>
        <div className="location-actions">
          <a className="button button-light" href={location.directionsUrl} rel="noopener noreferrer" target="_blank">
            Cómo llegar <span aria-hidden="true">↗</span>
            <span className="sr-only"> (se abre Google Maps en una pestaña nueva)</span>
          </a>
          <a className="button button-outline" href={location.openUrl} rel="noopener noreferrer" target="_blank">
            Ver en el mapa
            <span className="sr-only"> (se abre Google Maps en una pestaña nueva)</span>
          </a>
        </div>
      </div>
      <div className="map-embed">
        <iframe
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={location.embedUrl}
          title={`Mapa con la ubicación de ${site.name}`}
        />
      </div>
    </div>
  );
}
