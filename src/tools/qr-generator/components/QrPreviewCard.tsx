// src/tools/qr-generator/components/QrPreviewCard.tsx
import { useEffect, useRef, useState } from 'preact/hooks';
import type { QrOptionsState } from '../types';
import { getQrEngine, buildEngineOptions, downloadQr } from '../engine/qrRenderer';

interface Props {
  state: QrOptionsState;
  onChange: (updates: Partial<QrOptionsState>) => void;
}

export default function QrPreviewCard({ state, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);

  // Re-renderizar QR cuando cambie el estado
  useEffect(() => {
    let isCancelled = false;

    async function render() {
      try {
        setRenderError(null);
        const options = buildEngineOptions(state, 300);
        const engine = await getQrEngine(options);

        if (!isCancelled && containerRef.current) {
          containerRef.current.innerHTML = '';
          engine.append(containerRef.current);
        }
      } catch (err: any) {
        console.error('Error al renderizar QR:', err);
        if (!isCancelled) {
          setRenderError('No se pudo renderizar el QR. Verifica el formato del contenido.');
        }
      }
    }

    render();
    return () => {
      isCancelled = true;
    };
  }, [state]);

  const handleDownload = async (format: 'png' | 'svg') => {
    try {
      setIsExporting(true);
      await downloadQr(state, format);
    } catch (err) {
      console.error('Error al descargar:', err);
      alert('Hubo un error al generar la descarga.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      if (!containerRef.current) return;
      const canvas = containerRef.current.querySelector('canvas');
      if (!canvas) {
        alert('Copia no disponible en este modo');
        return;
      }

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2500);
        } catch {
          alert('Tu navegador no admite copiar imágenes directamente al portapapeles.');
        }
      }, 'image/png');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div class="glass-panel rounded-3xl p-6 sm:p-7 flex flex-col items-center shadow-lg relative overflow-hidden transition-all duration-300">
      {/* Etiqueta de Marca / Estado */}
      <div class="w-full flex items-center justify-between mb-5">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-xs font-bold tracking-tight text-zinc-800 dark:text-zinc-200">
            Vista Previa en Vivo
          </span>
        </div>
        <span class="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 uppercase">
          ECC: {state.errorCorrectionLevel}
        </span>
      </div>

      {/* Contenedor del Canvas QR con marco suave */}
      <div class="relative w-full max-w-[320px] aspect-square flex items-center justify-center p-3 rounded-2xl bg-white shadow-inner border border-zinc-200/80 dark:border-zinc-800">
        <div
          ref={containerRef}
          class="w-full h-full flex items-center justify-center [&>canvas]:max-w-full [&>canvas]:h-auto [&>canvas]:rounded-lg"
        >
          {/* Fallback de carga inicial */}
          <div class="text-xs text-zinc-400 animate-pulse flex items-center gap-2">
            <svg class="animate-spin w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <span>Generando vista previa...</span>
          </div>
        </div>

        {renderError && (
          <div class="absolute inset-0 bg-red-50/90 dark:bg-zinc-900/95 flex items-center justify-center p-4 text-center text-xs text-red-600 rounded-2xl">
            {renderError}
          </div>
        )}
      </div>

      {/* Selector de Resolución de Descarga */}
      <div class="w-full mt-6 pt-5 border-t border-zinc-200/60 dark:border-zinc-800/80">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            Resolución de Exportación:
          </span>
          <span class="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100">
            {state.downloadSize} × {state.downloadSize} px
          </span>
        </div>
        <div class="grid grid-cols-3 gap-2">
          {[512, 1024, 2048].map((size) => (
            <button
              type="button"
              onClick={() => onChange({ downloadSize: size })}
              class={`py-1.5 rounded-lg text-xs font-mono transition-all ${
                state.downloadSize === size
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold shadow-xs'
                  : 'glass-subtle text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {size}px
            </button>
          ))}
        </div>
      </div>

      {/* Botones Principales de Descarga */}
      <div class="grid grid-cols-2 gap-2.5 w-full mt-4">
        <button
          type="button"
          disabled={isExporting}
          onClick={() => handleDownload('png')}
          class="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
          </svg>
          <span>Bajar PNG</span>
        </button>

        <button
          type="button"
          disabled={isExporting}
          onClick={() => handleDownload('svg')}
          class="w-full py-3 px-4 rounded-xl glass-subtle hover:border-zinc-400 dark:hover:border-zinc-500 text-zinc-900 dark:text-white font-bold text-xs sm:text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 border border-zinc-300 dark:border-zinc-700 disabled:opacity-50"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
          <span>Vector SVG</span>
        </button>
      </div>

      {/* Acciones Secundarias (Copiar al portapapeles) */}
      <button
        type="button"
        onClick={handleCopyToClipboard}
        class="mt-2.5 w-full py-2 px-3 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40 transition-colors flex items-center justify-center gap-1.5"
      >
        {copySuccess ? (
          <>
            <span class="text-emerald-500 font-bold">✓ Copiado al portapapeles</span>
          </>
        ) : (
          <>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="8" y="8" width="12" height="12" rx="2" stroke-width="2"></rect>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2"></path>
            </svg>
            <span>Copiar imagen rápida (PNG)</span>
          </>
        )}
      </button>

      {/* Nota de Privacidad en Cliente */}
      <p class="text-[10px] text-zinc-400 dark:text-zinc-500 mt-4 text-center leading-tight">
        Generado en tu navegador • Cero telemetría de contenido
      </p>
    </div>
  );
}
