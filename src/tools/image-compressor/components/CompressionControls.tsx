// src/tools/image-compressor/components/CompressionControls.tsx
import type { CompressionOptions, OutputFormat } from '../types';

interface CompressionControlsProps {
  options: CompressionOptions;
  onChange: (updates: Partial<CompressionOptions>) => void;
}

export default function CompressionControls({ options, onChange }: CompressionControlsProps) {
  const formats: Array<{ id: OutputFormat; label: string; desc: string }> = [
    { id: 'image/webp', label: 'WebP', desc: 'Recomendado • Más ligero' },
    { id: 'image/jpeg', label: 'JPEG', desc: 'Universal • Fotos y trámites' },
    { id: 'image/png', label: 'PNG', desc: 'Sin pérdida • Transparencias' },
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
        <label class="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">
          ¿En qué formato quieres guardar tu archivo?
        </label>
        <div class="grid grid-cols-3 gap-2">
          {formats.map((fmt) => {
            const isSelected = options.format === fmt.id;
            return (
              <button
                key={fmt.id}
                type="button"
                onClick={() => onChange({ format: fmt.id })}
                class={`p-2.5 rounded-lg border text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white ${
                  isSelected
                    ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold shadow-xs'
                    : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600'
                }`}
              >
                <div class="text-xs">{fmt.label}</div>
                <div
                  class={`text-[10px] mt-0.5 truncate leading-tight ${
                    isSelected ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-500 dark:text-neutral-400'
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
          <label class="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
            ¿Cómo prefieres optimizarla?
          </label>
          <div class="inline-flex rounded-lg border border-neutral-200 dark:border-neutral-800 p-0.5 bg-neutral-100 dark:bg-neutral-900">
            <button
              type="button"
              onClick={() => onChange({ mode: 'quality' })}
              class={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                options.mode === 'quality'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white font-medium shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Ajustar calidad
            </button>
            <button
              type="button"
              onClick={() => onChange({ mode: 'target-size' })}
              class={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                options.mode === 'target-size'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white font-medium shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Fijar peso máximo
            </button>
          </div>
        </div>

        {options.mode === 'quality' ? (
          <div class="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 space-y-3">
            <div class="flex items-center justify-between text-xs">
              <span class="text-neutral-700 dark:text-neutral-300 font-medium">Nivel de calidad visual</span>
              <span class="font-mono font-semibold text-neutral-950 dark:text-white">
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

            <div class="flex justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
              <span>Menor peso (5%)</span>
              <span class="font-medium text-neutral-800 dark:text-neutral-200">Equilibrio ideal (80%)</span>
              <span>Máxima nitidez (100%)</span>
            </div>

            {options.format === 'image/png' && (
              <p class="text-[11px] text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 p-2.5 rounded-md leading-relaxed">
                ℹ️ El formato PNG mantiene la imagen intacta sin pérdida. Si necesitas reducir mucho más el peso del archivo, te sugerimos elegir WebP o JPEG arriba.
              </p>
            )}
          </div>
        ) : (
          <div class="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 space-y-3">
            <label class="block text-xs font-medium text-neutral-700 dark:text-neutral-300">
              Peso máximo permitido en KB:
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
                class="input-field font-mono text-xs"
                placeholder="500"
              />
              <span class="text-xs font-mono text-neutral-500">KB</span>
            </div>

            {/* Accesos rápidos de peso */}
            <div class="flex flex-wrap gap-1.5 pt-1">
              {quickSizes.map((qs) => (
                <button
                  key={qs.kb}
                  type="button"
                  onClick={() => onChange({ targetSizeKb: qs.kb })}
                  class={`px-2.5 py-1 text-xs font-mono rounded-md border transition-colors cursor-pointer ${
                    options.targetSizeKb === qs.kb
                      ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-medium'
                      : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
                  }`}
                >
                  {qs.label}
                </button>
              ))}
            </div>
            <p class="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Ideal para trámites de visas, pasaportes, formularios del gobierno o correos que exigen un límite estricto de tamaño.
            </p>
          </div>
        )}
      </div>

      {/* Opciones adicionales para documentos */}
      <div class="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
        <label class="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">
          Opciones adicionales para documentos
        </label>
        <div class="space-y-2 pt-1">
          <label class="flex items-center gap-2.5 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={options.grayscale}
              onChange={(e) => onChange({ grayscale: (e.target as HTMLInputElement).checked })}
              class="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 accent-neutral-900 dark:accent-white"
            />
            <span>Convertir a blanco y negro (reduce aún más el peso)</span>
          </label>
          <label class="flex items-center gap-2.5 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={options.highContrast}
              onChange={(e) => onChange({ highContrast: (e.target as HTMLInputElement).checked })}
              class="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 accent-neutral-900 dark:accent-white"
            />
            <span>Aclarar fondo y resaltar texto (recomendado para escaneos y firmas)</span>
          </label>
        </div>
      </div>
    </div>
  );
}
