# Cabañas Amanecer de Montaña

Web del complejo de cabañas en Malargüe, Mendoza. Next.js (App Router) + TypeScript estricto + Tailwind CSS.
El requerimiento completo está en `BRIEF.md`; las decisiones de arquitectura, en `.github/copilot-instructions.md`.

## Ejecutar en local

Requiere Node.js 20 o superior.

```bash
npm install
cp .env.example .env.local   # en Windows PowerShell: Copy-Item .env.example .env.local
npm run dev                  # http://localhost:3000
```

Antes de publicar cambios:

```bash
npm run build
npm run lint
```

## Número de WhatsApp

El número se configura en **un solo lugar**: la variable de entorno `NEXT_PUBLIC_WHATSAPP_NUMBER`.

- En local: editá `.env.local` (formato: código de país, sin `+`, espacios ni guiones).
- En producción (Vercel): *Project Settings > Environment Variables*, y volvé a desplegar.

Mientras la variable esté vacía, el botón flotante y los botones de consulta por cabaña no se muestran, y los botones "Consultar" del inicio llevan a la sección de contacto. Nunca se publica un número inventado.

Los mensajes precargados se arman en `src/lib/whatsapp.ts` (mensaje general y mensaje por cabaña).

## Dónde editar el contenido

| Qué | Archivo |
| --- | --- |
| Nombre, ubicación, dirección, textos generales, servicios, atractivos, preguntas frecuentes | `src/content/site.ts` |
| Cabañas (nombre, descripción, capacidad, camas, baños, servicios, reglas, fotos) | `src/content/cabins.ts` |
| Fotos | `public/images/` (y se referencian desde `cabins.ts`) |

Todo dato sin confirmar dice `PENDIENTE`. No se publican precios, disponibilidad ni características que no haya confirmado el propietario.

Para agregar una cabaña, sumá un objeto al arreglo de `src/content/cabins.ts` con un `slug` nuevo: la página `/cabanas/<slug>` se genera sola.

Cuando cargues fotos reales, poné `isDemo: false` en cada imagen para que desaparezca el rótulo "Foto de demostración".

## Estructura

```
src/app/          rutas (/, /cabanas, /cabanas/[slug])
src/components/   componentes reutilizables (header, footer, galería, botones de WhatsApp)
src/content/      datos editables
src/lib/          funciones de acceso a datos y de WhatsApp
public/images/    fotografías
```

## Pendiente (ver BRIEF.md, sección 12)

- SEO técnico: sitemap, robots, canonical, Open Graph y datos estructurados.
- Separar atracciones y preguntas frecuentes en archivos propios.
- Mapa y botón "Cómo llegar" cuando haya dirección confirmada.
- Fotos reales y datos reales de las cabañas.
- Despliegue (hosting y dominio) y guía de publicación.
