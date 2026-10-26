# Plan Maestro Técnico y Estratégico: Silantro Tools

> **Subdominio objetivo:** [tools.silantrolabs.com](https://tools.silantrolabs.com)  
> **Organización:** Silantro Labs  
> **Rol:** Arquitectura Frontend, Rendimiento Web, SEO Técnico y Monetización  

---

## 1. Resumen Ejecutivo y Principios de Diseño

El propósito de **Silantro Tools** es ser una plataforma web modular, ultra-rápida y de alta disponibilidad que ofrezca micro-herramientas de utilidad para desarrolladores, diseñadores y usuarios generales, comenzando con un **Generador de Códigos QR** avanzado y extensible a decenas de herramientas futuras.

### Principios Fundamentales
1. **Costo de infraestructura $0 perpetuo:** Servido como activos estáticos globales a través de una red Anycast sin servidores de backend ni bases de datos de pago.
2. **Procesamiento 100% en el cliente (*Client-Side Only*):** Cero consumo de cómputo en servidor. Máxima privacidad para el usuario: ningún dato, texto, URL o imagen sale del navegador.
3. **Aislamiento modular estricto (*Zero Bundle Bleed*):** Ninguna herramienta debe cargar librerías o dependencias de otras herramientas. El tiempo de carga inicial y la navegación deben mantenerse en el percentil 100 de Core Web Vitals.
4. **Arquitectura lista para Google AdSense:** Estructura de contenido diseñada para evitar el rechazo por *"Contenido de poco valor"* (*thin content*), con slots de anuncios integrados sin desplazamiento de diseño (*CLS = 0*).

---

## 2. Elección de Stack Tecnológico

| Capa | Tecnología Seleccionada | Justificación Técnica |
| :--- | :--- | :--- |
| **Generador de Sitio Estático (SSG)** | **Astro (v4.x / v5.x)** | Entrega 0 KB de JavaScript por defecto en páginas de contenido. Su arquitectura de islas (*Islands Architecture*) permite hidratar únicamente los componentes interactivos de cada herramienta. |
| **Motor Interactivo / UI** | **Preact (`@astrojs/preact`)** | Compatibilidad con el ecosistema React con un runtime de solo **~3.5 KB** (frente a los ~45 KB de React estándar), optimizando el *Total Blocking Time (TBT)* y *INP*. |
| **Estilos y Diseño** | **Tailwind CSS** | Compilación atómica en tiempo de compilación. Genera un único archivo CSS purgado minúsculo (<12 KB) compartido por toda la plataforma. |
| **Alojamiento & Edge CDN** | **Cloudflare Pages** | Tráfico y solicitudes ilimitadas sin costo. Certificados SSL/TLS automáticos, soporte nativo de HTTP/3 y cabeceras de caché ultra-agresivas. |
| **Librería de la 1ª Herramienta** | **`qr-code-styling`** | Soporta renderizado vectorial SVG y raster Canvas, 4 niveles de corrección de error Reed-Solomon, inserción de logotipos e iconos y exportación multiformato. |

---

## 3. Estructura Modular del Proyecto

La estructura está organizada para que añadir una nueva herramienta consista únicamente en crear una carpeta dentro de `src/tools/` y un archivo de contenido en `src/content/tools/`:

```text
SilantroTools/
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   ├── _headers                  # Reglas de seguridad y caché de Cloudflare Pages
│   └── logos/
│       └── logo-con-fondo.jpg    # Asset de marca oficial
├── src/
│   ├── assets/                   # Iconos e ilustraciones SVG del sistema
│   ├── components/
│   │   ├── ads/                  # Contenedores de anuncios publicitarios (CLS = 0)
│   │   │   └── AdSlot.astro
│   │   ├── common/               # Componentes estructurales transversales
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   ├── Breadcrumbs.astro
│   │   │   └── ThemeToggle.astro
│   │   ├── seo/                  # Componentes de metadatos y schemas
│   │   │   ├── SEOHead.astro
│   │   │   ├── WebAppSchema.astro
│   │   │   └── FAQSchema.astro
│   │   └── ui/                   # Botones, inputs, sliders, diálogos y cards
│   ├── content/                  # Contenido editorial y técnico para SEO/AdSense
│   │   ├── config.ts             # Validación tipada con Zod para colecciones Astro
│   │   └── tools/                # Artículos, FAQs y guías de cada herramienta
│   │       ├── qr-generator.md
│   │       └── json-formatter.md # Ejemplo de herramienta futura
│   ├── layouts/
│   │   ├── BaseLayout.astro      # Estructura HTML raíz, tags head y scripts de ads
│   │   ├── ToolLayout.astro      # Plantilla dividida (Herramienta + Guía editorial)
│   │   └── LegalLayout.astro     # Plantilla para páginas institucionales y legales
│   ├── pages/
│   │   ├── index.astro           # Directorio y buscador general de herramientas
│   │   ├── privacy.astro         # Política de Privacidad (Auditoría AdSense)
│   │   ├── terms.astro           # Términos de Servicio
│   │   ├── cookies.astro         # Política de Cookies y consentimiento
│   │   ├── contact.astro         # Canal de contacto institucional
│   │   └── tools/
│   │       └── [slug].astro      # Generación estática dinámica de herramientas
│   ├── tools/                    # Código funcional específico de cada herramienta
│   │   └── qr-generator/
│   │       ├── components/
│   │       │   ├── QrCanvas.tsx  # Previsualizador Canvas/SVG
│   │       │   └── QrControls.tsx# Inputs de texto, color, márgenes y logo
│   │       ├── engine/
│   │       │   └── qrRenderer.ts # Import dinámico lazy-loaded de qr-code-styling
│   │       ├── types.ts          # Tipos e interfaces de configuración QR
│   │       └── QrTool.tsx        # Orquestador del componente interactivo Preact
│   └── styles/
│       └── global.css            # Directivas Tailwind y estilos de impresión
├── astro.config.mjs              # Configuración principal de Astro y plugins
├── tailwind.config.mjs           # Configuración de diseño y paleta de colores
├── tsconfig.json                 # Configuración de TypeScript en modo estricto
└── package.json                  # Dependencias y scripts de construcción
```

### Aislamiento de Dependencias y Code Splitting

Para asegurar que librerías de herramientas específicas no se carguen en el catálogo o en otras herramientas:

1. **Lazy Loading Dinámico (`import()`):**
   ```typescript
   // src/tools/qr-generator/engine/qrRenderer.ts
   export async function getQrEngine(options: any) {
     const { default: QRCodeStyling } = await import('qr-code-styling');
     return new QRCodeStyling(options);
   }
   ```
2. **Carga condicional de la Isla en Astro:**
   ```astro
   <!-- src/layouts/ToolLayout.astro -->
   <QrTool client:idle />
   ```
   `client:idle` descarga y ejecuta el JavaScript del componente solo cuando el hilo principal del navegador está desocupado, asegurando una velocidad de renderizado inicial inmediata.

---

## 4. Hosting y Configuración DNS en Cloudflare Pages

### Por qué Cloudflare Pages
* **$0 de por vida:** Transferencia de datos y peticiones ilimitadas (a diferencia de los 100 GB mensuales de Vercel/Netlify).
* **Despliegue continuo:** Conexión nativa con GitHub (`git push` desencadena el build estático).
* **Seguridad perimetral:** Protección DDoS, SSL Universal y firewall incluidos.

### Configuración DNS Paso a Paso

1. **Creación del Proyecto:**
   - En el Dashboard de Cloudflare: **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
   - **Framework:** `Astro`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - Guardar y desplegar (obtendrás un subdominio provisional tipo `silantro-tools.pages.dev`).

2. **Vinculación del Subdominio `tools.silantrolabs.com`:**
   - En el proyecto de Cloudflare Pages: **Custom domains** > **Set up a custom domain**.
   - Ingresar: `tools.silantrolabs.com`.
   - Si `silantrolabs.com` está administrado en Cloudflare, el registro se configurará automáticamente:
     - **Tipo:** `CNAME`
     - **Nombre:** `tools`
     - **Destino:** `silantro-tools.pages.dev`
     - **Proxy status:** `Proxied` (Nube Naranja activa)
     - **TTL:** Automático

3. **Configuración de Criptografía y SSL/TLS:**
   - **SSL/TLS encryption mode:** `Full (strict)`
   - **Always Use HTTPS:** `Activado (ON)`
   - **Automatic HTTPS Rewrites:** `Activado (ON)`
   - **Minimum TLS Version:** `TLS 1.2`
   - **HTTP/3 (with QUIC):** `Activado (ON)`

4. **Cabeceras de Seguridad y Cache (`public/_headers`):**
   ```http
   /*
     X-Frame-Options: DENY
     X-Content-Type-Options: nosniff
     Referrer-Policy: strict-origin-when-cross-origin
     Permissions-Policy: camera=(), microphone=(), geolocation=()
     Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://pagead2.googlesyndication.com; font-src 'self' data:; connect-src 'self' https://pagead2.googlesyndication.com;

   /assets/*
     Cache-Control: public, max-age=31536000, immutable
   ```

---

## 5. Especificación Técnica: Herramienta 1 (Generador QR)

### Características Funcionales
- **Tipos de contenido:** Enlaces URL, texto plano, redes sociales, credenciales Wi-Fi o datos vCard.
- **Niveles de corrección de error Reed-Solomon:**
  - `L` (Bajo ~7%): Densidad mínima de puntos, ideal para códigos pequeños sin logo.
  - `M` (Medio ~15%): Estándar por defecto.
  - `Q` (Cuartil ~25%): Recomendado para impresión física.
  - `H` (Alto ~30%): **Obligatorio cuando se incrusta un logotipo central** para garantizar legibilidad completa.
- **Personalización estética:**
  - Paleta de color para módulos/puntos y fondo.
  - Formas de puntos: cuadrados, redondeados o circulares.
  - Inserción de imagen/logotipo con cálculo de margen de seguridad.
- **Formatos de exportación:**
  - **PNG:** Para consumo web, mensajes y pantallas digitales.
  - **SVG:** Vectorial sin pérdida de calidad para imprenta, señalética y gran formato.

### Procesamiento 100% Local (Client-Side)
El procesamiento se realiza directamente en un elemento `<canvas>` o nodo `<svg>` in-memory mediante JavaScript. La imagen del logotipo se lee mediante `FileReader.readAsDataURL()` en memoria local del navegador, **sin enviar jamás bytes a la red**.

---

## 6. Estrategia de Monetización y Aprobación en Google AdSense

### Superar la Barrera de "Contenido de Poco Valor" (*Thin Content*)
Google rechaza sitios de utilidades que solo muestran campos de entrada y botones. Para garantizar la aprobación:
- **Estructura Híbrida "Herramienta + Manual Técnico":** Cada página de herramienta se complementa con entre **1,000 y 1,500 palabras de contenido educativo original** en formato Markdown.
- **Temas a documentar en cada herramienta:**
  1. Fundamentos teóricos del algoritmo (ej. corrección Reed-Solomon en códigos QR).
  2. Guías paso a paso de uso profesional.
  3. Comparativa técnica de formatos y parámetros.
  4. Manifiesto de privacidad: por qué el procesamiento local en el cliente es más seguro que los generadores basados en servidor.
  5. Acordeón de preguntas frecuentes técnicas (FAQ).

### Arquitectura de Anuncios con Cero CLS (*Cumulative Layout Shift*)
Para proteger la experiencia de usuario y las métricas Core Web Vitals:
1. **Dimensiones reservadas:** Cada ranura publicitaria contiene un contenedor contenedor rígido con dimensiones mínimas fijas (`min-h-[250px]` para bloques rectangulares o `min-h-[90px]` para banners horizontales).
2. **Skeletons neutros:** Mientras el anuncio de AdSense carga, se muestra un marco sutil con la leyenda reglamentaria `"PUBLICIDAD"`.
3. **Distribución de bloques:**
   - **Slot 1 (Medio de página):** Inmediatamente después de la herramienta interactiva y antes de la guía técnica.
   - **Slot 2 (Final de contenido):** Al pie de la guía editorial, antes del directorio de herramientas relacionadas.

### Páginas Institucionales Obligatorias
- **`/privacy`:** Declaración de privacidad que especifica que Silantro Tools procesa la información en el navegador del usuario y documenta las cookies de Google AdSense y analítica.
- **`/terms`:** Condiciones de uso del servicio y descargo de responsabilidad.
- **`/cookies`:** Política detallada de almacenamiento y cookies de terceros.
- **`/contact`:** Datos de contacto de Silantro Labs y formulario de soporte.
- **`/about`:** Perfil corporativo de Silantro Labs, misión y enfoque de herramientas gratuitas.

---

## 7. SEO Técnico y Escalabilidad de Catálogo

### Metadatos y Datos Estructurados (Schema.org)

Cada herramienta implementa de forma automática dos esquemas JSON-LD mediante el componente `SEOHead.astro`:

1. **`WebApplication` / `SoftwareApplication`:**
   ```json
   {
     "@context": "https://schema.org",
     "@type": "WebApplication",
     "name": "Generador de Códigos QR Gratis y Privado",
     "applicationCategory": "UtilitiesApplication",
     "operatingSystem": "All",
     "offers": {
       "@type": "Offer",
       "price": "0",
       "priceCurrency": "USD"
     },
     "publisher": {
       "@type": "Organization",
       "name": "Silantro Labs",
       "url": "https://silantrolabs.com"
     }
   }
   ```
2. **`FAQPage`:** Extrae las preguntas y respuestas del archivo Markdown de la herramienta para habilitar fragmentos enriquecidos (*rich snippets*) con acordeones directamente en los resultados de búsqueda de Google.

### Sitemap Dinámico y Robots.txt
- Con la integración `@astrojs/sitemap`, cada nueva herramienta añadida a `src/content/tools/` genera automáticamente su entrada en `sitemap-index.xml` durante el build.
- `public/robots.txt` expone el sitemap a Googlebot y Bingbot de forma limpia.

### Evolución del Catálogo: Enfoque en Utilidad Masiva y Cotidiana
Tras la consolidación del Generador QR, el catálogo evoluciona de herramientas exclusivamente para desarrolladores hacia micro-utilidades esenciales para cualquier usuario (estudiantes, oficinas, profesionales y uso personal), manteniendo la arquitectura 100% Client-Side:

1. **`qr-generator` (Activo):** Generador de códigos QR vectoriales con inserción de marca.
2. **`image-compressor` (Próximamente):** Compresor y redimensionador local de fotos/documentos escaneados para trámites y web sin subir archivos a la nube.
3. **`text-cleaner` (Próximamente):** Reparador de textos copiados de PDFs (elimina saltos de línea rotos, dobles espacios y cuenta palabras).
4. **`password-generator` (Próximamente):** Generador de claves robustas y frases de paso memorables con entropía nativa.
5. **`diff-checker` (Próximamente):** Comparador visual privado de versiones de texto y contratos.

---

## 8. Hoja de Ruta de Implementación (Roadmap)

```text
[Fase 1: Setup Core] ──► [Fase 2: Motor QR] ──► [Fase 3: Contenido SEO] 
         │
         ▼
[Fase 4: Despliegue & DNS] ──► [Fase 5: Search Console] ──► [Fase 6: AdSense]
```

### Fase 1: Inicialización del Repositorio y Arquitectura Base
* Inicializar proyecto Astro en modo SSG con soporte estricto de TypeScript.
* Integrar `@astrojs/tailwind`, `@astrojs/preact` y `@astrojs/sitemap`.
* Configurar layouts base (`BaseLayout.astro`, `ToolLayout.astro`, `LegalLayout.astro`).
* Configurar tema oscuro/claro y componentes UI comunes.

### Fase 2: Desarrollo del Motor QR
* Instalar e integrar `qr-code-styling` con carga asíncrona lazy-loaded.
* Construir los componentes Preact:
  - Formulario reactivo con control de colores, tipos de puntos y nivel de corrección.
  - Carga local de logotipo con auto-ajuste a nivel de corrección `H`.
  - Exportador a PNG y SVG con nombres de archivo temporizados.

### Fase 3: Contenido Editorial SEO y Páginas Legales
* Redactar la guía técnica completa en `src/content/tools/qr-generator.md`.
* Redactar y maquetar `/privacy`, `/terms`, `/cookies`, `/contact` y `/about`.
* Diseñar la página principal (`/index.astro`) con buscador de herramientas por etiquetas.

### Fase 4: Despliegue en Cloudflare Pages y DNS
* Crear repositorio en GitHub y sincronizarlo con Cloudflare Pages.
* Configurar el subdominio `tools.silantrolabs.com` con CNAME y SSL Full Strict.
* Añadir `_headers` para seguridad y directivas de caché estática.

### Fase 5: Indexación y Auditoría Core Web Vitals
* Registrar el subdominio en **Google Search Console** y enviar `sitemap-index.xml`.
* Ejecutar auditoría en **Google PageSpeed Insights** para certificar 100/100 en Performance, SEO, Accesibilidad y Buenas Prácticas.

### Fase 6: Solicitud de Google AdSense
* Tras 10-14 días con tráfico e indexación inicial en Search Console, enviar la solicitud de revisión a Google AdSense.
* Activar los componentes `AdSlot.astro` con los IDs de anuncio definitivos.
