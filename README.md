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

En desarrollo la base de datos es una copia simulada de Cloudflare D1 que se guarda en la carpeta `.wrangler` (no se sube al repositorio). Empieza vacía y las tablas se crean solas.

Antes de publicar cambios:

```bash
npm run build
npm run lint
npm run cf:preview   # opcional: la web armada para Cloudflare, en http://localhost:8787
```

`cf:preview` usa el mismo motor que Cloudflare. En Windows necesita el **Modo de desarrollador** activado (Configuración → Sistema → Avanzado) y lee las variables secretas de `.dev.vars` (no se sube al repositorio).

## Publicación en Cloudflare

La web está en Cloudflare Workers (plan gratis), conectada a GitHub: cada cambio subido a `main` se compila y se publica solo.

- **Comandos** (Workers & Pages → cabanas-amanecer-montana → Settings → Build): build `npx opennextjs-cloudflare build`, deploy `npx opennextjs-cloudflare deploy`, preview `npx opennextjs-cloudflare upload`. El deploy tiene que ser el del adaptador (no `wrangler deploy`), porque copia la caché de las páginas.
- **Variables de compilación** (Build): `NEXT_PUBLIC_WHATSAPP_NUMBER` y `NEXT_PUBLIC_PHONE_NUMBERS`, porque se escriben dentro de la web al compilarla. Más adelante, `NEXT_PUBLIC_SITE_URL`.
- **Variables secretas** (Variables and Secrets, tipo Secret): `ADMIN_PASSWORD`, `RESEND_API_KEY`, `RESERVATIONS_EMAIL_TO` y `RESERVATIONS_EMAIL_FROM`. `keep_vars` en `wrangler.jsonc` evita que cada publicación las borre.
- **Configuración:** `wrangler.jsonc` (Worker, base D1, fotos) y `open-next.config.ts` (caché de páginas en los archivos estáticos).
- `cacheComponents` de Next.js está desactivado porque cuelga las páginas en Workers (ver `next.config.ts`).

## Número de WhatsApp

El número se configura en **un solo lugar**: la variable de entorno `NEXT_PUBLIC_WHATSAPP_NUMBER`.

- En local: editá `.env.local` (formato: código de país, sin `+`, espacios ni guiones).
- En producción (Cloudflare): variable de compilación, ver "Publicación en Cloudflare". Al cambiarla hay que volver a publicar.

Mientras la variable esté vacía, el ícono flotante y los botones de consulta no se muestran. Nunca se publica un número inventado.

Los mensajes precargados se arman en `src/lib/whatsapp.ts` (mensaje general y mensaje por cabaña).

## Teléfonos para reservar por llamada

Se configuran en la variable `NEXT_PUBLIC_PHONE_NUMBERS`, con el formato `Nombre | número` y las entradas separadas por `;` (ver `.env.example`). Después de cargarla o cambiarla hay que volver a desplegar.

El botón aparece al lado del de Instagram y abre una ventana con los números: en el celular cada número llama al tocarlo; en la computadora solo se muestra. Mientras la variable esté vacía, el botón no aparece.

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

## Solicitudes de reserva por mail

La barra de reserva abre un formulario con los datos elegidos, que envía la solicitud a `/api/reservas`. El propietario recibe un mail, al que puede responder directamente, y el huésped recibe un acuse que aclara que la reserva todavía no está confirmada. No bloquea fechas.

Hay que cargar `RESEND_API_KEY`, `RESERVATIONS_EMAIL_TO` y `RESERVATIONS_EMAIL_FROM` (ver `.env.example`). Para enviarle el acuse al huésped hace falta un dominio propio verificado en Resend. La protección contra abuso es básica (campo trampa, mismo origen y límite por IP en memoria): con la web publicada conviene sumar un captcha.

## Base de datos y panel

Las solicitudes de reserva, las reseñas, las promociones y los ajustes del panel se guardan en [Cloudflare D1](https://developers.cloudflare.com/d1/), la base "cabanas-amanecer" (binding `DB` en `wrangler.jsonc`). Las tablas se crean solas. Para consultarla: `npx wrangler d1 execute cabanas-amanecer --remote --command "SELECT ..."` (requiere `npx wrangler login`). En desarrollo se usa una copia simulada local.

En `/admin`, con la contraseña `ADMIN_PASSWORD`, se confirman o rechazan reservas, se bloquean fechas, se aprueban reseñas y se cargan promociones:

- Una solicitud queda pendiente y bloquea sus fechas por 24 horas. Si no se confirma, se liberan solas.
- Una solicitud admite hasta 30 noches, y no puede tomar noches ocupadas.
- Confirmar falla si otra reserva ocupa esas noches.
- Cancelar una reserva confirmada libera las fechas.
- Las reseñas se publican solas. Solo quedan pendientes las que tienen insultos o enlaces (`src/lib/review-moderation.ts`).

El calendario solo recibe fechas: los datos de los huéspedes se ven únicamente en el panel.

## Promociones

Las promociones se guardan en la base de datos y se cargan desde la pestaña Promociones de `/admin`: se pueden crear, editar, ocultar y borrar, y cada una puede tener foto y un precio total (opcional, en pesos; las promociones sin precio no lo muestran). La foto se achica en el navegador y se guarda en la base. Cada promoción tiene su página en `/promociones/<slug>`. La vigencia es solo un texto: la promoción no se oculta sola al vencer.

### Avisos de promociones por mail

Quien quiera recibir promociones lo acepta con una casilla sin marcar: en el formulario de reserva (queda anotado enseguida, con nombre, mail y teléfono) o en la página Promociones (solo el mail; queda pendiente hasta que confirme desde el mail que le llega, y si no confirma en una semana se borra). Las condiciones están en `/condiciones-promociones` (`src/app/condiciones-promociones/page.tsx`); si se cambian de fondo, subir `consentVersion` en `src/lib/subscribers.ts`.

En el panel, cada promoción visible tiene el botón "Avisar por mail": manda el aviso a las personas confirmadas que todavía no lo recibieron, como mucho 100 por vez (límite diario del plan gratis de Resend). Cada mail lleva su enlace de baja (`/suscripcion?baja=...`) y la baja con un clic para Gmail (`/api/suscripcion/baja`). Al darse de baja se borran los datos de la persona. Debajo de las promociones está la lista de anotados, con un botón para copiar los teléfonos para una lista de difusión de WhatsApp Business. Los mails a huéspedes solo salen con el dominio propio verificado en Resend.

## Opiniones

Las reseñas del inicio se cargan en `src/content/reviews.ts`. Usá solo opiniones reales, copiadas tal cual y con el enlace a su fuente, y actualizá `ratingsCheckedAt` cuando revises los puntajes. Las reseñas del formulario se publican solas, también las negativas. Las que tienen insultos o enlaces esperan revisión en `/admin`, y desde ahí se puede quitar cualquiera. No se agregan reseñas a los datos estructurados de Google.

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

**Cuándo cargarla:** en Cloudflare, como variable de compilación, cuando el contenido real esté listo y la web tenga su dominio propio. Después, dar de alta el sitio en Google Search Console y enviar `https://tu-dominio/sitemap.xml`.

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
