// src/tools/image-compressor/components/CompressionControls.tsx
import type { CompressionOptions, OutputFormat } from '../types';

interface CompressionControlsProps {
  options: CompressionOptions;
  onChange: (updates: Partial<CompressionOptions>) => void;
}

export default function CompressionControls({ options, onChange }: CompressionControlsProps) {
  const formats: Array<{ id: OutputFormat; label: string; desc: string }> = [
    { id: 'image/webp', label: 'WebP', desc: 'Recomendado • Alta eficiencia' },
    { id: 'image/jpeg', label: 'JPEG', desc: 'Universal • Fotos y trámites' },
    { id: 'image/png', label: 'PNG', desc: 'Sin pérdida • Gráficos con alfa' },
  ];

  const quickSizes = [
    { label: '100 KB', kb: 100 },
    { label: '200 KB', kb: 200 },
    { label: '500 KB', kb: 500 },
    { label: '1 MB', kb: 1024 },
    { label: '2 MB', kb: 2048 },
  ];

  return (
    <div class="space-y-5">
      {/* Selector de Formato de Salida */}
      <div class="space-y-2">
        <label class="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Formato de Salida
        </label>
        <div class="grid grid-cols-3 gap-2">
          {formats.map((fmt) => {
            const isSelected = options.format === fmt.id;
            return (
              <button
                key={fmt.id}
                type="button"
                onClick={() => onChange({ format: fmt.id })}
                class={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold shadow-xs'
                    : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                <div class="text-xs">{fmt.label}</div>
                <div
                  class={`text-[10px] mt-0.5 truncate ${
                    isSelected ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-400 dark:text-neutral-500'
                  }`}
                >
                  {fmt.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modo de Compresión: Calidad vs Tamaño Objetivo */}
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <label class="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Estrategia de Optimización
          </label>
          <div class="inline-flex rounded-md border border-neutral-200 dark:border-neutral-800 p-0.5 bg-neutral-100 dark:bg-neutral-900">
            <button
              type="button"
              onClick={() => onChange({ mode: 'quality' })}
              class={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                options.mode === 'quality'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white font-medium shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Por Calidad
            </button>
            <button
              type="button"
              onClick={() => onChange({ mode: 'target-size' })}
              class={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                options.mode === 'target-size'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white font-medium shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Límite en KB/MB
            </button>
          </div>
        </div>

        {options.mode === 'quality' ? (
          <div class="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 space-y-3">
            <div class="flex items-center justify-between text-xs">
              <span class="text-neutral-600 dark:text-neutral-400">Nivel de Calidad</span>
              <span class="font-mono font-semibold text-neutral-900 dark:text-white">
                {Math.round(options.quality * 100)}%
              </span>
            </div>

            <input
              type="range"
              min="5"
              max="100"
              step="1"
              value={Math.round(options.quality * 100)}
              disabled={options.format === 'image/png'}
              onInput={(e) => {
                const val = Number((e.target as HTMLInputElement).value);
                onChange({ quality: val / 100 });
              }}
              class="w-full accent-neutral-950 dark:accent-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            />

            <div class="flex justify-between text-[10px] text-neutral-400 font-mono">
              <span>5% (Mínimo peso)</span>
              <span>80% (Equilibrio)</span>
              <span>100% (Máxima fidelidad)</span>
            </div>

            {options.format === 'image/png' && (
              <p class="text-[11px] text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 p-2 rounded">
                ℹ️ El formato PNG utiliza compresión sin pérdida; el deslizador de calidad no aplica. Para comprimir fotos se sugiere WebP o JPEG.
              </p>
            )}
          </div>
        ) : (
          <div class="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 space-y-3">
            <label class="block text-xs text-neutral-600 dark:text-neutral-400">
              Tamaño Máximo Deseado (KB)
            </label>
            <div class="flex items-center gap-2">
              <input
                type="number"
                min="10"
                max="50000"
                value={options.targetSizeKb}
                onInput={(e) => {
                  const val = Number((e.target as HTMLInputElement).value);
                  if (val > 0) onChange({ targetSizeKb: val });
                }}
                class="input-field font-mono"
                placeholder="500"
              />
              <span class="text-xs font-mono text-neutral-500">KB</span>
            </div>

            {/* Accesos rápidos */}
            <div class="flex flex-wrap gap-1.5 pt-1">
              {quickSizes.map((qs) => (
                <button
                  key={qs.kb}
                  type="button"
                  onClick={() => onChange({ targetSizeKb: qs.kb })}
                  class={`px-2 py-1 text-[11px] font-mono rounded border transition-colors cursor-pointer ${
                    options.targetSizeKb === qs.kb
                      ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-medium'
                      : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300'
                  }`}
                >
                  {qs.label}
                </button>
              ))}
            </div>
            <p class="text-[11px] text-neutral-500 dark:text-neutral-400">
              Ideal para formularios web, trámites de visado y adjuntos con límite estricto de peso.
            </p>
          </div>
        )}
      </div>

      {/* Filtros para Documentos Escaneados */}
      <div class="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
        <label class="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Modo Documento y Filtros
        </label>
        <div class="space-y-2">
          <label class="flex items-center gap-2.5 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={options.grayscale}
              onChange={(e) => onChange({ grayscale: (e.target as HTMLInputElement).checked })}
              class="rounded border-neutral-300 dark:border-neutral-700 accent-neutral-900 dark:accent-white"
            />
            <span>Convertir a Escala de Grises (reduce aún más el peso)</span>
          </label>
          <label class="flex items-center gap-2.5 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={options.highContrast}
              onChange={(e) => onChange({ highContrast: (e.target as HTMLInputElement).checked })}
              class="rounded border-neutral-300 dark:border-neutral-700 accent-neutral-900 dark:accent-white"
            />
            <span>Realzar contraste de texto (recomendado para escaneos y firmas)</span>
          </label>
        </div>
      </div>
    </div>
  );
}
