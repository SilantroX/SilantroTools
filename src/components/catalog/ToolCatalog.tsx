// src/components/catalog/ToolCatalog.tsx
import { useState, useMemo, useEffect, useRef } from 'preact/hooks';

export interface ToolItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  categorySlug: 'generadores' | 'imagenes' | 'texto' | 'seguridad' | 'documentos';
  status: 'ready' | 'coming-soon';
  statusLabel: string;
  description: string;
  useCase: string;
  badge?: string;
  iconType: 'qr' | 'compress' | 'text' | 'password' | 'diff';
}

const ALL_TOOLS: ToolItem[] = [
  {
    id: '01',
    title: 'Generador de códigos QR',
    slug: 'qr-generator',
    category: 'Códigos QR',
    categorySlug: 'generadores',
    status: 'ready',
    statusLabel: 'Disponible',
    description: 'Crea códigos QR personalizados para enlaces web, redes sociales, textos o tu red Wi-Fi en segundos.',
    useCase: 'Ideal para imprimir en folletos, cartas de restaurante, empaques o compartir enlaces al instante.',
    badge: 'Popular',
    iconType: 'qr',
  },
  {
    id: '02',
    title: 'Compresor de fotos e imágenes',
    slug: 'image-compressor',
    category: 'Imágenes',
    categorySlug: 'imagenes',
    status: 'ready',
    statusLabel: 'Disponible',
    description: 'Reduce el peso de tus fotos en JPG, PNG o WebP manteniendo una calidad visual óptima.',
    useCase: 'Perfecto para trámites oficiales, postulaciones de empleo o correos que exigen un límite estricto de tamaño.',
    badge: 'Nuevo',
    iconType: 'compress',
  },
  {
    id: '03',
    title: 'Limpiador de texto',
    slug: 'text-cleaner',
    category: 'Texto',
    categorySlug: 'texto',
    status: 'coming-soon',
    statusLabel: 'Próximamente',
    description: 'Arregla textos desordenados al copiar y pegar desde archivos PDF o páginas web.',
    useCase: 'Elimina saltos de línea rotos, suprime espacios dobles y ordena mayúsculas y minúsculas con un clic.',
    iconType: 'text',
  },
  {
    id: '04',
    title: 'Generador de contraseñas',
    slug: 'password-generator',
    category: 'Seguridad',
    categorySlug: 'seguridad',
    status: 'coming-soon',
    statusLabel: 'Próximamente',
    description: 'Genera contraseñas fuertes o combinaciones de palabras fáciles de recordar para tus cuentas.',
    useCase: 'Protege tus servicios con claves seguras y privadas creadas en tu navegador sin almacenar datos.',
    iconType: 'password',
  },
  {
    id: '05',
    title: 'Comparador de textos',
    slug: 'diff-checker',
    category: 'Documentos',
    categorySlug: 'documentos',
    status: 'coming-soon',
    statusLabel: 'Próximamente',
    description: 'Encuentra las diferencias exactas entre dos versiones de un escrito, contrato o correo.',
    useCase: 'Identifica de inmediato qué palabras o cláusulas fueron añadidas, editadas o eliminadas sin revisar a mano.',
    iconType: 'diff',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'Todas las herramientas' },
  { id: 'imagenes', label: 'Imágenes' },
  { id: 'generadores', label: 'Códigos QR' },
  { id: 'texto', label: 'Texto' },
  { id: 'seguridad', label: 'Seguridad' },
  { id: 'documentos', label: 'Documentos' },
] as const;

function ToolIcon({ type }: { type: ToolItem['iconType'] }) {
  switch (type) {
    case 'qr':
      return (
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="6" y="6" width="1" height="1" fill="currentColor" stroke="none" />
          <rect x="17" y="6" width="1" height="1" fill="currentColor" stroke="none" />
          <rect x="6" y="17" width="1" height="1" fill="currentColor" stroke="none" />
          <path stroke-linecap="round" d="M14 14h3v3m-3 4h7v-3m0-4v-1" />
        </svg>
      );
    case 'compress':
      return (
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2.5" />
          <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 15l-5-5L5 21" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M14 14l3-3m0 0l-3-3m3 3h-5" stroke-width="1.5" />
        </svg>
      );
    case 'text':
      return (
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M16 16.5l2 2 4-4" />
        </svg>
      );
    case 'password':
      return (
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 11V7a4 4 0 118 0v4" />
          <circle cx="12" cy="16" r="1" fill="currentColor" />
        </svg>
      );
    case 'diff':
      return (
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 3v5a1 1 0 001 1h5" />
        </svg>
      );
  }
}

