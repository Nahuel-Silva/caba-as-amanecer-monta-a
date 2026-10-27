# PROYECTO: WEB PROFESIONAL PARA CABAÑAS AMANECER DE MONTAÑA

## 1. Rol y objetivo

Actuá como un equipo senior compuesto por un arquitecto de software, diseñador UX/UI, desarrollador frontend, especialista en SEO técnico y experto en infraestructura web.

Quiero desarrollar una página web profesional para mi emprendimiento turístico **Cabañas Amanecer de Montaña**, ubicado en Malargüe, Mendoza, Argentina.

El establecimiento cuenta inicialmente con entre 2 y 5 cabañas.

El objetivo principal de la web es presentar el complejo, transmitir confianza, mostrar fotografías y servicios, posicionarse en Google y conseguir consultas de potenciales huéspedes mediante WhatsApp.

La web debe estar preparada para crecer y permitir incorporar en el futuro reservas online, administración de disponibilidad, tarifas por temporada, pagos y gestión integral del complejo.

No quiero una web genérica ni una plantilla básica. Quiero una identidad visual propia, una experiencia de usuario cuidada y una base tecnológica profesional.

## 2. Estrategia del proyecto

Desarrollá una primera versión funcional, profesional y económicamente razonable.

En esta primera etapa, priorizá:

1. Una presentación visual atractiva del complejo.
2. Una sección independiente para cada cabaña.
3. Una galería fotográfica optimizada.
4. Botones de consulta por WhatsApp.
5. Información sobre ubicación, servicios y atractivos de Malargüe.
6. SEO local para atraer visitantes desde Google.
7. Un sistema sencillo para modificar el contenido sin tener que editar código constantemente.
8. Una arquitectura modular que permita sumar funcionalidades futuras.

No desarrolles inicialmente un motor completo de reservas, un sistema de pagos, una aplicación móvil ni un backend complejo si no son necesarios para cumplir los objetivos de esta primera versión.

La prioridad es publicar una buena web que empiece a generar consultas reales.

## 3. Tecnologías recomendadas

Evaluá y utilizá, salvo que exista una justificación técnica sólida para otra alternativa, las siguientes tecnologías:

### Frontend
- Next.js con App Router.
- React.
- TypeScript en modo estricto.
- Tailwind CSS.
- shadcn/ui para los componentes que realmente lo necesiten.
- Componentes reutilizables y diseño responsive.
- Server Components por defecto para favorecer el rendimiento y el SEO.

### Contenido y arquitectura
Para la primera versión, elegí la solución más sencilla que permita administrar cómodamente el contenido.

Evaluá estas dos alternativas:

A. Contenido estructurado en archivos TypeScript o JSON, con fotografías optimizadas y configuración centralizada.

B. Un CMS headless sencillo que permita actualizar cabañas, imágenes, descripciones y servicios desde una interfaz administrativa.

Elegí la alternativa más adecuada según el costo, la facilidad de mantenimiento y la necesidad real de editar contenido frecuentemente.

No incorpores PostgreSQL, Prisma o Supabase únicamente por anticipar un crecimiento hipotético. Incorporalos cuando una funcionalidad concreta lo justifique.

La arquitectura debe permitir agregar posteriormente una base de datos sin tener que reescribir la interfaz completa.

### Infraestructura
- Git y GitHub para versionado.
- Vercel u otro hosting compatible con Next.js.
- Dominio propio.
- HTTPS.
- Despliegues automatizados.
- Variables de entorno para configuraciones sensibles.
- Configuración separada para desarrollo y producción.

Explicá los costos estimados y las limitaciones de los servicios elegidos antes de asumir compromisos de pago.

## 4. Identidad visual de Cabañas Amanecer de Montaña

Creá una identidad visual que transmita la experiencia de despertar rodeado de montañas, descansar, disfrutar de la naturaleza y descubrir Malargüe.

El nombre del establecimiento debe ser un elemento importante de la identidad visual.

Concepto creativo:
- Amaneceres sobre las montañas.
- Luz cálida del sol.
- Paisajes naturales del sur mendocino.
- Tranquilidad, descanso y hospitalidad.
- Una experiencia auténtica, acogedora y memorable.

