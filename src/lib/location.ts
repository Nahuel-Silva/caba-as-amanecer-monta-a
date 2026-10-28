import { PENDING, site } from "@/content/site";

/**
 * Ubicación del alojamiento.
 *
 * Mientras no haya dirección ni coordenadas confirmadas en src/content/site.ts,
 * getLocation() devuelve null y la web muestra un aviso en lugar del mapa.
 * Nunca se publica una dirección o un punto inventado.
 */

export type Coordinates = { lat: number; lng: number };

export function isValidCoordinates(value: Coordinates | null | undefined): value is Coordinates {
  return (
    !!value &&
    Number.isFinite(value.lat) &&
    Number.isFinite(value.lng) &&
    Math.abs(value.lat) <= 90 &&
    Math.abs(value.lng) <= 180
  );
}

export function isConfirmed(text: string | undefined): text is string {
  const value = (text ?? "").trim();
  return value !== "" && value !== PENDING;
}

/** Texto que se envía a Google Maps: coordenadas si las hay; si no, la dirección más la localidad. */
export function buildMapQuery(
  address: string,
  coordinates: Coordinates | null,
  locality: string = site.location,
): string | null {
  if (isValidCoordinates(coordinates)) return `${coordinates.lat},${coordinates.lng}`;
  if (isConfirmed(address)) return `${address.trim()}, ${locality}`;
  return null;
}

export type LocationLinks = {
  query: string;
  /** Mapa incrustado (no requiere clave de API). */
  embedUrl: string;
  /** Abre el lugar en Google Maps. */
  openUrl: string;
  /** Abre Google Maps con la ruta hacia el alojamiento ("Cómo llegar"). */
  directionsUrl: string;
};

export function buildLocationLinks(query: string): LocationLinks {
  const q = encodeURIComponent(query);
  return {
    query,
    embedUrl: `https://www.google.com/maps?q=${q}&z=15&hl=es&output=embed`,
    openUrl: `https://www.google.com/maps/search/?api=1&query=${q}`,
    directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${q}`,
  };
}

/** Enlaces de mapa del alojamiento, o null si todavía no hay ubicación confirmada. */
export function getLocation(): LocationLinks | null {
  const query = buildMapQuery(site.address, site.coordinates);
  return query ? buildLocationLinks(query) : null;
}
