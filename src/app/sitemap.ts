import type { MetadataRoute } from "next";
import { getCabins } from "@/lib/cabins";
import { getPromotions } from "@/lib/content";
import { absoluteUrl, siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  // Sin URL pública configurada no se publica sitemap (el sitio no es indexable).
  if (!siteUrl) return [];

  const paths = ["/", "/cabanas", "/promociones", "/malargue", "/ubicacion", "/preguntas", ...getCabins().map((cabin) => `/cabanas/${cabin.slug}`), ...getPromotions().map((promotion) => `/promociones/${promotion.slug}`)];

  return paths.flatMap((path) => {
    const url = absoluteUrl(path);
    return url ? [{ url }] : [];
  });
}
