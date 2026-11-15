import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

/**
 * Configuración para publicar en Cloudflare Workers (plan gratis).
 * Las páginas generadas al compilar se sirven desde los archivos estáticos (sin almacenamiento extra como R2).
 * La web no usa revalidación de Next.js: el pronóstico del clima tiene su propia caché (src/lib/weather-service.ts).
 */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
