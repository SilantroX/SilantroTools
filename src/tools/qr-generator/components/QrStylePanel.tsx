// src/tools/qr-generator/components/QrStylePanel.tsx
import type { QrOptionsState, QrPreset } from '../types';
import type { DotType, CornerSquareType } from 'qr-code-styling';

interface Props {
  state: QrOptionsState;
  onChange: (updates: Partial<QrOptionsState>) => void;
}

const presets: QrPreset[] = [
  {
    id: 'silantro-dark',
    name: 'Silantro Obsidian',
    dotsColor: '#09090b',
    bgColor: '#ffffff',
    cornersSquareColor: '#09090b',
    cornersDotColor: '#16885c',
    dotsType: 'rounded',
    cornersSquareType: 'extra-rounded',
    cornersDotType: 'dot',
  },
  {
    id: 'silantro-green',
    name: 'Silantro Emerald',
    dotsColor: '#16885c',
    bgColor: '#ffffff',
    cornersSquareColor: '#0f442d',
    cornersDotColor: '#22a975',
    dotsType: 'extra-rounded',
    cornersSquareType: 'extra-rounded',
    cornersDotType: 'dot',
  },
  {
    id: 'slate-minimal',
    name: 'Minimal Slate',
    dotsColor: '#18181b',
    bgColor: '#ffffff',
    cornersSquareColor: '#18181b',
    cornersDotColor: '#18181b',
    dotsType: 'dots',
    cornersSquareType: 'dot',
    cornersDotType: 'dot',
  },
  {
    id: 'classic-square',
    name: 'Industrial Square',
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
  { id: 'dots', label: 'Círculos' },
  { id: 'extra-rounded', label: 'Curvado' },
  { id: 'classy', label: 'Elegante' },
  { id: 'square', label: 'Cuadrado' },
];

const cornerOptions: Array<{ id: CornerSquareType; label: string }> = [
  { id: 'extra-rounded', label: 'Redondeado' },
  { id: 'dot', label: 'Circular' },
  { id: 'square', label: 'Clásico' },
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
      {/* Presets Rápidos */}
      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5">
          Paletas y Estilos Predefinidos
        </label>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {presets.map((preset) => (
            <button
              type="button"
              onClick={() => applyPreset(preset)}
              class="glass-subtle p-2.5 rounded-xl text-left hover:border-zinc-400 dark:hover:border-zinc-600 transition-all group flex flex-col justify-between"
            >
              <div class="flex items-center gap-1.5 mb-2">
                <span
                  class="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs"
                  style={{ backgroundColor: preset.dotsColor }}
                ></span>
                <span
                  class="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs"
                  style={{ backgroundColor: preset.cornersDotColor }}
                ></span>
              </div>
              <span class="text-xs font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-white">
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Forma de los Módulos / Puntos */}
      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5">
          Patrón de Módulos (Puntos)
        </label>
        <div class="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {dotOptions.map((opt) => (
            <button
              type="button"
              onClick={() => onChange({ dotsType: opt.id })}
              class={`py-2 px-2.5 rounded-xl text-xs font-medium text-center transition-all ${
                state.dotsType === opt.id
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                  : 'glass-subtle text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Forma de las Esquinas */}
      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5">
          Vértices de Escaneo (Esquinas)
        </label>
        <div class="grid grid-cols-3 gap-2">
          {cornerOptions.map((opt) => (
            <button
              type="button"
              onClick={() => onChange({ cornersSquareType: opt.id })}
              class={`py-2 px-3 rounded-xl text-xs font-medium text-center transition-all ${
                state.cornersSquareType === opt.id
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                  : 'glass-subtle text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Selector de Colores Hexadecimales */}
      <div class="glass-subtle p-4 rounded-2xl space-y-4">
        <label class="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Personalización de Color
        </label>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Color de Puntos */}
          <div>
            <label class="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
              Puntos del Código
            </label>
            <div class="flex items-center gap-2">
              <input
                type="color"
                value={state.dotsColor}
                onChange={(e) => onChange({ dotsColor: (e.target as HTMLInputElement).value })}
                class="w-9 h-9 rounded-xl border border-zinc-300 dark:border-zinc-700 cursor-pointer bg-transparent"
              />
              <span class="text-xs font-mono uppercase text-zinc-700 dark:text-zinc-300">{state.dotsColor}</span>
            </div>
          </div>

          {/* Color de Fondo */}
          <div>
            <label class="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
              Color de Fondo
            </label>
            <div class="flex items-center gap-2">
              <input
                type="color"
                value={state.bgColor}
                onChange={(e) => onChange({ bgColor: (e.target as HTMLInputElement).value })}
                class="w-9 h-9 rounded-xl border border-zinc-300 dark:border-zinc-700 cursor-pointer bg-transparent"
              />
              <span class="text-xs font-mono uppercase text-zinc-700 dark:text-zinc-300">{state.bgColor}</span>
            </div>
          </div>

          {/* Color de Esquinas */}
          <div>
            <label class="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
              Color de Esquinas
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
                class="w-9 h-9 rounded-xl border border-zinc-300 dark:border-zinc-700 cursor-pointer bg-transparent"
              />
              <span class="text-xs font-mono uppercase text-zinc-700 dark:text-zinc-300">
                {state.cornersSquareColor}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Margen / Zona Muda */}
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Margen de Zona Muda (Quiet Zone)
          </label>
          <span class="text-xs font-mono text-zinc-500">{state.margin} px</span>
        </div>
        <input
          type="range"
          min="0"
          max="30"
          step="2"
          value={state.margin}
          onInput={(e) => onChange({ margin: Number((e.target as HTMLInputElement).value) })}
          class="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:accent-zinc-100"
        />
        <div class="flex justify-between text-[10px] text-zinc-400 mt-1">
          <span>0 (Sin margen)</span>
          <span>10 (Recomendado)</span>
          <span>30 (Margen amplio)</span>
        </div>
      </div>
    </div>
  );
}
