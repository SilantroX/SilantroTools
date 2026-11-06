// src/tools/qr-generator/components/Step3Customize.tsx
import { useState, useMemo } from 'preact/hooks';
import type { QrOptionsState, QrPreset } from '../types';
import type { DotType, CornerSquareType, ErrorCorrectionLevel } from 'qr-code-styling';
import { getContrastRatio } from '../engine/colorUtils';
import QrLiveCanvas from './QrLiveCanvas';

interface Props {
  state: QrOptionsState;
  onChange: (updates: Partial<QrOptionsState>) => void;
  onBack: () => void;
  onContinue: () => void;
}

const MONOCHROME_PRESETS: QrPreset[] = [
  {
    id: 'mono-obsidian',
    name: 'Clásico negro',
    description: 'Máximo contraste',
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
    name: 'Gris grafito',
    description: 'Tono editorial',
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
    name: 'Modo oscuro',
    description: 'Fondo negro',
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
    name: 'Industrial',
    description: 'Cuadrícula pura',
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
    name: 'Líneas finas',
    description: 'Patrón moderno',
    dotsColor: '#18181b',
    bgColor: '#ffffff',
    cornersSquareColor: '#18181b',
    cornersDotColor: '#18181b',
    dotsType: 'classy',
    cornersSquareType: 'extra-rounded',
    cornersDotType: 'dot',
  },
];

const DOT_OPTIONS: Array<{ id: DotType; label: string }> = [
  { id: 'rounded', label: 'Suave' },
  { id: 'dots', label: 'Circular' },
  { id: 'extra-rounded', label: 'Curvo' },
  { id: 'classy', label: 'Líneas' },
  { id: 'square', label: 'Cuadrado' },
];

const CORNER_OPTIONS: Array<{ id: CornerSquareType; label: string }> = [
  { id: 'extra-rounded', label: 'Redondas' },
  { id: 'dot', label: 'Circulares' },
  { id: 'square', label: 'Cuadradas' },
];

const COLOR_SWATCHES = ['#000000', '#09090b', '#27272a', '#52525b', '#71717a', '#a1a1aa', '#e4e4e7', '#ffffff'];

const SILANTRO_LOGO_PATH = '/logos/logo-con-fondo-opt.webp';

type CustomizeTab = 'presets' | 'shapes' | 'colors' | 'logo' | 'advanced';

