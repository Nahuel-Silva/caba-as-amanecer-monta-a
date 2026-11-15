import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // cacheComponents y partialPrefetching quedan desactivados: en Cloudflare Workers hacen que las páginas se cuelguen
  // (vercel/next.js#94880, opennextjs-cloudflare#1115). Volver a probarlos cuando se resuelva.
  images: {
    qualities: [75, 90],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

// En desarrollo (next dev) da acceso a los bindings de Cloudflare, como la base D1 simulada (ver src/lib/db.ts).
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
