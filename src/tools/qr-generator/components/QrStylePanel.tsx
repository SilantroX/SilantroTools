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
    name: 'Clásico negro',
    description: 'Máximo contraste y lectura rápida',
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
    name: 'Gris suave',
    description: 'Tono sobrio y elegante',
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
    name: 'Fondo oscuro',
    description: 'Para pantallas y modo oscuro',
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
    name: 'Cuadrado tradicional',
    description: 'Aspecto clásico de código QR',
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
    name: 'Líneas modernas',
    description: 'Estilo limpio y estilizado',
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
  { id: 'rounded', label: 'Suave', desc: 'Bordes redondeados' },
  { id: 'dots', label: 'Circular', desc: 'Puntos redondos' },
  { id: 'extra-rounded', label: 'Curvo', desc: 'Curvatura pronunciada' },
  { id: 'classy', label: 'Líneas', desc: 'Diseño moderno' },
  { id: 'square', label: 'Cuadrado', desc: 'Forma tradicional' },
];

const CORNER_OPTIONS: Array<{ id: CornerSquareType; label: string }> = [
  { id: 'extra-rounded', label: 'Redondeadas' },
  { id: 'dot', label: 'Circulares' },
  { id: 'square', label: 'Cuadradas' },
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
      {/* Estilos rápidos recomendados */}
      <div>
        <label class="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-2.5">
          Estilos rápidos recomendados
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
                class={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-neutral-900 dark:border-white bg-neutral-100/80 dark:bg-neutral-800/80 ring-1 ring-neutral-900 dark:ring-white shadow-xs'
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
                <span class="block text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-snug">
                  {preset.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Forma de los puntos */}
      <div>
        <label class="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
          Forma de los puntos
        </label>
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {DOT_OPTIONS.map((opt) => {
            const isSelected = state.dotsType === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange({ dotsType: opt.id })}
                class={`py-2 px-2.5 rounded-lg text-xs text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold border-neutral-900 dark:border-white shadow-xs'
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

      {/* Forma de las esquinas */}
      <div>
        <label class="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
          Forma de las esquinas
        </label>
        <div class="grid grid-cols-3 gap-2">
          {CORNER_OPTIONS.map((opt) => {
            const isSelected = state.cornersSquareType === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange({ cornersSquareType: opt.id })}
                class={`py-2 px-3 rounded-lg text-xs font-medium text-center border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold border-neutral-900 dark:border-white shadow-xs'
                    : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Personalización de colores */}
      <div class="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 space-y-4">
        <div class="flex items-center justify-between">
          <label class="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">
            Colores del código
          </label>
          <div
            class={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] ${
              isLowContrast
                ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200 font-medium border border-amber-300 dark:border-amber-800'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium'
            }`}
          >
            <span>{isLowContrast ? '⚠ Contraste bajo' : '✓ Fácil de escanear'}</span>
          </div>
        </div>

        {/* Alerta clara de contraste */}
        {isLowContrast && (
          <div class="p-3 rounded-md border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs">
            <span>Aviso de lectura:</span> La combinación elegida tiene poco contraste. Algunas cámaras de celular podrían tardar en detectarlo. Te recomendamos un color oscuro sobre fondo claro.
          </div>
        )}

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Color del código */}
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs font-medium text-neutral-700 dark:text-neutral-300">
              <span>Color de los puntos</span>
              <span class="font-mono text-[11px] uppercase text-neutral-500">{state.dotsColor}</span>
            </div>
            <div class="flex items-center gap-2">
              <input
                type="color"
                value={state.dotsColor}
                onChange={(e) => onChange({ dotsColor: (e.target as HTMLInputElement).value })}
                class="w-9 h-9 rounded-md border border-neutral-300 dark:border-neutral-700 cursor-pointer bg-transparent"
                title="Elegir color personalizado"
              />
              <div class="flex items-center gap-1">
                {COLOR_SWATCHES.map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => onChange({ dotsColor: hex })}
                    class="w-5 h-5 rounded-full border border-neutral-300 dark:border-neutral-700 hover:scale-110 transition-transform cursor-pointer"
                    style={{ backgroundColor: hex }}
                    title={`Elegir ${hex}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Color de fondo */}
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs font-medium text-neutral-700 dark:text-neutral-300">
              <span>Color de fondo</span>
              <span class="font-mono text-[11px] uppercase text-neutral-500">{state.bgColor}</span>
            </div>
            <div class="flex items-center gap-2">
              <input
                type="color"
                value={state.bgColor}
                onChange={(e) => onChange({ bgColor: (e.target as HTMLInputElement).value })}
                class="w-9 h-9 rounded-md border border-neutral-300 dark:border-neutral-700 cursor-pointer bg-transparent"
                title="Elegir fondo personalizado"
              />
              <div class="flex items-center gap-1">
                {COLOR_SWATCHES.map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => onChange({ bgColor: hex })}
                    class="w-5 h-5 rounded-full border border-neutral-300 dark:border-neutral-700 hover:scale-110 transition-transform cursor-pointer"
                    style={{ backgroundColor: hex }}
                    title={`Elegir ${hex}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Margen alrededor del código */}
      <div>
        <div class="flex items-center justify-between mb-2">
          <label for="margin-slider" class="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
            Margen en blanco exterior
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
        <p class="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
          Un pequeño margen en blanco alrededor ayuda a que la cámara del celular enfoque y lea el código al instante.
        </p>
      </div>
    </div>
  );
}