export default function Step3Customize({ state, onChange, onBack, onContinue }: Props) {
  const [activeTab, setActiveTab] = useState<CustomizeTab>('presets');

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

  const handleToggleSilantroLogo = () => {
    if (state.isBrandLogoActive) {
      onChange({
        logoUrl: undefined,
        isBrandLogoActive: false,
        errorCorrectionLevel: 'Q',
      });
    } else {
      onChange({
        logoUrl: SILANTRO_LOGO_PATH,
        isBrandLogoActive: true,
        errorCorrectionLevel: 'H',
      });
    }
  };

  const processUploadedFile = (file: File) => {
    if (!file.type.match(/^image\/(png|jpeg|svg\+xml|webp)$/)) {
      alert('Selecciona una imagen válida (PNG, JPG, SVG o WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange({
        logoUrl: e.target?.result as string,
        isBrandLogoActive: false,
        errorCorrectionLevel: 'H',
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    onChange({
      logoUrl: undefined,
      isBrandLogoActive: false,
      errorCorrectionLevel: 'Q',
    });
  };

  return (
    <div class="animate-step-enter max-w-5xl mx-auto space-y-2.5 sm:space-y-4 py-1">
      {/* Título */}
      <div class="flex items-center justify-between">
        <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
          Personaliza tu código
        </h2>
        <span class="text-[11px] font-mono text-neutral-500">
          Vista en directo
        </span>
      </div>

      {/* Vista Móvil: Preview compacto arriba + Opciones (Ocupa mínimo espacio vertical) */}
      <div class="sm:hidden surface-card p-3 flex flex-col items-center gap-2.5 shadow-2xs">
        {/* Canvas QR compacto en móvil (140px) */}
        <div class="w-[140px] h-[140px] p-2 rounded-xl bg-white border border-neutral-200 dark:border-neutral-800 shadow-inner flex items-center justify-center">
          <QrLiveCanvas state={state} size={124} className="w-full h-full" />
        </div>

        {/* Pestañas con Iconos en Móvil */}
        <div class="w-full flex items-center justify-center gap-1 border-b border-neutral-200 dark:border-neutral-800 pb-1.5">
          {[
            { id: 'presets', label: 'Estilos', icon: 'M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z' },
            { id: 'shapes', label: 'Formas', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6z' },
            { id: 'colors', label: 'Colores', icon: 'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z' },
            { id: 'logo', label: 'Logo', icon: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as CustomizeTab)}
                class={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${
                  isActive
                    ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-semibold'
                    : 'text-neutral-500 hover:text-neutral-950 dark:hover:text-white'
                }`}
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d={tab.icon} />
                </svg>
                <span class="text-[11px]">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Contenido Dinámico de la Pestaña en Móvil */}
        <div class="w-full pt-1">
          {activeTab === 'presets' && (
            <div class="grid grid-cols-2 gap-1.5">
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
                    class={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all active:scale-[0.98] ${
                      isSelected
                        ? 'border-neutral-950 dark:border-white bg-neutral-100 dark:bg-neutral-800 font-semibold'
                        : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200'
                    }`}
                  >
                    <span
                      class="w-3 h-3 rounded-full border border-neutral-300 dark:border-neutral-700 flex-shrink-0"
                      style={{ backgroundColor: preset.dotsColor }}
                    />
                    <span class="text-[11px] truncate">{preset.name}</span>
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === 'shapes' && (
            <div class="space-y-1.5">
              <div class="grid grid-cols-5 gap-1">
                {DOT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onChange({ dotsType: opt.id })}
                    class={`py-1.5 px-1 rounded-md text-[10px] text-center border transition-all ${
                      state.dotsType === opt.id
                        ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-semibold border-neutral-950 dark:border-white'
                        : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div class="grid grid-cols-3 gap-1 pt-1">
                {CORNER_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onChange({ cornersSquareType: opt.id })}
                    class={`py-1.5 px-1 rounded-md text-[10px] text-center border transition-all ${
                      state.cornersSquareType === opt.id
                        ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-semibold border-neutral-950 dark:border-white'
                        : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'colors' && (
            <div class="space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="text-[11px] font-medium text-neutral-700 dark:text-neutral-300">Puntos</span>
                <div class="flex items-center gap-1">
                  <input
                    type="color"
                    value={state.dotsColor}
                    onChange={(e) => onChange({ dotsColor: (e.target as HTMLInputElement).value })}
                    class="w-6 h-6 rounded border border-neutral-300 dark:border-neutral-700 cursor-pointer bg-transparent"
                  />
                  {COLOR_SWATCHES.slice(0, 5).map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => onChange({ dotsColor: hex })}
                      class="w-4 h-4 rounded-full border border-neutral-300 dark:border-neutral-700"
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              </div>

              <div class="flex items-center justify-between text-xs">
                <span class="text-[11px] font-medium text-neutral-700 dark:text-neutral-300">Fondo</span>
                <div class="flex items-center gap-1">
                  <input
                    type="color"
                    value={state.bgColor}
                    onChange={(e) => onChange({ bgColor: (e.target as HTMLInputElement).value })}
                    class="w-6 h-6 rounded border border-neutral-300 dark:border-neutral-700 cursor-pointer bg-transparent"
                  />
                  {['#ffffff', '#fafafa', '#e4e4e7', '#27272a', '#09090b'].map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => onChange({ bgColor: hex })}
                      class="w-4 h-4 rounded-full border border-neutral-300 dark:border-neutral-700"
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logo' && (
            <div class="space-y-2">
              <button
                type="button"
                onClick={handleToggleSilantroLogo}
                class={`w-full py-2 px-3 rounded-lg border text-xs flex items-center justify-between transition-all ${
                  state.isBrandLogoActive
                    ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-semibold'
                    : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800'
                }`}
              >
                <span>Emblema Silantro</span>
                <span class="text-[11px]">{state.isBrandLogoActive ? 'Activo ✓' : 'Añadir'}</span>
              </button>

              <label class="w-full py-2 px-3 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-neutral-500 cursor-pointer text-xs flex items-center justify-between">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/svg+xml, image/webp"
                  class="hidden"
                  onChange={(e) => {
                    const target = e.target as HTMLInputElement;
                    if (target.files && target.files[0]) processUploadedFile(target.files[0]);
                  }}
                />
                <span>Subir imagen propia</span>
                <span class="text-[10px] text-neutral-400">PNG/JPG/SVG</span>
              </label>

              {state.logoUrl && !state.isBrandLogoActive && (
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  class="text-[10px] text-neutral-400 hover:text-neutral-950 dark:hover:text-white underline block mx-auto pt-1"
                >
                  Quitar imagen
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Vista Desktop (sm:grid 2 columnas): Izquierda Controles, Derecha Canvas Sticky */}
      <div class="hidden sm:grid sm:grid-cols-12 gap-5 items-start">
        {/* Columna Izquierda: 7 cols */}
        <div class="sm:col-span-7 space-y-3">
          {/* Barra de Pestañas con Iconos */}
          <div class="flex items-center gap-1 border-b border-neutral-200 dark:border-neutral-800 pb-1">
            {[
              { id: 'presets', label: 'Estilos rápidos' },
              { id: 'shapes', label: 'Puntos y formas' },
              { id: 'colors', label: 'Colores' },
              { id: 'logo', label: 'Logotipo', badge: state.logoUrl ? '✓' : undefined },
              { id: 'advanced', label: 'Más' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as CustomizeTab)}
                  class={`px-3 py-1.5 text-xs rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                    isActive
                      ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-semibold shadow-2xs'
                      : 'text-neutral-500 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.badge && <span class="font-mono text-[9px]">{tab.badge}</span>}
                </button>
              );
            })}
          </div>

          {/* Tarjeta de Controles Compacta */}
          <div class="surface-card p-4 space-y-3 min-h-[170px] flex flex-col justify-center">
            {activeTab === 'presets' && (
              <div class="grid grid-cols-2 gap-2">
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
                      class={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-neutral-950 dark:border-white bg-neutral-100 dark:bg-neutral-800 shadow-2xs font-semibold'
                          : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-400'
                      }`}
                    >
                      <div class="flex items-center gap-2 min-w-0">
                        <span
                          class="w-3.5 h-3.5 rounded-full border border-neutral-300 dark:border-neutral-700 flex-shrink-0"
                          style={{ backgroundColor: preset.dotsColor }}
                        />
                        <span class="text-xs truncate">{preset.name}</span>
                      </div>
                      <span class="text-[10px] text-neutral-400 flex-shrink-0">{preset.description}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {activeTab === 'shapes' && (
              <div class="space-y-3">
                <div>
                  <span class="block text-[11px] font-semibold text-neutral-800 dark:text-neutral-200 mb-1.5">
                    Forma de los puntos
                  </span>
                  <div class="grid grid-cols-5 gap-1.5">
                    {DOT_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => onChange({ dotsType: opt.id })}
                        class={`py-2 px-1 text-center rounded-lg text-xs border transition-all cursor-pointer ${
                          state.dotsType === opt.id
                            ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-semibold border-neutral-950 dark:border-white shadow-2xs'
                            : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span class="block text-[11px] font-semibold text-neutral-800 dark:text-neutral-200 mb-1.5">
                    Forma de las esquinas
                  </span>
                  <div class="grid grid-cols-3 gap-1.5">
                    {CORNER_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => onChange({ cornersSquareType: opt.id })}
                        class={`py-1.5 px-2 text-center rounded-lg text-xs border transition-all cursor-pointer ${
                          state.cornersSquareType === opt.id
                            ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-semibold border-neutral-950 dark:border-white shadow-2xs'
                            : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'colors' && (
              <div class="space-y-3">
                <div class="flex items-center justify-between text-xs pb-1 border-b border-neutral-100 dark:border-neutral-800">
                  <span class="font-semibold">Colores y contraste</span>
                  <span
                    class={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      isLowContrast
                        ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    {isLowContrast ? '⚠ Contraste bajo' : '✓ Contraste óptimo'}
                  </span>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div class="space-y-1.5">
                    <span class="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400">Color puntos</span>
                    <div class="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={state.dotsColor}
                        onChange={(e) => onChange({ dotsColor: (e.target as HTMLInputElement).value })}
                        class="w-7 h-7 rounded border border-neutral-300 dark:border-neutral-700 cursor-pointer bg-transparent"
                      />
                      <div class="flex items-center gap-1">
                        {COLOR_SWATCHES.slice(0, 5).map((hex) => (
                          <button
                            key={hex}
                            type="button"
                            onClick={() => onChange({ dotsColor: hex })}
                            class="w-4 h-4 rounded-full border border-neutral-300 dark:border-neutral-700 hover:scale-110 transition-transform cursor-pointer"
                            style={{ backgroundColor: hex }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div class="space-y-1.5">
                    <span class="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400">Color fondo</span>
                    <div class="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={state.bgColor}
                        onChange={(e) => onChange({ bgColor: (e.target as HTMLInputElement).value })}
                        class="w-7 h-7 rounded border border-neutral-300 dark:border-neutral-700 cursor-pointer bg-transparent"
                      />
                      <div class="flex items-center gap-1">
                        {['#ffffff', '#f4f4f5', '#e4e4e7', '#27272a', '#09090b'].map((hex) => (
                          <button
                            key={hex}
                            type="button"
                            onClick={() => onChange({ bgColor: hex })}
                            class="w-4 h-4 rounded-full border border-neutral-300 dark:border-neutral-700 hover:scale-110 transition-transform cursor-pointer"
                            style={{ backgroundColor: hex }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'logo' && (
              <div class="space-y-2.5">
                <div class="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleToggleSilantroLogo}
                    class={`p-2.5 rounded-lg border text-left flex items-center justify-between cursor-pointer transition-all ${
                      state.isBrandLogoActive
                        ? 'border-neutral-950 dark:border-white bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-2xs font-semibold'
                        : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-400'
                    }`}
                  >
                    <div class="flex items-center gap-2">
                      <div class="w-6 h-6 rounded border border-neutral-300 dark:border-neutral-700 overflow-hidden bg-white">
                        <img src={SILANTRO_LOGO_PATH} alt="Silantro Logo" class="w-full h-full object-cover" />
                      </div>
                      <span class="text-xs">Logo Silantro</span>
                    </div>
                    <span class="text-[10px]">{state.isBrandLogoActive ? 'Activo' : 'Añadir'}</span>
                  </button>

                  <label class="p-2.5 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-neutral-500 cursor-pointer flex items-center justify-between text-xs">
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/svg+xml, image/webp"
                      class="hidden"
                      onChange={(e) => {
                        const target = e.target as HTMLInputElement;
                        if (target.files && target.files[0]) processUploadedFile(target.files[0]);
                      }}
                    />
                    <span>Subir archivo</span>
                    <span class="text-[10px] text-neutral-400">PNG/SVG</span>
                  </label>
                </div>

                {state.logoUrl && (
                  <div class="flex items-center justify-between gap-3 pt-1 border-t border-neutral-100 dark:border-neutral-800">
                    <div class="flex items-center gap-2 flex-1">
                      <span class="text-[11px] text-neutral-500 whitespace-nowrap">Tamaño logo:</span>
                      <input
                        type="range"
                        min="0.16"
                        max="0.34"
                        step="0.02"
                        value={state.logoSize}
                        onInput={(e) => onChange({ logoSize: Number((e.target as HTMLInputElement).value) })}
                        class="w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded appearance-none cursor-pointer accent-neutral-950 dark:accent-white"
                      />
                      <span class="font-mono text-[10px] w-7">{Math.round(state.logoSize * 100)}%</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      class="text-[10px] text-neutral-400 hover:text-neutral-950 dark:hover:text-white underline cursor-pointer"
                    >
                      Quitar
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'advanced' && (
              <div class="space-y-2">
                <div class="flex items-center justify-between gap-3">
                  <span class="text-xs text-neutral-600 dark:text-neutral-400">Margen exterior:</span>
                  <div class="flex items-center gap-2 flex-1 max-w-[200px]">
                    <input
                      type="range"
                      min="0"
                      max="32"
                      step="2"
                      value={state.margin}
                      onInput={(e) => onChange({ margin: Number((e.target as HTMLInputElement).value) })}
                      class="w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded appearance-none cursor-pointer accent-neutral-950 dark:accent-white"
                    />
                    <span class="font-mono text-[11px] w-9">{state.margin}px</span>
                  </div>
                </div>

                <div class="flex items-center justify-between gap-3 pt-1 border-t border-neutral-100 dark:border-neutral-800">
                  <span class="text-xs text-neutral-600 dark:text-neutral-400">Corrección de error:</span>
                  <select
                    value={state.errorCorrectionLevel}
                    onChange={(e) =>
                      onChange({ errorCorrectionLevel: (e.target as HTMLSelectElement).value as ErrorCorrectionLevel })
                    }
                    class="input-field text-xs py-1 px-2 w-auto cursor-pointer"
                  >
                    <option value="L">L (7% redundancia)</option>
                    <option value="M">M (15% estándar)</option>
                    <option value="Q">Q (25% alto)</option>
                    <option value="H">H (30% máximo)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha: Vista Previa Canvas Compacta (5 cols) */}
        <div class="sm:col-span-5 surface-card p-4 flex flex-col items-center justify-center text-center space-y-2">
          <div class="w-[180px] h-[180px] p-2.5 rounded-xl bg-white border border-neutral-200 dark:border-neutral-800 shadow-inner flex items-center justify-center">
            <QrLiveCanvas state={state} size={160} className="w-full h-full" />
          </div>
          <span class="text-[11px] font-mono text-neutral-400">
            Vista previa interactiva
          </span>
        </div>
      </div>

      {/* Botones de Navegación Inferior (Touch target 42-44px) */}
      <div class="pt-1 flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          class="btn-secondary py-2.5 px-3.5 text-xs font-medium cursor-pointer flex items-center gap-1.5 flex-shrink-0"
          title="Volver a los datos"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <span class="hidden sm:inline">Atrás</span>
        </button>

        <button
          type="button"
          onClick={onContinue}
          class="btn-primary flex-1 py-2.5 px-4 text-xs sm:text-sm font-semibold cursor-pointer shadow-xs flex items-center justify-center gap-2 group active:scale-[0.99] transition-transform"
        >
          <span>Ver código listo</span>
          <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
