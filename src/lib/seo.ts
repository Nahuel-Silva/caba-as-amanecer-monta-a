import type { Metadata } from "next";
import { PENDING, site } from "@/content/site";
import { isValidCoordinates } from "@/lib/location";
import { whatsappNumber } from "@/lib/whatsapp";

/**
 * SEO centralizado.
 *
 * La URL pública del sitio sale de NEXT_PUBLIC_SITE_URL (ver .env.example).
 * Mientras no esté configurada, el sitio se declara NO indexable (noindex + robots.txt
 * que bloquea todo): así una versión de prueba o con datos pendientes no aparece en Google.
 */

/** Devuelve el origen ("https://dominio.com") o null si el valor no es una URL http(s) válida. */
export function normalizeSiteUrl(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.origin;
  } catch {
    return null;
  }
}

export const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
export const isIndexable = siteUrl !== null;

/** URL base para resolver rutas relativas en metadatos (localhost solo como respaldo en desarrollo). */
export const metadataBase = new URL(siteUrl ?? "http://localhost:3000");

export function absoluteUrl(path: string, base: string | null = siteUrl): string | null {
  if (!base) return null;
  return new URL(path, base).toString();
}

export const defaultDescription = `${site.name}: cabañas turísticas en Malargüe, Mendoza. Consultá disponibilidad, tarifas y servicios.`;

type PageSeo = {
  /** Título de la página; el layout le agrega " | Cabañas Amanecer de Montaña". */
  title: string;
  description: string;
  /** Ruta de la página, por ejemplo "/cabanas" o "/cabanas/payunia". */
  path: string;
};

/** Metadatos de una página: título, descripción, canonical y Open Graph. */
export function pageMetadata({ title, description, path }: PageSeo): Metadata {
  return {
    title,
    description,
    ...(siteUrl ? { alternates: { canonical: path } } : {}),
    openGraph: {
      title,
      description,
      type: "website",
      locale: "es_AR",
      siteName: site.name,
      ...(siteUrl ? { url: path } : {}),
    },
  };
}

/** Si el sitio no es indexable, todas las páginas salen con noindex. */
export const robotsMetadata: Metadata["robots"] = isIndexable ? undefined : { index: false, follow: false };

/**
 * Datos estructurados (Schema.org) del alojamiento.
 * Solo incluye datos confirmados: nombre, localidad y país salen del brief.
 * No se agregan reseñas, valoraciones, precios ni fotos de demostración.
 * Devuelve null si el sitio todavía no es indexable.
 */
export function buildLodgingJsonLd(): Record<string, unknown> | null {
  if (!siteUrl) return null;

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: site.name,
    url: siteUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Malargüe",
      addressRegion: "Mendoza",
      addressCountry: "AR",
    },
  };

  if (site.address !== PENDING) {
    (data.address as Record<string, unknown>).streetAddress = site.address;
  }
  if (isValidCoordinates(site.coordinates)) {
    data.geo = {
      "@type": "GeoCoordinates",
      latitude: site.coordinates.lat,
      longitude: site.coordinates.lng,
    };
  }
  if (whatsappNumber) {
    data.telephone = `+${whatsappNumber}`;
  }

  return data;
}