### Dirección artística

Utilizá una estética moderna, cálida, natural y elegante.

Paleta sugerida:
- Arena y beige cálido.
- Terracota suave.
- Verde oliva o tonos naturales.
- Marrón piedra.
- Blanco cálido.

La tipografía debe combinar personalidad en los títulos con excelente legibilidad en los textos.

Utilizá fotografías grandes y atractivas como protagonistas del diseño.

Evitá:
- Diseños turísticos genéricos.
- Exceso de tarjetas y bordes.
- Degradados llamativos sin propósito.
- Animaciones excesivas.
- Efectos que ralenticen la web.
- Fotografías de stock presentadas como si fueran del establecimiento.
- Diseños que parezcan una plantilla sin personalización.

La web debe verse excelente tanto en teléfonos como en computadoras.

Si todavía no dispongo de fotografías reales, creá espacios visuales de demostración claramente identificados y fáciles de reemplazar. No inventes fotografías reales del complejo.

## 5. Estructura de la web

### Página de inicio

Diseñá una página de inicio con:

1. Header con identidad visual, navegación y botón de WhatsApp.
2. Hero principal con una fotografía panorámica impactante.
3. Nombre destacado: Cabañas Amanecer de Montaña.
4. Un mensaje breve y emocional relacionado con el descanso y la naturaleza en Malargüe.
5. Botón principal: "Consultar disponibilidad".
6. Botón secundario: "Conocer las cabañas".
7. Presentación del complejo.
8. Sección con las cabañas disponibles.
9. Servicios y comodidades.
10. Galería fotográfica.
11. Sección sobre Malargüe y sus atractivos turísticos.
12. Ubicación y mapa.
13. Preguntas frecuentes.
14. Llamada final a la acción para consultar por WhatsApp.
15. Footer con contacto, redes sociales y enlaces importantes.

El contenido debe ser natural, convincente y claro. Evitá frases publicitarias vacías y afirmaciones no verificadas.

### Sección de cabañas

Cada cabaña debe poder tener su propia página con una URL amigable, por ejemplo:

- /cabanas
- /cabanas/nombre-de-cabana

La información debe ser dinámica y no estar duplicada en varios componentes.

Cada alojamiento debe permitir mostrar:
- Nombre.
- Descripción.
- Galería de fotos.
- Capacidad máxima.
- Dormitorios y camas.
- Baños.
- Cocina y equipamiento.
- Servicios incluidos.
- Información de acceso.
- Reglas del alojamiento.
- Botón de consulta por WhatsApp.

Los datos que todavía no conozca deben quedar configurables y no inventarse.

No publiques precios, disponibilidad, características ni servicios sin confirmación del propietario.

Prepará la estructura para incorporar nuevas cabañas sin modificar manualmente la lógica de la web.

### Galería fotográfica

Implementá una galería atractiva y responsive que permita:
- Visualizar imágenes en alta calidad.
- Abrir fotografías en una vista ampliada.
- Navegar entre imágenes.
- Utilizar imágenes optimizadas para diferentes dispositivos.
- Incorporar textos alternativos accesibles.

Optimizá los archivos para reducir el peso sin comprometer excesivamente la calidad.

### Sección turística de Malargüe

Creá una sección inspiradora y útil para los visitantes.

Podés contemplar atractivos como:
- Caverna de las Brujas.
- Castillos de Pincheira.
- La Payunia.
- Laguna de la Niña Encantada.
- Otros lugares de interés turístico de Malargüe y sus alrededores.

Presentá información útil, fotografías autorizadas y enlaces a fuentes oficiales cuando corresponda.

No inventes distancias, tiempos de viaje, horarios, condiciones de acceso ni servicios. La información turística debe poder actualizarse fácilmente.

### Ubicación

Incorporá una sección con:
- Dirección configurable.
- Mapa integrado.
- Indicaciones para llegar.
- Acceso desde las principales vías, si se verifica la información.
- Botón para abrir la ubicación en una aplicación de mapas.

No inventes una dirección exacta. Si todavía no se proporciona, utilizá un marcador de posición que no se publique como dato real.

### Preguntas frecuentes