export default function ToolCatalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Atajo de teclado: presionar '/' para enfocar el buscador
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter((tool) => {
      if (selectedCategory !== 'all' && tool.categorySlug !== selectedCategory) {
        return false;
      }
      if (onlyAvailable && tool.status !== 'ready') {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = tool.title.toLowerCase().includes(q);
        const inDesc = tool.description.toLowerCase().includes(q);
        const inCategory = tool.category.toLowerCase().includes(q);
        const inUseCase = tool.useCase.toLowerCase().includes(q);
        return inTitle || inDesc || inCategory || inUseCase;
      }
      return true;
    });
  }, [searchQuery, selectedCategory, onlyAvailable]);

  return (
    <section id="catalogo" aria-labelledby="catalog-title" class="space-y-6 sm:space-y-8 scroll-mt-20">
      {/* Encabezado del catálogo */}
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <span class="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold mb-1">
            <span class="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100" aria-hidden="true"></span>
            Catálogo de Herramientas
          </span>
          <h2 id="catalog-title" class="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-neutral-950 dark:text-white">
            Encuentra la herramienta que necesitas
          </h2>
          <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1 max-w-xl leading-relaxed">
            Herramientas pensadas para resolver tareas comunes al instante. Elige una opción para empezar.
          </p>
        </div>

        {/* Contador simple */}
        <div class="font-mono text-xs text-neutral-500 dark:text-neutral-400 self-start md:self-end">
          <span>{filteredTools.length} {filteredTools.length === 1 ? 'herramienta' : 'herramientas'}</span>
          {onlyAvailable && <span> (solo disponibles)</span>}
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div class="space-y-3.5">
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Campo de Búsqueda Visible */}
          <div class="relative flex-1 max-w-lg">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400 dark:text-neutral-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onInput={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
              placeholder="Buscar herramienta... (ej. fotos, QR, contraseñas)"
              class="w-full pl-10 pr-9 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all shadow-2xs"
              aria-label="Buscar herramienta"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                aria-label="Limpiar búsqueda"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Toggle Solo Disponibles */}
          <label class="inline-flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer select-none py-1 px-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors self-start sm:self-auto">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable((e.target as HTMLInputElement).checked)}
              class="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 accent-neutral-900 dark:accent-neutral-100 cursor-pointer"
            />
            <span class="font-medium">Solo herramientas disponibles</span>
          </label>
        </div>

        {/* Pestañas de Categoría */}
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1.5 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none" role="tablist" aria-label="Categorías de herramientas">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedCategory(cat.id)}
                class={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-semibold shadow-2xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-950 dark:hover:text-white border border-transparent'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid de Tarjetas de Herramientas */}
      {filteredTools.length > 0 ? (
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
          {filteredTools.map((tool) => {
            const isReady = tool.status === 'ready';

            return (
              <article
                key={tool.id}
                class={`relative flex flex-col justify-between p-5 sm:p-6 rounded-xl border transition-all duration-200 ${
                  isReady
                    ? 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 shadow-2xs hover:shadow-xs'
                    : 'bg-neutral-50/50 dark:bg-neutral-900/30 border-neutral-200/80 dark:border-neutral-800/80'
                }`}
              >
                {/* Parte Superior: Encabezado de la tarjeta */}
                <div>
                  <div class="flex items-start justify-between gap-3 mb-3.5">
                    {/* Icono + Categoría */}
                    <div class="flex items-center gap-3">
                      <div
                        class={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border ${
                          isReady
                            ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white border-neutral-200 dark:border-neutral-700'
                            : 'bg-neutral-100/60 dark:bg-neutral-800/50 text-neutral-400 dark:text-neutral-500 border-neutral-200/60 dark:border-neutral-800'
                        }`}
                        aria-hidden="true"
                      >
                        <ToolIcon type={tool.iconType} />
                      </div>
                      <div>
                        <span class="text-[11px] font-mono font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                          {tool.category}
                        </span>
                      </div>
                    </div>

                    {/* Estado y Badges */}
                    <div class="flex items-center gap-1.5 flex-wrap justify-end">
                      {tool.badge && isReady && (
                        <span class="font-mono text-[9px] tracking-wider uppercase px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold">
                          {tool.badge}
                        </span>
                      )}
                      {isReady ? (
                        <span class="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
                          <span class="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-white animate-pulse" aria-hidden="true"></span>
                          <span>Disponible</span>
                        </span>
                      ) : (
                        <span class="font-mono text-[10px] uppercase font-medium tracking-wider px-2 py-0.5 rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-500 bg-neutral-100/50 dark:bg-neutral-900/50">
                          Próximamente
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Nombre de la herramienta */}
                  <h3 class="text-base sm:text-lg font-bold text-neutral-950 dark:text-white">
                    {isReady ? (
                      <a
                        href={`/tools/${tool.slug}/`}
                        class="hover:underline underline-offset-4 decoration-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white rounded inline-block"
                      >
                        {tool.title}
                      </a>
                    ) : (
                      <span>{tool.title}</span>
                    )}
                  </h3>

                  {/* Breve descripción de su utilidad */}
                  <p class="mt-1.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {tool.description}
                  </p>

                  {/* Problema que resuelve / Útil para */}
                  <div class="mt-3.5 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-50/80 dark:bg-neutral-900/50 p-2.5 rounded-md">
                    <span class="font-semibold text-neutral-900 dark:text-neutral-200 flex-shrink-0">
                      Útil para:
                    </span>
                    <span class="leading-normal">{tool.useCase}</span>
                  </div>
                </div>

                {/* Parte Inferior: Acción */}
                <div class="mt-5 pt-1">
                  {isReady ? (
                    <a
                      href={`/tools/${tool.slug}/`}
                      class="btn-primary w-full py-2.5 px-4 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 group transition-all"
                      aria-label={`Abrir herramienta ${tool.title}`}
                    >
                      <span>Abrir herramienta</span>
                      <svg
                        class="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </a>
                  ) : (
                    <div
                      class="w-full py-2.5 px-3 text-center text-xs font-medium text-neutral-400 dark:text-neutral-500 bg-neutral-100/50 dark:bg-neutral-800/30 rounded-lg border border-neutral-200/60 dark:border-neutral-800/60 select-none cursor-not-allowed"
                      aria-disabled="true"
                    >
                      En desarrollo • Próximamente
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Estado Vacío Sencillo y Útil */
        <div class="p-8 sm:p-12 text-center border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/20 space-y-3">
          <div class="w-10 h-10 mx-auto rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <h3 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            No se encontraron herramientas
          </h3>
          <p class="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
            No hay herramientas que coincidan con tu búsqueda en esta categoría.
          </p>
          <div class="pt-2">
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setOnlyAvailable(false);
              }}
              class="btn-secondary text-xs py-1.5 px-3.5 rounded-lg cursor-pointer"
            >
              Mostrar todas las herramientas
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
