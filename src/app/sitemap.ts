import type { MetadataRoute } from "next";
import { getCabins } from "@/lib/cabins";
import { absoluteUrl, siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  // Sin URL pública configurada no se publica sitemap (el sitio no es indexable).
  if (!siteUrl) return [];

  const paths = ["/", "/cabanas", ...getCabins().map((cabin) => `/cabanas/${cabin.slug}`)];

  return paths.flatMap((path) => {
    const url = absoluteUrl(path);
    return url ? [{ url }] : [];
  });
}
