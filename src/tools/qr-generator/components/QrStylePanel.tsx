// src/tools/qr-generator/components/QrStylePanel.tsx
import { useMemo } from 'preact/hooks';
import type { QrOptionsState, QrPreset } from '../types';
import type { DotType, CornerSquareType } from 'qr-code-styling';
import { getContrastRatio } from '../engine/colorUtils';

interface Props {
  state: QrOptionsState;
  onChange: (updates: Partial<QrOptionsState>) => void;
}

const MONOCHROME_PRESETS: QrPreset[] = [
  {
    id: 'mono-obsidian',
    name: 'Obsidiana Estándar',
    description: 'Alto contraste clásico',
    dotsColor: '#09090b',
    bgColor: '#ffffff',
    cornersSquareColor: '#09090b',
    cornersDotColor: '#09090b',
    dotsType: 'rounded',
    cornersSquareType: 'extra-rounded',
    cornersDotType: 'dot',
  },
  {
    id: 'mono-graphite',
    name: 'Grafito Suave',
    description: 'Gris neutro de precisión',
    dotsColor: '#27272a',
    bgColor: '#ffffff',
    cornersSquareColor: '#27272a',
    cornersDotColor: '#27272a',
    dotsType: 'dots',
    cornersSquareType: 'dot',
    cornersDotType: 'dot',
  },
  {
    id: 'mono-inverted',
    name: 'Modo Invertido',
    description: 'Fondo oscuro para pantallas',
    dotsColor: '#ffffff',
    bgColor: '#09090b',
    cornersSquareColor: '#ffffff',
    cornersDotColor: '#ffffff',
    dotsType: 'rounded',
    cornersSquareType: 'extra-rounded',
    cornersDotType: 'dot',
  },
  {
    id: 'mono-industrial',
    name: 'Matriz Cuadrada',
    description: 'Estética industrial rígida',
    dotsColor: '#000000',
    bgColor: '#ffffff',
    cornersSquareColor: '#000000',
    cornersDotColor: '#000000',
    dotsType: 'square',
    cornersSquareType: 'square',
    cornersDotType: 'square',
  },
  {
    id: 'mono-classy',
    name: 'Editorial Minimal',
    description: 'Geometría estilizada',
    dotsColor: '#18181b',
    bgColor: '#ffffff',
    cornersSquareColor: '#18181b',
    cornersDotColor: '#18181b',
    dotsType: 'classy',
    cornersSquareType: 'extra-rounded',
    cornersDotType: 'dot',
  },
];

const DOT_OPTIONS: Array<{ id: DotType; label: string; desc: string }> = [
  { id: 'rounded', label: 'Suave', desc: 'Vértices sutiles' },
  { id: 'dots', label: 'Circular', desc: 'Puntos concéntricos' },
  { id: 'extra-rounded', label: 'Curvo', desc: 'Curvatura máxima' },
  { id: 'classy', label: 'Editorial', desc: 'Líneas simétricas' },
  { id: 'square', label: 'Cuadrado', desc: 'Matriz ISO clásica' },
];

const CORNER_OPTIONS: Array<{ id: CornerSquareType; label: string }> = [
  { id: 'extra-rounded', label: 'Redondeado' },
  { id: 'dot', label: 'Circular' },
  { id: 'square', label: 'Rectangular' },
];

const COLOR_SWATCHES = ['#000000', '#09090b', '#27272a', '#52525b', '#71717a', '#a1a1aa', '#e4e4e7', '#ffffff'];

