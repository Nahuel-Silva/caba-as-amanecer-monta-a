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

Mientras la variable esté vacía, el ícono flotante y los botones de consulta no se muestran. Nunca se publica un número inventado.

Los mensajes precargados se arman en `src/lib/whatsapp.ts` (mensaje general y mensaje por cabaña).

## Dónde editar el contenido

| Qué | Archivo |
| --- | --- |
| Nombre, ubicación, dirección, coordenadas, indicaciones, textos generales y servicios | `src/content/site.ts` |
| Atractivos de Malargüe (texto, fuente y fotos con crédito) | `src/content/attractions.ts` |
| Preguntas frecuentes | `src/content/faqs.ts` |
| Cabañas (nombre, descripción, capacidad, camas, baños, servicios, reglas, fotos) | `src/content/cabins.ts` |
| Fotos | `public/images/` (y se referencian desde `cabins.ts`) |

Todo dato sin confirmar dice `PENDIENTE`. No se publican precios, disponibilidad ni características que no haya confirmado el propietario.

Para agregar una cabaña, sumá un objeto al arreglo de `src/content/cabins.ts` con un `slug` nuevo: la página `/cabanas/<slug>` se genera sola.

Cuando cargues fotos reales, poné `isDemo: false` en cada imagen para que desaparezca el rótulo "Foto de demostración".

## Atractivos de Malargüe y sus fotos

Los textos de `src/content/attractions.ts` están escritos con palabras propias a partir de fuentes del Gobierno de Mendoza (cada atractivo enlaza a la suya). Solo se incluyen distancias que figuran en esas fuentes; no hay horarios, tarifas ni condiciones de acceso, que cambian: la sección remite a la Dirección de Turismo de Malargüe.

**Fotos:** las actuales vienen de Wikimedia Commons, con licencias CC BY-SA, y la página muestra autor y licencia de cada una. Para agregar otra, copiá el archivo a `public/images/malargue/` y sumá al atractivo:

```ts
image: {
  src: "/images/malargue/payunia.jpg",
  alt: "Descripción de lo que se ve en la foto",
  credit: "Nombre del autor",
  license: "CC BY-SA 4.0",            // o "Uso autorizado por ..."
  creditUrl: "https://...",           // página de origen (opcional)
  licenseUrl: "https://...",          // texto de la licencia (opcional)
},
```

Usá solo fotos propias, con autorización escrita de quien las tenga, o con una licencia que permita uso comercial (por ejemplo CC BY o CC BY-SA en Wikimedia Commons, citando autor y licencia). No sirven las licencias "NC" (no comercial) ni las fotos tomadas de Google, redes o sitios de turismo sin permiso.

## Promociones

Las promociones de `/promociones` se cargan en `src/content/promotions.ts`: copiá el ejemplo de ese archivo dentro de la lista y, si tiene foto, guardala en `public/images/promociones/`. Cada una necesita `slug`, `title`, `description` y `active`; `discount`, `validity`, `details`, `conditions`, `code` e `image` son opcionales. Cada promoción tiene su propia página en `/promociones/<slug>`, con un formulario que arma la consulta por WhatsApp con fechas y personas; no reserva ni confirma disponibilidad. Con `active: false` deja de mostrarse sin borrarla, y sin promociones activas la página muestra un aviso. La vigencia es solo un texto: la promoción no se oculta sola al vencer.

## Opiniones

Las reseñas del inicio se cargan en `src/content/reviews.ts`. Usá solo opiniones reales, copiadas tal cual y con el enlace a su fuente, y actualizá `ratingsCheckedAt` cuando revises los puntajes. El formulario para dejar una reseña es por ahora un mock: `src/lib/reviews-service.ts` no guarda nada y la web avisa que está en prueba. Para activarlo de verdad hay que reemplazar esa función por una base de datos con aprobación previa. No se agregan reseñas a los datos estructurados de Google.

## Ubicación y mapa

En `src/content/site.ts` completá:

- `address`: la dirección confirmada (por ejemplo `"Ruta 40 km 123"`; la localidad se agrega sola).
- `coordinates`: opcional, por ejemplo `{ lat: -35.1234, lng: -69.1234 }`. Si las cargás, tienen prioridad sobre la dirección y el pin queda exacto. Las podés copiar desde Google Maps (clic derecho sobre el lugar).
- `directions`: indicaciones para llegar, escritas o verificadas por el propietario.

Mientras `address` diga `PENDIENTE` y no haya coordenadas, la sección muestra un aviso y no hay mapa. Con datos cargados aparecen el mapa incrustado y los botones "Cómo llegar" y "Ver en el mapa" (abren Google Maps), y las coordenadas se suman a los datos estructurados para Google.

El mapa usa la incrustación de Google Maps que no requiere clave de API. Si Google la cambiara, el cambio se hace en un solo lugar: `src/lib/location.ts`.

## SEO y publicación en Google

La URL pública se configura con `NEXT_PUBLIC_SITE_URL` (ver `.env.example`).

- **Sin esa variable, el sitio no es indexable:** todas las páginas salen con `noindex`, `robots.txt` bloquea todo y no se publica sitemap. Es a propósito: evita que Google indexe una versión con datos `PENDIENTE`.
- **Con la variable cargada** se activan `robots.txt` (permite todo e indica el sitemap), `sitemap.xml` (inicio, `/cabanas` y cada cabaña), URL canónica, Open Graph y datos estructurados Schema.org (`LodgingBusiness`).
- Los datos estructurados solo incluyen datos confirmados: nombre, localidad, provincia y país; la calle y el teléfono recién aparecen cuando cargás la dirección y el número de WhatsApp. No hay reseñas, valoraciones ni precios.
- Open Graph todavía no incluye imagen: se agrega cuando haya una fotografía real del complejo (las de demostración no se usan).

**Cuándo cargarla:** en Vercel, solo en el entorno *Production* y cuando el contenido real esté listo. Después, dar de alta el sitio en Google Search Console y enviar `https://tu-dominio/sitemap.xml`.

## Estructura

```
src/app/          rutas (/, /cabanas, /cabanas/[slug])
src/components/   componentes reutilizables (header, footer, galería, botones de WhatsApp)
src/content/      datos editables
src/lib/          funciones de acceso a datos y de WhatsApp
public/images/    fotografías
```

## Pendiente (ver BRIEF.md, sección 12)

- Cargar la dirección, las coordenadas y las indicaciones reales (ver "Ubicación y mapa").
- Fotos reales de las cabañas y del complejo, y fotos con licencia de los atractivos.
- Tarifas vigentes, si se quieren publicar.
- Imagen de Open Graph con una foto real.
- Despliegue (hosting y dominio) y guía de publicación.
