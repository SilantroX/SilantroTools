// src/tools/qr-generator/components/QrLogoPanel.tsx
import { useState } from 'preact/hooks';
import type { QrOptionsState } from '../types';

interface Props {
  state: QrOptionsState;
  onChange: (updates: Partial<QrOptionsState>) => void;
}

const SILANTRO_LOGO_PATH = '/logos/logo-con-fondo-opt.webp';

export default function QrLogoPanel({ state, onChange }: Props) {
  const [isDragging, setIsDragging] = useState(false);

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

  const processFile = (file: File) => {
    if (!file.type.match(/^image\/(png|jpeg|svg\+xml|webp)$/)) {
      alert('Por favor selecciona una imagen válida (PNG, JPG, SVG o WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      onChange({
        logoUrl: uploadEvent.target?.result as string,
        isBrandLogoActive: false,
        errorCorrectionLevel: 'H',
      });
    };
    reader.readAsDataURL(file);
  };

  const handleCustomFileUpload = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      processFile(target.files[0]);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemoveLogo = () => {
    onChange({
      logoUrl: undefined,
      isBrandLogoActive: false,
      errorCorrectionLevel: 'Q',
    });
  };

  return (
    <div class="space-y-4 min-w-0 max-w-full">
      {/* Botón de Insignia Oficial Silantro Labs */}
      <div>
        <label class="block font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-neutral-500 mb-2">
          Insignia Oficial de Marca
        </label>
        <button
          type="button"
          onClick={handleToggleSilantroLogo}
          class={`w-full p-3 rounded-lg border text-left transition-all flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 ${
            state.isBrandLogoActive
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-neutral-900 dark:border-white shadow-xs'
              : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
          }`}
        >
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-7 h-7 rounded border border-neutral-300 dark:border-neutral-700 overflow-hidden flex items-center justify-center bg-white flex-shrink-0">
              <img
                src={SILANTRO_LOGO_PATH}
                alt="Silantro Labs Logo"
                width="28"
                height="28"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="font-semibold text-xs tracking-tight">Logo Oficial Silantro</span>
                <span
                  class={`font-mono text-[9px] uppercase px-1.5 py-0.2 rounded border ${
                    state.isBrandLogoActive
                      ? 'border-white/30 text-white dark:border-black/30 dark:text-black font-semibold'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-500'
                  }`}
                >
                  {state.isBrandLogoActive ? 'Incrustado' : 'Disponible'}
                </span>
              </div>
              <p class={`text-[10px] sm:text-[11px] mt-0.5 truncate ${state.isBrandLogoActive ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-500'}`}>
                Incrusta el emblema en el centro del código
              </p>
            </div>
          </div>
          <span class="font-mono text-[11px] font-semibold flex-shrink-0">
            {state.isBrandLogoActive ? '[ ACTIVO ]' : '[ ACTIVAR ]'}
          </span>
        </button>
      </div>

      {/* Carga de Logotipo Personalizado */}
      <div>
        <label class="block font-mono text-[11px] uppercase tracking-wider text-neutral-500 mb-2.5">
          Carga de Marca Propia o Corporativa
        </label>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          class={`p-6 rounded-lg border-2 border-dashed text-center transition-colors ${
            isDragging
              ? 'border-neutral-900 dark:border-white bg-neutral-100 dark:bg-neutral-800'
              : 'border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/30 hover:border-neutral-400'
          }`}
        >
          <input
            id="custom-logo-file"
            type="file"
            accept="image/png, image/jpeg, image/svg+xml, image/webp"
            class="hidden"
            onChange={handleCustomFileUpload}
          />
          <label for="custom-logo-file" class="cursor-pointer block space-y-1.5">
            <div class="w-8 h-8 mx-auto rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <span class="text-xs font-semibold text-neutral-900 dark:text-neutral-100 hover:underline block">
              Arrastra un archivo aquí o haz clic para examinar
            </span>
            <span class="font-mono text-[11px] text-neutral-400 block">
              PNG, JPG, SVG o WEBP (procesado exclusivamente en memoria local)
            </span>
          </label>
        </div>
      </div>

      {/* Controles de Escala y Configuración de Logo Activo */}
      {state.logoUrl && (
        <div class="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/60 space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded border border-neutral-300 dark:border-neutral-700 overflow-hidden bg-white flex items-center justify-center">
                <img src={state.logoUrl} alt="Vista previa logo" class="w-full h-full object-contain" />
              </div>
              <span class="font-mono text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                Logotipo Activo
              </span>
            </div>
            <button
              type="button"
              onClick={handleRemoveLogo}
              class="font-mono text-xs text-neutral-500 hover:text-neutral-950 dark:hover:text-white underline transition-colors"
            >
              [ Quitar logotipo ]
            </button>
          </div>

          <div>
            <div class="flex items-center justify-between text-xs mb-1.5 font-mono">
              <label for="logo-size-slider" class="text-neutral-500">
                Escala Central del Logo:
              </label>
              <span class="text-neutral-900 dark:text-neutral-100 font-semibold">
                {Math.round(state.logoSize * 100)}%
              </span>
            </div>
            <input
              id="logo-size-slider"
              type="range"
              min="0.16"
              max="0.34"
              step="0.02"
              value={state.logoSize}
              onInput={(e) => onChange({ logoSize: Number((e.target as HTMLInputElement).value) })}
              class="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-neutral-900 dark:accent-neutral-100"
            />
          </div>

          <div class="p-3 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 font-mono text-[11px] text-neutral-600 dark:text-neutral-400 space-y-1">
            <div class="flex items-center gap-1.5 font-semibold text-neutral-900 dark:text-neutral-100">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Reed-Solomon Nivel H (30% redundancia) activado automáticamente</span>
            </div>
            <p class="leading-normal">
              Para garantizar que el código se pueda escanear sin errores a pesar del área cubierta por el logo central, se computan bloques de corrección de error de nivel alto.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
