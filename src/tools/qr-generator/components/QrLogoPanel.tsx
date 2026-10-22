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
      {/* Botón de Marca: Silantro Labs */}
      <div>
        <label class="block font-mono text-[11px] uppercase tracking-wider text-neutral-500 mb-2.5">
          03.1 / Insignia Oficial Silantro Labs
        </label>
        <button
          type="button"
          onClick={handleToggleSilantroLogo}
          class={`w-full p-3.5 rounded border text-left transition-colors flex items-center justify-between ${
            state.isBrandLogoActive
              ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 border-neutral-900 dark:border-neutral-100'
              : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
          }`}
        >
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded border border-neutral-300 dark:border-neutral-700 overflow-hidden flex items-center justify-center bg-white flex-shrink-0">
              <img
                src={SILANTRO_LOGO_PATH}
                alt="Silantro Labs Logo"
                class="w-full h-full object-cover"
              />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-semibold text-xs tracking-tight">Logo Silantro Labs</span>
                <span class={`font-mono text-[10px] uppercase px-1.5 py-0.2 rounded border ${
                  state.isBrandLogoActive
                    ? 'border-white/30 text-white dark:border-black/30 dark:text-black'
                    : 'border-neutral-300 dark:border-neutral-700 text-neutral-500'
                }`}>
                  {state.isBrandLogoActive ? 'Incrustado' : 'Click para activar'}
                </span>
              </div>
              <p class={`text-[11px] mt-0.5 ${state.isBrandLogoActive ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-500'}`}>
                Incrusta la marca en el centro del código QR
              </p>
            </div>
          </div>
          <span class="font-mono text-xs">
            {state.isBrandLogoActive ? '[ ON ]' : '[ OFF ]'}
          </span>
        </button>
      </div>

      {/* Carga de Logo Propio */}
      <div>
        <label class="block font-mono text-[11px] uppercase tracking-wider text-neutral-500 mb-2.5">
          03.2 / Carga de Marca Personal o Corporativa
        </label>
        <div class="p-6 rounded border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/30 text-center hover:border-neutral-500 transition-colors">
          <input
            id="custom-logo-file"
            type="file"
            accept="image/png, image/jpeg, image/svg+xml, image/webp"
            class="hidden"
            onChange={handleCustomFileUpload}
          />
          <label for="custom-logo-file" class="cursor-pointer block">
            <span class="text-xs font-semibold text-neutral-900 dark:text-neutral-100 underline underline-offset-2">
              Seleccionar archivo de imagen local
            </span>
            <p class="font-mono text-[11px] text-neutral-400 mt-1">
              Formatos: PNG, JPG, SVG o WEBP (procesado exclusivamente en memoria)
            </p>
          </label>
        </div>
      </div>

      {/* Controles de Escala si hay Logo */}
      {state.logoUrl && (
        <div class="p-4 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-900/40 space-y-4">
          <div class="flex items-center justify-between">
            <span class="font-mono text-[11px] uppercase tracking-wider text-neutral-500">
              Escala de Logo Centrado
            </span>
            <button
              type="button"
              onClick={handleRemoveLogo}
              class="font-mono text-xs text-neutral-500 hover:text-neutral-950 dark:hover:text-white underline"
            >
              [ Remover logo ]
            </button>
          </div>

          <div>
            <div class="flex items-center justify-between text-xs mb-1.5 font-mono">
              <span class="text-neutral-500">Proporción:</span>
              <span class="text-neutral-900 dark:text-neutral-100">{Math.round(state.logoSize * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.15"
              max="0.36"
              step="0.02"
              value={state.logoSize}
              onInput={(e) => onChange({ logoSize: Number((e.target as HTMLInputElement).value) })}
              class="w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded appearance-none cursor-pointer accent-neutral-900 dark:accent-neutral-100"
            />
          </div>

          <div class="p-3 rounded border border-neutral-200 dark:border-neutral-800 font-mono text-[11px] text-neutral-600 dark:text-neutral-400 space-y-1">
            <span class="font-semibold text-neutral-900 dark:text-neutral-100 block">
              Reed-Solomon Nivel H (30%) Activo
            </span>
            <p>
              El código reserva un 30% de redundancia matemática para evitar pérdida de legibilidad óptica con el logotipo superpuesto.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
