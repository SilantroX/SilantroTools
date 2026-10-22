// src/tools/qr-generator/components/QrLogoPanel.tsx
import type { QrOptionsState } from '../types';

interface Props {
  state: QrOptionsState;
  onChange: (updates: Partial<QrOptionsState>) => void;
}

const SILANTRO_LOGO_PATH = '/logos/logo-con-fondo.jpg';

export default function QrLogoPanel({ state, onChange }: Props) {
  const handleToggleSilantroLogo = () => {
    if (state.isBrandLogoActive) {
      // Desactivar
      onChange({
        logoUrl: undefined,
        isBrandLogoActive: false,
        errorCorrectionLevel: 'Q',
      });
    } else {
      // Activar logo Silantro Labs
      onChange({
        logoUrl: SILANTRO_LOGO_PATH,
        isBrandLogoActive: true,
        errorCorrectionLevel: 'H', // Obligatorio 'H' para tolerar el logotipo
      });
    }
  };

  const handleCustomFileUpload = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const file = target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        onChange({
          logoUrl: uploadEvent.target?.result as string,
          isBrandLogoActive: false,
          errorCorrectionLevel: 'H',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    onChange({
      logoUrl: undefined,
      isBrandLogoActive: false,
      errorCorrectionLevel: 'Q',
    });
  };

  return (
    <div class="space-y-6">
      {/* Botón de Marca: Silantro Labs Oficial */}
      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5">
          Incrustación de Marca Rápida
        </label>
        <button
          type="button"
          onClick={handleToggleSilantroLogo}
          class={`w-full p-4 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between group ${
            state.isBrandLogoActive
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 border-zinc-900 dark:border-white shadow-md'
              : 'glass-panel hover:border-zinc-400 dark:hover:border-zinc-600'
          }`}
        >
          <div class="flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-xl bg-white p-1 border border-zinc-200 dark:border-zinc-700 shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0">
              <img
                src={SILANTRO_LOGO_PATH}
                alt="Silantro Labs"
                class="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-sm">Logo Oficial Silantro Labs</span>
                <span class={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                  state.isBrandLogoActive
                    ? 'bg-brand-500 text-white'
                    : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                }`}>
                  {state.isBrandLogoActive ? 'Activo' : 'Un Clic'}
                </span>
              </div>
              <p class={`text-xs mt-0.5 ${state.isBrandLogoActive ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-500 dark:text-zinc-400'}`}>
                Aplica la insignia de Silantro en el centro del código QR
              </p>
            </div>
          </div>
          <div class="flex-shrink-0 ml-3">
            <span class={`inline-flex items-center justify-center w-6 h-6 rounded-full border text-xs font-bold ${
              state.isBrandLogoActive
                ? 'bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white border-transparent'
                : 'border-zinc-300 dark:border-zinc-600 text-transparent'
            }`}>
              ✓
            </span>
          </div>
        </button>
      </div>

      {/* Subir Logo Personalizado */}
      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5">
          O sube tu propio icono / imagen
        </label>
        <div class="glass-subtle p-5 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-center hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors">
          <input
            id="custom-logo-input"
            type="file"
            accept="image/png, image/jpeg, image/svg+xml, image/webp"
            class="hidden"
            onChange={handleCustomFileUpload}
          />
          <label
            for="custom-logo-input"
            class="cursor-pointer flex flex-col items-center justify-center gap-2"
          >
            <div class="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <span class="text-xs font-semibold text-zinc-900 dark:text-zinc-100 underline decoration-zinc-400">
                Seleccionar archivo local
              </span>
              <span class="text-xs text-zinc-500 dark:text-zinc-400"> o arrastra aquí</span>
            </div>
            <p class="text-[11px] text-zinc-400 dark:text-zinc-500">
              Formatos admitidos: PNG, JPG, SVG o WEBP (máx. 2 MB)
            </p>
          </label>
        </div>
      </div>

      {/* Si hay logo activo, controles de tamaño y eliminación */}
      {state.logoUrl && (
        <div class="glass-subtle p-4 rounded-2xl space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Ajuste de Logo Centrado
            </span>
            <button
              type="button"
              onClick={handleRemoveLogo}
              class="text-xs font-medium text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
            >
              Quitar logo
            </button>
          </div>

          <div>
            <div class="flex items-center justify-between text-xs mb-1.5">
              <span class="text-zinc-600 dark:text-zinc-400">Escala del Logo:</span>
              <span class="font-mono text-zinc-500">{Math.round(state.logoSize * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.15"
              max="0.38"
              step="0.02"
              value={state.logoSize}
              onInput={(e) => onChange({ logoSize: Number((e.target as HTMLInputElement).value) })}
              class="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:accent-zinc-100"
            />
            <p class="text-[10px] text-zinc-400 mt-1">
              Máximo 38% para evitar obstruir los patrones críticos de lectura óptica.
            </p>
          </div>

          <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2">
            <span class="text-base leading-none">🛡️</span>
            <div>
              <span class="font-bold">Corrección de Error Reed-Solomon H (30%) activada:</span>
              <p class="text-[11px] opacity-90 mt-0.5">
                Garantiza que el código continúe siendo 100% escaneable incluso con la obstrucción central del logotipo.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
