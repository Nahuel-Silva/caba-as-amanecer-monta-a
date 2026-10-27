# Cabañas Amanecer de Montaña — contexto del proyecto

El requerimiento completo está en `BRIEF.md`. Leelo entero antes de empezar. Este archivo resume las decisiones ya tomadas para no volver a discutirlas.

## Decisiones ya tomadas

- **Contenido:** opción A, archivos TypeScript tipados en `src/content/` (`site.ts`, `cabins.ts`, `attractions.ts`, `faqs.ts`). Sin CMS, sin base de datos, sin backend, sin formularios. No se recolectan datos personales.
- **Capa de acceso a datos:** la interfaz nunca importa los arrays directamente; usa funciones como `getCabins()` y `getCabinBySlug()` (en `src/lib/`). Así, migrar a un CMS o a PostgreSQL solo cambia esa capa.
- **Stack:** Next.js (App Router) + React + TypeScript estricto + Tailwind CSS. Server Components por defecto; componentes cliente solo para lightbox, menú móvil y selector opcional de fechas/huéspedes. No usar shadcn/ui salvo que un componente concreto lo justifique.
- **WhatsApp:** un único helper en `src/lib/whatsapp.ts`; el número sale de una sola fuente de configuración (variable de entorno, ej. `NEXT_PUBLIC_WHATSAPP_NUMBER`). Mensaje precargado con `encodeURIComponent`, adaptado al contexto (general o por cabaña); fechas y huéspedes solo si se completaron. Nunca afirmar que una reserva está confirmada.
- **Datos no confirmados:** nunca inventar número, dirección, precios, disponibilidad, reseñas, distancias, horarios ni características. Usar marcadores de posición claramente identificados y que no se publiquen como datos reales (por ejemplo `PENDIENTE`). Las fotos faltantes se muestran como placeholders rotulados "Foto de demostración".
- **Schema.org:** emitir datos estructurados solo con datos confirmados; sin `aggregateRating` ni precios inventados.
- **Identidad visual:** concepto "luz de amanecer". Paleta arena/beige cálido, terracota suave, verde oliva, marrón piedra y blanco cálido. Títulos en serif con carácter, texto en sans legible (`next/font`). Fotos grandes como protagonistas, pocas tarjetas, animaciones mínimas y respeto de `prefers-reduced-motion`.

## Estructura prevista

```
src/app/            rutas: /, /cabanas, /cabanas/[slug], sitemap.ts, robots.ts
src/components/     ui, layout, secciones, galería
src/content/        site.ts, cabins.ts, attractions.ts, faqs.ts
src/lib/            whatsapp.ts, seo.ts, utilidades
public/images/      fotos reales (hoy placeholders)
docs/               edición de contenido, despliegue, roadmap
```

## Costos a confirmar con el propietario antes de contratar

- Vercel Hobby es gratis pero solo para uso no comercial; para el negocio corresponde Vercel Pro (aprox. USD 20/mes) u otro hosting compatible con Next.js.
- Dominio .com.ar gratuito en NIC Argentina (con renovación anual); un .com cuesta aprox. USD 10–15/año.
- GitHub, HTTPS, Search Console y Analytics: gratis.

## Datos pendientes del propietario

Número de WhatsApp; dirección y coordenadas; cantidad y nombres de las cabañas; capacidad, dormitorios, camas, baños y equipamiento de cada una; fotos reales; horarios de check-in/out; medios de pago, cancelación y mascotas; redes sociales; dominio.

## Cómo empezar

1. Crear el proyecto: `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm`
2. Construir según el plan de fases del `BRIEF.md` (sección 12).
3. Antes de dar algo por terminado, correr `npm run build`, `npm run lint` y el typecheck, y probar rutas y enlaces de WhatsApp.
4. Documentar en `README.md` y `docs/` cómo editar contenido, desplegar y el roadmap futuro (reservas, pagos, panel, multilingüe).