Prepará una sección editable con preguntas sobre:
- Cómo consultar disponibilidad.
- Cómo reservar.
- Medios de pago.
- Horarios de entrada y salida.
- Capacidad de las cabañas.
- Servicios incluidos.
- Políticas de cancelación.
- Mascotas, si corresponde.
- Cómo llegar.

Las respuestas definitivas deben ser proporcionadas o aprobadas por el propietario.

## 6. Integración con WhatsApp

WhatsApp es la principal conversión de esta primera versión.

Implementá una integración sencilla, confiable y fácil de mantener.

Todos los botones de consulta deben utilizar un número de WhatsApp configurable desde una única fuente de configuración.

Utilizá enlaces oficiales de WhatsApp con mensajes precargados y codificación correcta de caracteres.

El mensaje debe adaptarse al contexto.

Ejemplo general:

"Hola, quisiera recibir información sobre Cabañas Amanecer de Montaña en Malargüe. ¿Podrían indicarme disponibilidad, tarifas y servicios?"

Cuando el visitante consulta desde una cabaña específica, incluir su nombre en el mensaje.

Si agregás campos opcionales para fechas o cantidad de huéspedes, incorporarlos al mensaje únicamente cuando hayan sido completados.

La web debe:
- Permitir consultar desde el inicio.
- Permitir consultar desde cada cabaña.
- Tener un botón visible en dispositivos móviles sin tapar contenido.
- Mostrar llamadas a la acción claras.
- Evitar formularios largos e innecesarios.

No afirmar que una reserva está confirmada cuando solamente se abrió una conversación de WhatsApp.

No incluir un número inventado. Crear una variable de configuración pendiente de completar.

## 7. Gestión del contenido

El propietario debe poder actualizar fácilmente:
- Descripciones.
- Fotografías.
- Nombre y características de las cabañas.
- Servicios.
- Información de contacto.
- WhatsApp.
- Redes sociales.
- Dirección.
- Preguntas frecuentes.
- Contenido turístico.

Seleccioná una estrategia de administración acorde con la primera etapa.

Si usás archivos de configuración, organizalos de manera clara y documentá cómo editarlos.

Si usás un CMS, asegurate de que el propietario pueda actualizar contenido sin necesidad de programar y evaluá su costo.

No desarrolles un panel de administración propio completo en esta etapa salvo que exista una necesidad concreta.

## 8. SEO y posicionamiento en Google

Implementá SEO técnico desde el principio.

Trabajá el posicionamiento local con términos como:
- Cabañas en Malargüe.
- Cabañas turísticas en Malargüe, Mendoza.
- Alojamiento en Malargüe.
- Hospedaje en Malargüe.
- Cabañas para visitar los atractivos turísticos de Malargüe.

Incorporá:
- Metadatos específicos por página.
- Títulos y descripciones relevantes.
- URLs amigables.
- Sitemap XML.
- robots.txt.
- Canonical URLs.
- Open Graph.
- Imágenes con textos alternativos.
- Datos estructurados Schema.org apropiados para alojamientos.
- Optimización para móviles.
- Integración preparada para Google Search Console y Google Analytics, si el propietario lo decide.

No inventes reseñas, valoraciones, precios ni datos comerciales para mejorar artificialmente el posicionamiento.

Prepará la web para asociarse con un Perfil de Empresa de Google, sin afirmar que existe si todavía no fue creado.

## 9. Rendimiento y accesibilidad

La web debe cargar rápido incluso con conexiones móviles moderadas.

Implementá:
- Optimización de imágenes.
- Carga diferida cuando corresponda.
- Fuentes optimizadas.
- JavaScript mínimo necesario.
- Buenas métricas de Core Web Vitals.
- Navegación por teclado.
- Contraste adecuado.
- Etiquetas accesibles.
- Formularios con mensajes de error claros.
- Respeto por la preferencia de movimiento reducido.

Evitá agregar librerías grandes si una solución sencilla puede cumplir la misma función.

## 10. Seguridad y mantenimiento

