# Silantro Tools

> **Suite de micro-herramientas de cómputo local y código abierto.**  
> Producción: [tools.silantrolabs.com](https://tools.silantrolabs.com)  
> Organización: [Silantro Labs](https://silantrolabs.com)  
> Licencia: MIT (Open Source & 100% Transparente)  

---

## Manifiesto de Transparencia y Privacidad

Silantro Tools surge como una respuesta técnica a la intermediación innecesaria en la web. La gran mayoría de las utilidades digitales comunes (generadores de códigos QR, formateadores, conversores de formatos o generadores criptográficos) transmiten la información del usuario a través de servidores remotos donde los datos pueden quedar registrados en logs de acceso no auditados o bases de datos centralizadas.

**Principios fundamentales del proyecto:**

1. **Zero Server Egress (0 bytes transmitidos):** Toda la lógica de transformación, análisis sintáctico y renderizado gráfico se ejecuta de forma exclusiva en la memoria volátil de tu navegador web. Ningún texto, URL, credencial Wi-Fi o archivo sale de tu equipo.
2. **Cero Telemetría de Contenido:** No existen rastreadores de datos personales, analíticas invasivas ni almacenamiento persistente en backend.
3. **Costo de Infraestructura $0 Perpetuo:** La plataforma se compila como un sitio estático puro (SSG) distribuido globalmente mediante la red Anycast de Cloudflare Pages.
4. **Arquitectura Modular Abierta:** Diseñado desde el día 1 para escalar a decenas de herramientas desacopladas donde cada módulo carga sus librerías de forma aislada (*lazy loading*) sin afectar el rendimiento global.

---

## Catálogo de Herramientas

| ID | Herramienta | Dominio | Algoritmo / Motor | Formatos de Salida | Estado |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **01** | **Generador de QR by Silantro Labs** | Codificación Óptica | Reed-Solomon en $GF(2^8)$ | SVG (Vector), PNG (Raster) | **Disponible** |
| **02** | **Formateador e Inspector JSON** | Manipulación de Datos | V8 JSON Parser Nativo | Árbol estructurado | *En desarrollo* |
| **03** | **Conversor y Extractor Base64** | Transformación Binaria | FileReader & TypedArray API | Base64 URI / Archivo | *En desarrollo* |
| **04** | **Generador Criptográfico de Claves** | Criptografía | Web Crypto API | Cadena aleatoria segura | *En desarrollo* |
| **05** | **Analizador Semántico de Texto** | Procesamiento de Lenguaje | Intl.Segmenter Engine | Métricas de lectura | *En desarrollo* |

---

## Especificaciones del Generador de Códigos QR

El módulo inicial implementa el estándar internacional **ISO/IEC 18004**:

- **Tipos de Carga Útil:** Direcciones URL, texto libre, configuración de red Wi-Fi (`WIFI:S:...`), correos electrónicos preformateados (`mailto:`) y tarjetas de contacto (`vCard 3.0`).
- **Niveles de Corrección de Error Reed-Solomon:**
  - `L` (~7% de redundancia): Densidad mínima para códigos diminutos.
  - `M` (~15% de redundancia): Estándar por defecto.
  - `Q` (~25% de redundancia): Uso industrial y señalética de exterior.
  - `H` (~30% de redundancia): **Mandatorio al incrustar logotipos** (como la insignia de Silantro Labs o marcas propias) para compensar la oclusión central sin degradar la tasa de lectura.
- **Exportación de Alta Precisión:**
  - **Vectorial (SVG):** Ecuaciones geométricas XML escalables a cualquier escala (corte láser, imprenta masiva, vallas publicitarias) con nitidez absoluta.
  - **Rasterizado (PNG):** Resoluciones seleccionables de 512px, 1024px y 2048px.
  - **Copia Rápida:** Transferencia directa al portapapeles mediante la API nativa `ClipboardItem`.

---

## Stack Tecnológico

- **Framework:** [Astro](https://astro.build/) en modo estático puro (SSG) con arquitectura de islas (*Islands Architecture*).
- **Runtime Interactivo:** [Preact](https://preactjs.com/) (~3.5 KB) para garantizar interactividad instantánea con un impacto mínimo en el hilo principal del navegador.
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/) compilado como plugin de Vite con diseño editorial monocromático y soporte nativo bimodal (Modo Claro / Modo Oscuro).
- **Tipado:** TypeScript en modo estricto.
- **Alojamiento:** Cloudflare Pages (distribución Anycast edge, HTTP/3, compresión Brotli y certificados SSL/TLS automáticos).
- **SEO & Metadatos:** Generación dinámica de `sitemap-index.xml`, `robots.txt`, Open Graph y datos estructurados Schema.org (`WebApplication` y `FAQPage`).

---

## Estructura del Repositorio

```text
SilantroTools/
├── public/
│   ├── _headers             # Cabeceras de seguridad CSP y caché inmutable
│   ├── favicon.svg          # Favicon vectorial geométrico
│   ├── robots.txt           # Directivas de rastreo para motores de búsqueda
│   └── logos/               # Logotipos e insignias de marca optimizados
├── src/
│   ├── components/
│   │   ├── ads/             # Contenedores publicitarios con dimensiones fijas (CLS = 0)
│   │   ├── common/          # Header, Footer, Navegación, ThemeToggle
│   │   └── seo/             # Inyección de metadatos, Open Graph y JSON-LD
│   ├── content/
│   │   └── tools/           # Artículos y documentación técnica de cada herramienta
│   ├── layouts/
│   │   ├── BaseLayout.astro # Estructura HTML base y prevención de FOUC
│   │   ├── ToolLayout.astro # Plantilla de dos columnas (Herramienta + Guía editorial)
│   │   └── LegalLayout.astro# Plantilla para páginas institucionales y legales
│   ├── pages/
│   │   ├── index.astro      # Catálogo y directorio general
│   │   ├── about.astro      # Manifiesto y principios de Silantro Labs
│   │   ├── privacy.astro    # Declaración de procesamiento local y cookies
│   │   ├── terms.astro      # Términos de uso y descargo de responsabilidad
│   │   ├── cookies.astro    # Detalle de almacenamiento local y cookies técnicas
│   │   ├── contact.astro    # Canales de soporte y reporte de incidencias
│   │   └── tools/
│   │       └── [slug].astro # Enrutamiento estático dinámico
│   ├── tools/
│   │   └── qr-generator/    # Motor cliente del Generador de Códigos QR
│   └── styles/
│       └── global.css       # Directivas Tailwind y tokens monocromáticos
├── astro.config.mjs         # Configuración de integraciones de Astro
├── tsconfig.json            # Configuración de compilador TypeScript estricto
└── package.json             # Dependencias del proyecto
```

---

## Instalación y Desarrollo Local

### Requisitos Previos
- [Node.js](https://nodejs.org/) v18.17.1 o superior (recomendado v20.x o v22.x).
- [Git](https://git-scm.com/) instalado en el sistema.

### Pasos de Inicialización

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/SilantroX/SilantroTools.git
   cd SilantroTools
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo local:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:4321](http://localhost:4321) en tu navegador para interactuar con la plataforma en tiempo real.

4. **Verificación de tipos y linting:**
   ```bash
   npm run check
   ```

5. **Compilar para producción (SSG):**
   ```bash
   npm run build
   ```
   Los archivos estáticos listos para producción se generarán en el directorio `dist/`.

6. **Previsualizar la compilación de producción:**
   ```bash
   npm run preview
   ```

---

## Auditoría de Privacidad y Verificación

Cualquier desarrollador o usuario puede verificar el comportamiento de procesamiento local de Silantro Tools:

1. Abre las herramientas de desarrollador de tu navegador (`F12`).
2. Dirígete a la pestaña **Network** (Red) y filtra por peticiones `Fetch/XHR`.
3. Introduce información sensible (textos, credenciales Wi-Fi o contactos) en el Generador QR y modifica sus parámetros.
4. **Resultado comprobable:** Cero peticiones de red salientes con los datos procesados. El renderizado opera íntegramente en el lienzo local (`<canvas>` / `<svg>`).

---

## Licencia

Distribuido bajo la Licencia **MIT**. Consulta el archivo [LICENSE](LICENSE) para obtener los términos completos de uso, modificación y distribución.

---

Desarrollado con rigor técnico por [Silantro Labs](https://silantrolabs.com).