export default function QrStylePanel({ state, onChange }: Props) {
  const contrastRatio = useMemo(() => {
    return getContrastRatio(state.dotsColor, state.bgColor);
  }, [state.dotsColor, state.bgColor]);

  const isLowContrast = contrastRatio < 4.5;

  const applyPreset = (preset: QrPreset) => {
    onChange({
      dotsColor: preset.dotsColor,
      bgColor: preset.bgColor,
      cornersSquareColor: preset.cornersSquareColor,
      cornersDotColor: preset.cornersDotColor,
      dotsType: preset.dotsType,
      cornersSquareType: preset.cornersSquareType,
      cornersDotType: preset.cornersDotType,
    });
  };

  return (
    <div class="space-y-6">
      {/* Presets Monocromáticos */}
      <div>
        <label class="block font-mono text-[11px] uppercase tracking-wider text-neutral-500 mb-2.5">
          Estilos Monocromáticos Preconfigurados
        </label>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {MONOCHROME_PRESETS.map((preset) => {
            const isSelected =
              state.dotsColor === preset.dotsColor &&
              state.bgColor === preset.bgColor &&
              state.dotsType === preset.dotsType;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                class={`p-2.5 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800/60 ring-1 ring-neutral-900 dark:ring-white'
                    : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-600'
                }`}
              >
                <div class="flex items-center gap-1.5 mb-2">
                  <span
                    class="w-3.5 h-3.5 rounded-full border border-neutral-300 dark:border-neutral-700 shadow-2xs"
                    style={{ backgroundColor: preset.dotsColor }}
                    aria-hidden="true"
                  ></span>
                  <span
                    class="w-3.5 h-3.5 rounded-full border border-neutral-300 dark:border-neutral-700 shadow-2xs"
                    style={{ backgroundColor: preset.bgColor }}
                    aria-hidden="true"
                  ></span>
                </div>
                <span class="block text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  {preset.name}
                </span>
                <span class="block text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {preset.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Geometría de Módulos (Puntos) */}
      <div>
        <label class="block font-mono text-[11px] uppercase tracking-wider text-neutral-500 mb-2">
          Patrón de Módulos Centrales
        </label>
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {DOT_OPTIONS.map((opt) => {
            const isSelected = state.dotsType === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange({ dotsType: opt.id })}
                class={`py-2 px-2.5 rounded-lg text-xs text-left border transition-all ${
                  isSelected
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold border-neutral-900 dark:border-white'
                    : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                }`}
              >
                <span class="block">{opt.label}</span>
                <span class={`block text-[10px] ${isSelected ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-400'}`}>
                  {opt.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Geometría de Esquinas (Patrones de Detección) */}
      <div>
        <label class="block font-mono text-[11px] uppercase tracking-wider text-neutral-500 mb-2">
          Vértices de Alineación (Finder Patterns)
        </label>
        <div class="grid grid-cols-3 gap-2">
          {CORNER_OPTIONS.map((opt) => {
            const isSelected = state.cornersSquareType === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange({ cornersSquareType: opt.id })}
                class={`py-2 px-3 rounded-lg text-xs font-medium text-center border transition-all ${
                  isSelected
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold border-neutral-900 dark:border-white'
                    : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Control de Colores y Verificación de Contraste */}
      <div class="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 space-y-4">
        <div class="flex items-center justify-between">
          <label class="block font-mono text-[11px] uppercase tracking-wider text-neutral-500">
            Paleta Monocromática & Contraste Óptico
          </label>
          <div
            class={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono ${
              isLowContrast
                ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-bold border border-neutral-400'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <span>Contraste:</span>
            <span class="font-semibold">{contrastRatio.toFixed(1)}:1</span>
          </div>
        </div>

        {/* Alerta de contraste bajo para cámaras */}
        {isLowContrast && (
          <div class="p-3 rounded border border-neutral-400 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs font-mono">
            <span>⚠ Advertencia de lectura:</span> El contraste entre módulos y fondo es inferior a 4.5:1. Los lectores ópticos y cámaras de smartphones pueden fallar al decodificar el código. Se recomienda aumentar el contraste.
          </div>
        )}

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Color de los módulos */}
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs font-medium text-neutral-700 dark:text-neutral-300">
              <span>Color de Módulos (Puntos)</span>
              <span class="font-mono text-[11px] uppercase text-neutral-500">{state.dotsColor}</span>
            </div>
            <div class="flex items-center gap-2">
              <input
                type="color"
                value={state.dotsColor}
                onChange={(e) => onChange({ dotsColor: (e.target as HTMLInputElement).value })}
                class="w-9 h-9 rounded-md border border-neutral-300 dark:border-neutral-700 cursor-pointer bg-transparent"
                title="Seleccionar color personalizado"
              />
              <div class="flex items-center gap-1">
                {COLOR_SWATCHES.map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => onChange({ dotsColor: hex })}
                    class="w-5 h-5 rounded-full border border-neutral-300 dark:border-neutral-700 hover:scale-110 transition-transform"
                    style={{ backgroundColor: hex }}
                    title={`Seleccionar ${hex}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Color de fondo */}
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs font-medium text-neutral-700 dark:text-neutral-300">
              <span>Color de Fondo</span>
              <span class="font-mono text-[11px] uppercase text-neutral-500">{state.bgColor}</span>
            </div>
            <div class="flex items-center gap-2">
              <input
                type="color"
                value={state.bgColor}
                onChange={(e) => onChange({ bgColor: (e.target as HTMLInputElement).value })}
                class="w-9 h-9 rounded-md border border-neutral-300 dark:border-neutral-700 cursor-pointer bg-transparent"
                title="Seleccionar fondo personalizado"
              />
              <div class="flex items-center gap-1">
                {COLOR_SWATCHES.map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => onChange({ bgColor: hex })}
                    class="w-5 h-5 rounded-full border border-neutral-300 dark:border-neutral-700 hover:scale-110 transition-transform"
                    style={{ backgroundColor: hex }}
                    title={`Seleccionar ${hex}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Margen Perimetral (Quiet Zone) */}
      <div>
        <div class="flex items-center justify-between mb-2">
          <label for="margin-slider" class="font-mono text-[11px] uppercase tracking-wider text-neutral-500">
            Margen de Aislamiento Óptico (Quiet Zone)
          </label>
          <span class="font-mono text-xs text-neutral-700 dark:text-neutral-300 font-semibold">
            {state.margin} px
          </span>
        </div>
        <input
          id="margin-slider"
          type="range"
          min="0"
          max="32"
          step="2"
          value={state.margin}
          onInput={(e) => onChange({ margin: Number((e.target as HTMLInputElement).value) })}
          class="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-neutral-900 dark:accent-neutral-100"
        />
        <p class="font-mono text-[11px] text-neutral-400 mt-1">
          La norma ISO/IEC 18004 recomienda mantener al menos 4 módulos de espacio en blanco alrededor para una detección instantánea.
        </p>
      </div>
    </div>
  );
}