Aplicá buenas prácticas:
- No exponer secretos en el frontend.
- No almacenar credenciales en el repositorio.
- Validar datos de formularios en el servidor cuando corresponda.
- Implementar protección contra spam si hay formularios.
- No registrar datos personales innecesarios.
- Mantener dependencias actualizadas.
- Documentar configuraciones.
- Manejar correctamente errores y enlaces externos.

La primera versión debe minimizar la recolección de datos personales.

## 11. Arquitectura preparada para crecer

Organizá el proyecto por funcionalidades y responsabilidades.

Separá claramente:
- Páginas y rutas.
- Componentes reutilizables.
- Datos de las cabañas.
- Configuración del establecimiento.
- Contenido turístico.
- Integraciones.
- Funciones de SEO.
- Utilidades compartidas.

No concentres toda la lógica en un solo archivo.

La arquitectura debe permitir incorporar en futuras etapas:
- Base de datos PostgreSQL.
- Panel administrativo.
- Gestión de múltiples cabañas.
- Calendario de disponibilidad.
- Tarifas por temporada.
- Reservas online.
- Pagos digitales.
- Notificaciones automáticas.
- Sincronización con plataformas externas.
- Sitio multilingüe, especialmente español e inglés, si el negocio lo necesita.

No implementes ahora estas funciones si no aportan valor a la primera versión. Dejá documentado cómo podrían integrarse posteriormente.

## 12. Plan de desarrollo

### Fase 1: planificación

- Revisar los requisitos.
- Proponer la arquitectura.
- Definir la estructura de carpetas.
- Diseñar el mapa del sitio.
- Definir el sistema visual.
- Identificar los datos pendientes del propietario.

### Fase 2: desarrollo visual

- Crear el proyecto.
- Implementar el diseño responsive.
- Construir el inicio.
- Desarrollar las páginas de las cabañas.
- Implementar la galería.
- Crear la sección turística.
- Incorporar ubicación, contacto y preguntas frecuentes.

### Fase 3: conversión y SEO

- Integrar WhatsApp.
- Verificar los mensajes precargados.
- Implementar SEO técnico.
- Optimizar imágenes.
- Verificar enlaces y navegación.
- Comprobar el rendimiento en dispositivos móviles.

### Fase 4: publicación

- Preparar el repositorio.
- Configurar el hosting.
- Conectar el dominio.
- Activar HTTPS.
- Verificar el sitio en producción.
- Documentar cómo actualizar el contenido.
- Entregar instrucciones para mantener el proyecto.

### Fase 5: evolución futura

Presentar un roadmap con prioridades, costos aproximados y complejidad para incorporar reservas, administración y pagos.

## 13. Criterios de aceptación

La primera versión estará lista cuando:

- Todas las páginas principales funcionen.
- El diseño sea consistente en celulares y computadoras.
- Cada cabaña pueda mostrar su información individual.
- Los botones de WhatsApp abran el contacto correcto con el mensaje adecuado.
- El contenido se pueda actualizar mediante el mecanismo elegido.
- Las imágenes estén optimizadas.
- El SEO básico esté implementado.
- No existan enlaces rotos ni botones que aparenten funcionar sin hacerlo.
- No se publiquen datos inventados.
- El proyecto se pueda ejecutar localmente siguiendo la documentación.
- Exista un procedimiento documentado de despliegue.
- Se hayan probado los flujos principales antes de publicar.

## 14. Instrucciones finales

Antes de empezar a programar, presentá brevemente:
1. La arquitectura elegida y su justificación.
2. Las tecnologías y los costos estimados.
3. La estructura del proyecto.
4. El concepto visual propuesto.
5. Los datos que necesito proporcionar para personalizar la web.

No detengas todo el trabajo por datos secundarios faltantes. Utilizá marcadores de posición claramente identificados.

Después, comenzá a construir la web funcional, no te limites a generar una maqueta o una captura visual.

Entregá código real, organizado y ejecutable. Ejecutá las pruebas disponibles y corregí los errores que encuentres.

Priorizá calidad visual, rapidez, SEO, facilidad de mantenimiento y generación de consultas.

El resultado debe ser una web que pueda publicar para **Cabañas Amanecer de Montaña**, empezar a recibir consultas de turistas y evolucionar de forma ordenada a medida que crezca el negocio.