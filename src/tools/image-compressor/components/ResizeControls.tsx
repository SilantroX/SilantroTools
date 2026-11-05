// src/tools/image-compressor/components/ResizeControls.tsx
import type { CompressionOptions, ImageSourceInfo } from '../types';
import { calculateAspectDimensions } from '../engine/imageDimensions';

interface ResizeControlsProps {
  imageInfo: ImageSourceInfo | null;
  options: CompressionOptions;
  onChange: (updates: Partial<CompressionOptions>) => void;
}

export default function ResizeControls({ imageInfo, options, onChange }: ResizeControlsProps) {
  if (!imageInfo) {
    return (
      <div class="p-6 text-center text-xs text-neutral-400">
        Carga una imagen para ajustar sus dimensiones.
      </div>
    );
  }

  const origW = imageInfo.originalWidth;
  const origH = imageInfo.originalHeight;

  const handleScalePreset = (percent: number) => {
    const factor = percent / 100;
    const newW = Math.max(1, Math.round(origW * factor));
    const newH = Math.max(1, Math.round(origH * factor));
    onChange({
      scalePercent: percent,
      customWidth: newW,
      customHeight: newH,
    });
  };

  const handleWidthChange = (val: number) => {
    if (val <= 0) return;
    if (options.maintainAspectRatio) {
      const { height } = calculateAspectDimensions(origW, origH, val, undefined);
      onChange({ customWidth: val, customHeight: height, scalePercent: 0 });
    } else {
      onChange({ customWidth: val, scalePercent: 0 });
    }
  };

  const handleHeightChange = (val: number) => {
    if (val <= 0) return;
    if (options.maintainAspectRatio) {
      const { width } = calculateAspectDimensions(origW, origH, undefined, val);
      onChange({ customWidth: width, customHeight: val, scalePercent: 0 });
    } else {
      onChange({ customHeight: val, scalePercent: 0 });
    }
  };

  const commonResolutions = [
    { label: 'Full HD (1920×1080)', w: 1920, h: 1080, note: 'Pantallas y presentaciones' },
    { label: 'HD 720p (1280×720)', w: 1280, h: 720, note: 'Correos y mensajes' },
    { label: 'Cuadrada (512×512)', w: 512, h: 512, note: 'Fotos de perfil' },
    { label: 'Portada web (1440×810)', w: 1440, h: 810, note: 'Cabeceras y blogs' },
  ];

  return (
    <div class="space-y-5">
      {/* Medidas Originales */}
      <div class="flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 text-xs">
        <span class="text-neutral-600 dark:text-neutral-400 font-medium">Medidas originales:</span>
        <span class="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
          {origW} × {origH} px
        </span>
      </div>

      {/* Escala porcentual rápida */}
      <div class="space-y-2">
        <label class="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">
          Reducir a porcentaje
        </label>
        <div class="grid grid-cols-4 gap-2">
          {[100, 75, 50, 25].map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => handleScalePreset(pct)}
              class={`py-2 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                options.scalePercent === pct
                  ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold shadow-xs'
                  : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
              }`}
            >
              {pct}%
            </button>
          ))}
        </div>
      </div>

      {/* Entradas manuales de ancho y alto */}
      <div class="space-y-3">
        <label class="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">
          Medidas personalizadas en píxeles
        </label>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <span class="text-xs text-neutral-600 dark:text-neutral-400">Ancho (px)</span>
            <input
              type="number"
              min="1"
              max="16000"
              value={options.customWidth}
              onInput={(e) => handleWidthChange(Number((e.target as HTMLInputElement).value))}
              class="input-field font-mono text-xs"
            />
          </div>

          <div class="space-y-1">
            <span class="text-xs text-neutral-600 dark:text-neutral-400">Alto (px)</span>
            <input
              type="number"
              min="1"
              max="16000"
              value={options.customHeight}
              onInput={(e) => handleHeightChange(Number((e.target as HTMLInputElement).value))}
              class="input-field font-mono text-xs"
            />
          </div>
        </div>

        <label class="flex items-center gap-2.5 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer pt-1 select-none">
          <input
            type="checkbox"
            checked={options.maintainAspectRatio}
            onChange={(e) => onChange({ maintainAspectRatio: (e.target as HTMLInputElement).checked })}
            class="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 accent-neutral-900 dark:accent-white"
          />
          <span>Mantener la proporción original (evita que la foto se deforme)</span>
        </label>
      </div>

      {/* Medidas habituales sugeridas */}
      <div class="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
        <label class="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">
          Medidas habituales recomendadas
        </label>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {commonResolutions.map((res) => (
            <button
              key={res.label}
              type="button"
              onClick={() => {
                if (options.maintainAspectRatio) {
                  const { width, height } = calculateAspectDimensions(origW, origH, res.w, undefined);
                  onChange({ customWidth: width, customHeight: height, scalePercent: 0 });
                } else {
                  onChange({ customWidth: res.w, customHeight: res.h, scalePercent: 0 });
                }
              }}
              class="p-2.5 text-xs text-left rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800/60 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors cursor-pointer"
            >
              <div class="font-semibold text-neutral-900 dark:text-neutral-100">{res.label}</div>
              <div class="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">{res.note}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
