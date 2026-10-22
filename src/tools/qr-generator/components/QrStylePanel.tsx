// src/tools/qr-generator/components/QrStylePanel.tsx
import type { QrOptionsState, QrPreset } from '../types';
import type { DotType, CornerSquareType } from 'qr-code-styling';

interface Props {
  state: QrOptionsState;
  onChange: (updates: Partial<QrOptionsState>) => void;
}

const monochromePresets: QrPreset[] = [
  {
    id: 'mono-black-white',
    name: 'Obsidiana Estándar',
    dotsColor: '#0a0a0a',
    bgColor: '#ffffff',
    cornersSquareColor: '#0a0a0a',
    cornersDotColor: '#0a0a0a',
    dotsType: 'rounded',
    cornersSquareType: 'extra-rounded',
    cornersDotType: 'dot',
  },
  {
    id: 'mono-graphite',
    name: 'Grafito Neutro',
    dotsColor: '#262626',
    bgColor: '#ffffff',
    cornersSquareColor: '#262626',
    cornersDotColor: '#262626',
    dotsType: 'dots',
    cornersSquareType: 'dot',
    cornersDotType: 'dot',
  },
  {
    id: 'mono-inverted',
    name: 'Negativo Invertido',
    dotsColor: '#ffffff',
    bgColor: '#0a0a0a',
    cornersSquareColor: '#ffffff',
    cornersDotColor: '#ffffff',
    dotsType: 'rounded',
    cornersSquareType: 'extra-rounded',
    cornersDotType: 'dot',
  },
  {
    id: 'mono-industrial',
    name: 'Industrial Geométrico',
    dotsColor: '#000000',
    bgColor: '#ffffff',
    cornersSquareColor: '#000000',
    cornersDotColor: '#000000',
    dotsType: 'square',
    cornersSquareType: 'square',
    cornersDotType: 'square',
  },
];

const dotOptions: Array<{ id: DotType; label: string }> = [
  { id: 'rounded', label: 'Suave' },
  { id: 'dots', label: 'Circular' },
  { id: 'extra-rounded', label: 'Curvo' },
  { id: 'classy', label: 'Editorial' },
  { id: 'square', label: 'Cuadrado' },
];

const cornerOptions: Array<{ id: CornerSquareType; label: string }> = [
  { id: 'extra-rounded', label: 'Redondeado' },
  { id: 'dot', label: 'Circular' },
  { id: 'square', label: 'Recto' },
];

export default function QrStylePanel({ state, onChange }: Props) {
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
          02.1 / Presets Monocromáticos
        </label>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {monochromePresets.map((preset) => (
            <button
              type="button"
              onClick={() => applyPreset(preset)}
              class="p-2.5 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-left hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
            >
              <div class="flex items-center gap-1.5 mb-2">
                <span
                  class="w-3.5 h-3.5 rounded-full border border-neutral-300 dark:border-neutral-700"
                  style={{ backgroundColor: preset.dotsColor }}
                ></span>
                <span
                  class="w-3.5 h-3.5 rounded-full border border-neutral-300 dark:border-neutral-700"
                  style={{ backgroundColor: preset.bgColor }}
                ></span>
              </div>
              <span class="block text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Geometría de Puntos */}
      <div>
        <label class="block font-mono text-[11px] uppercase tracking-wider text-neutral-500 mb-2">
          02.2 / Geometría de Módulos (Puntos)
        </label>
        <div class="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {dotOptions.map((opt) => (
            <button
              type="button"
              onClick={() => onChange({ dotsType: opt.id })}
              class={`py-1.5 px-2 rounded text-xs font-medium text-center border transition-colors ${
                state.dotsType === opt.id
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-neutral-900 dark:border-neutral-100'
                  : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Geometría de Esquinas */}
      <div>
        <label class="block font-mono text-[11px] uppercase tracking-wider text-neutral-500 mb-2">
          02.3 / Patrón de Esquinas (Vértices)
        </label>
        <div class="grid grid-cols-3 gap-2">
          {cornerOptions.map((opt) => (
            <button
              type="button"
              onClick={() => onChange({ cornersSquareType: opt.id })}
              class={`py-1.5 px-3 rounded text-xs font-medium text-center border transition-colors ${
                state.cornersSquareType === opt.id
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-neutral-900 dark:border-neutral-100'
                  : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Parámetros de Color */}
      <div class="p-4 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 space-y-4">
        <label class="block font-mono text-[11px] uppercase tracking-wider text-neutral-500">
          02.4 / Paleta Hexadecimal
        </label>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="block text-[11px] font-mono text-neutral-600 dark:text-neutral-400 mb-1">
              Color Módulos
            </label>
            <div class="flex items-center gap-2">
              <input
                type="color"
                value={state.dotsColor}
                onChange={(e) => onChange({ dotsColor: (e.target as HTMLInputElement).value })}
                class="w-8 h-8 rounded border border-neutral-300 dark:border-neutral-700 cursor-pointer bg-transparent"
              />
              <span class="font-mono text-xs uppercase text-neutral-800 dark:text-neutral-200">{state.dotsColor}</span>
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-mono text-neutral-600 dark:text-neutral-400 mb-1">
              Color Fondo
            </label>
            <div class="flex items-center gap-2">
              <input
                type="color"
                value={state.bgColor}
                onChange={(e) => onChange({ bgColor: (e.target as HTMLInputElement).value })}
                class="w-8 h-8 rounded border border-neutral-300 dark:border-neutral-700 cursor-pointer bg-transparent"
              />
              <span class="font-mono text-xs uppercase text-neutral-800 dark:text-neutral-200">{state.bgColor}</span>
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-mono text-neutral-600 dark:text-neutral-400 mb-1">
              Color Vértices
            </label>
            <div class="flex items-center gap-2">
              <input
                type="color"
                value={state.cornersSquareColor}
                onChange={(e) =>
                  onChange({
                    cornersSquareColor: (e.target as HTMLInputElement).value,
                    cornersDotColor: (e.target as HTMLInputElement).value,
                  })
                }
                class="w-8 h-8 rounded border border-neutral-300 dark:border-neutral-700 cursor-pointer bg-transparent"
              />
              <span class="font-mono text-xs uppercase text-neutral-800 dark:text-neutral-200">{state.cornersSquareColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Margen */}
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="font-mono text-[11px] uppercase tracking-wider text-neutral-500">
            02.5 / Margen Perimetral (Quiet Zone)
          </label>
          <span class="font-mono text-xs text-neutral-600 dark:text-neutral-400">{state.margin} px</span>
        </div>
        <input
          type="range"
          min="0"
          max="30"
          step="2"
          value={state.margin}
          onInput={(e) => onChange({ margin: Number((e.target as HTMLInputElement).value) })}
          class="w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded appearance-none cursor-pointer accent-neutral-900 dark:accent-neutral-100"
        />
      </div>
    </div>
  );
}
