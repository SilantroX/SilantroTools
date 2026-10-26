// src/components/catalog/ToolCatalog.tsx
import { useState, useMemo, useEffect, useRef } from 'preact/hooks';

export interface ToolItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  categorySlug: 'generadores' | 'imagenes' | 'texto' | 'seguridad' | 'documentos';
  inputOutput: string;
  engine: string;
  status: 'ready' | 'coming-soon';
  statusLabel: string;
  description: string;
  featured?: boolean;
}

const ALL_TOOLS: ToolItem[] = [
  {
    id: '01',
    title: 'Generador de Códigos QR',
    slug: 'qr-generator',
    category: 'Generadores',
    categorySlug: 'generadores',
    inputOutput: 'Texto, URLs, Wi-Fi, vCard → PNG / SVG',
    engine: 'Reed-Solomon (Client Canvas/SVG)',
    status: 'ready',
    statusLabel: 'Disponible',
    description: 'Generación vectorial y rasterizada de códigos QR con estándar ISO/IEC 18004. Permite incrustar logotipo de marca, estilos geométricos monocromáticos y descarga inmediata sin compresión.',
    featured: true,
  },
  {
    id: '02',
    title: 'Compresor y Optimizador de Fotos',
    slug: 'image-compressor',
    category: 'Imágenes',
    categorySlug: 'imagenes',
    inputOutput: 'JPG, PNG, WebP pesados → Imagen ligera optimizada',
    engine: 'Canvas 2D & WebAssembly Local',
    status: 'coming-soon',
    statusLabel: 'Próximamente',
    description: 'Reduce el peso de imágenes y documentos escaneados para trámites, correos o formularios que exigen archivos de poco peso. 100% privado en tu equipo: ninguna foto se sube a internet.',
  },
  {
    id: '03',
    title: 'Limpiador de Texto y Reparador de PDFs',
    slug: 'text-cleaner',
    category: 'Texto',
    categorySlug: 'texto',
    inputOutput: 'Texto desordenado de PDF → Párrafos limpios y fluidos',
    engine: 'Regex & Motor Léxico en Memoria',
    status: 'coming-soon',
    statusLabel: 'Próximamente',
    description: 'Elimina saltos de línea rotos al copiar de archivos PDF, suprime dobles espacios molestos, normaliza mayúsculas/minúsculas y cuenta palabras y caracteres al instante.',
  },
  {
    id: '04',
    title: 'Generador de Contraseñas y Frases Seguras',
    slug: 'password-generator',
    category: 'Seguridad',
    categorySlug: 'seguridad',
    inputOutput: 'Configuración simple → Contraseña o frase memorable',
    engine: 'Web Crypto API Nativa',
    status: 'coming-soon',
    statusLabel: 'Próximamente',
    description: 'Crea contraseñas robustas o combinaciones de palabras fáciles de recordar y teclear en móviles o televisores. Generación de alta entropía sin salir de tu navegador.',
  },
  {
    id: '05',
    title: 'Comparador Privado de Documentos y Textos',
    slug: 'diff-checker',
    category: 'Documentos',
    categorySlug: 'documentos',
    inputOutput: 'Texto original vs. Modificado → Diferencias visuales',
    engine: 'Algoritmo Myers Diff Local',
    status: 'coming-soon',
    statusLabel: 'Próximamente',
    description: 'Compara dos versiones de un contrato, redacción, cotización o correo para identificar con precisión qué palabras o cláusulas fueron añadidas, editadas o eliminadas.',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'Todas las herramientas' },
  { id: 'generadores', label: 'Generadores' },
  { id: 'imagenes', label: 'Imágenes' },
  { id: 'texto', label: 'Texto' },
  { id: 'seguridad', label: 'Seguridad' },
  { id: 'documentos', label: 'Documentos' },
] as const;

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
        const inIO = tool.inputOutput.toLowerCase().includes(q);
        return inTitle || inDesc || inCategory || inIO;
      }
      return true;
    });
  }, [searchQuery, selectedCategory, onlyAvailable]);

  return (
    <section aria-labelledby="catalog-title" class="space-y-5 sm:space-y-6">
      {/* Barra de Filtros y Búsqueda */}
      <div class="space-y-3">
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Campo de Búsqueda Visible */}
          <div class="relative flex-1 max-w-md">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 dark:text-neutral-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onInput={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
              placeholder="Buscar por nombre o función... (Pulsa '/')"
              class="w-full pl-9 pr-8 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-xs placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all"
              aria-label="Buscar herramientas"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                aria-label="Limpiar búsqueda"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Toggle Solo Disponibles */}
          <label class="flex items-center gap-2 text-xs font-mono text-neutral-600 dark:text-neutral-400 cursor-pointer select-none self-end sm:self-auto py-0.5">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable((e.target as HTMLInputElement).checked)}
              class="w-3.5 h-3.5 rounded border-neutral-300 dark:border-neutral-700 accent-neutral-900 dark:accent-neutral-100 cursor-pointer"
            />
            <span>Solo disponibles</span>
          </label>
        </div>

        {/* Pestañas de Categoría */}
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none" role="tablist" aria-label="Categorías de herramientas">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedCategory(cat.id)}
                class={`flex-shrink-0 px-2.5 py-1 rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white ${
                  isSelected
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-950 dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contador de resultados */}
      <div class="flex items-center justify-between text-xs font-mono text-neutral-500 border-b border-neutral-200 dark:border-neutral-800 pb-1.5">
        <span id="catalog-title" class="uppercase tracking-wider">
          {selectedCategory === 'all' ? 'Catálogo General' : `Categoría: ${selectedCategory}`}
        </span>
        <span>
          {filteredTools.length} {filteredTools.length === 1 ? 'herramienta' : 'herramientas'}
        </span>
      </div>

      {/* Lista de Herramientas Optimizada en Densidad */}
      {filteredTools.length > 0 ? (
        <div class="divide-y divide-neutral-200 dark:divide-neutral-800 border-b border-neutral-200 dark:border-neutral-800">
          {filteredTools.map((tool) => {
            const isReady = tool.status === 'ready';

            return (
              <article
                key={tool.id}
                class={`py-4 px-2 sm:px-3 -mx-2 sm:-mx-3 rounded-lg transition-colors ${
                  isReady
                    ? 'hover:bg-neutral-100/60 dark:hover:bg-neutral-900/40'
                    : 'opacity-75'
                }`}
              >
                <div class="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start">
                  {/* Índice y Categoría */}
                  <div class="md:col-span-2 font-mono text-xs flex md:flex-col justify-between md:justify-start gap-1 text-neutral-500">
                    <span class="font-semibold text-neutral-900 dark:text-neutral-100">{tool.id}</span>
                    <span class="text-neutral-500 dark:text-neutral-400">{tool.category}</span>
                  </div>

                  {/* Título, Descripción y E/S */}
                  <div class="md:col-span-7 space-y-1.5">
                    <div class="flex items-center gap-2 flex-wrap">
                      <h3 class="text-sm sm:text-base font-semibold text-neutral-950 dark:text-white">
                        {isReady ? (
                          <a
                            href={`/tools/${tool.slug}/`}
                            class="hover:underline underline-offset-4 decoration-neutral-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white rounded"
                          >
                            {tool.title}
                          </a>
                        ) : (
                          <span>{tool.title}</span>
                        )}
                      </h3>
                      {tool.featured && (
                        <span class="font-mono text-[9px] tracking-wider uppercase px-1.5 py-0.2 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold">
                          Recomendada
                        </span>
                      )}
                    </div>

                    <p class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl">
                      {tool.description}
                    </p>

                    <div class="flex flex-wrap items-center gap-2.5 font-mono text-[11px] text-neutral-500 pt-0.5">
                      <div>
                        <span class="text-neutral-400 dark:text-neutral-500">E/S: </span>
                        <span class="text-neutral-700 dark:text-neutral-300">{tool.inputOutput}</span>
                      </div>
                      <span class="hidden sm:inline text-neutral-300 dark:text-neutral-700" aria-hidden="true">•</span>
                      <div class="hidden sm:block">
                        <span class="text-neutral-400 dark:text-neutral-500">Motor: </span>
                        <span class="text-neutral-700 dark:text-neutral-300">{tool.engine}</span>
                      </div>
                    </div>
                  </div>

                  {/* Acción y Estado */}
                  <div class="md:col-span-3 flex md:justify-end items-center pt-1 md:pt-0">
                    {isReady ? (
                      <a
                        href={`/tools/${tool.slug}/`}
                        class="btn-primary w-full md:w-auto text-xs py-1.5 px-3"
                        aria-label={`Abrir herramienta ${tool.title}`}
                      >
                        <span>Abrir</span>
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </a>
                    ) : (
                      <span class="font-mono text-[10px] text-neutral-400 dark:text-neutral-500 border border-neutral-200 dark:border-neutral-800 px-2.5 py-1 rounded-md bg-neutral-50/50 dark:bg-neutral-900/30">
                        {tool.statusLabel}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Estado Vacío Útil */
        <div class="p-8 sm:p-10 text-center border border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50/50 dark:bg-neutral-900/20 space-y-2.5">
          <div class="w-9 h-9 mx-auto rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <h3 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            No se encontraron herramientas
          </h3>
          <p class="text-xs text-neutral-500 max-w-sm mx-auto">
            No hay módulos que coincidan con "{searchQuery}" en la categoría seleccionada.
          </p>
          <div class="pt-1">
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setOnlyAvailable(false);
              }}
              class="btn-secondary text-xs py-1 px-3"
            >
              Restablecer filtros
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
