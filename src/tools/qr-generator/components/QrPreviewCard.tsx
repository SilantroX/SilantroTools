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

  useEffect(() => {
    let isCancelled = false;

    async function render() {
      try {
        setRenderError(null);
        const options = buildEngineOptions(state, 280);
        const engine = await getQrEngine(options);

        if (!isCancelled && containerRef.current) {
          containerRef.current.innerHTML = '';
          engine.append(containerRef.current);
        }
      } catch (err: any) {
        console.error('Error al renderizar QR:', err);
        if (!isCancelled) {
          setRenderError('Error de codificación. Revisa la sintaxis de entrada.');
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
      alert('Error al procesar la exportación del archivo.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      if (!containerRef.current) return;
      const canvas = containerRef.current.querySelector('canvas');
      if (!canvas) {
        alert('Copia directa no soportada en este modo.');
        return;
      }

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        } catch {
          alert('El navegador no permite acceso al portapapeles para blobs.');
        }
      }, 'image/png');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div class="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded p-6 flex flex-col items-center">
      {/* Barra de Estado Monocromática */}
      <div class="w-full flex items-center justify-between mb-4 pb-3 border-b border-neutral-200 dark:border-neutral-800 font-mono text-xs">
        <span class="text-neutral-500 uppercase tracking-wider text-[11px]">
          Previsualización
        </span>
        <span class="text-neutral-900 dark:text-neutral-100">
          ECC: {state.errorCorrectionLevel}
        </span>
      </div>

      {/* Contenedor del Canvas con borde técnico sobrio */}
      <div class="relative w-full max-w-[280px] aspect-square flex items-center justify-center p-2 rounded border border-neutral-200 dark:border-neutral-800 bg-white">
        <div
          ref={containerRef}
          class="w-full h-full flex items-center justify-center [&>canvas]:max-w-full [&>canvas]:h-auto"
        >
          <span class="font-mono text-xs text-neutral-400">
            Renderizando...
          </span>
        </div>

        {renderError && (
          <div class="absolute inset-0 bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center p-4 text-center font-mono text-xs text-neutral-900 dark:text-neutral-100">
            {renderError}
          </div>
        )}
      </div>

      {/* Selector de Resolución */}
      <div class="w-full mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
        <div class="flex items-center justify-between mb-2 font-mono text-xs">
          <span class="text-neutral-500">Resolución:</span>
          <span class="text-neutral-900 dark:text-neutral-100 font-semibold">
            {state.downloadSize}px
          </span>
        </div>
        <div class="grid grid-cols-3 gap-2">
          {[512, 1024, 2048].map((size) => (
            <button
              type="button"
              onClick={() => onChange({ downloadSize: size })}
              class={`py-1 rounded text-xs font-mono border transition-colors ${
                state.downloadSize === size
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-neutral-900 dark:border-neutral-100'
                  : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
              }`}
            >
              {size}px
            </button>
          ))}
        </div>
      </div>

      {/* Botones de Descarga */}
      <div class="grid grid-cols-2 gap-2 w-full mt-4">
        <button
          type="button"
          disabled={isExporting}
          onClick={() => handleDownload('png')}
          class="py-2.5 px-3 rounded bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-950 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          <span>Descargar PNG</span>
        </button>

        <button
          type="button"
          disabled={isExporting}
          onClick={() => handleDownload('svg')}
          class="py-2.5 px-3 rounded border border-neutral-900 dark:border-neutral-100 bg-transparent text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <span>Vector SVG</span>
        </button>
      </div>

      {/* Copiar Portapapeles */}
      <button
        type="button"
        onClick={handleCopyToClipboard}
        class="mt-2 w-full py-1.5 px-3 rounded text-xs font-mono text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors text-center"
      >
        {copySuccess ? '[ Copiado al portapapeles ]' : '[ Copiar imagen rápida ]'}
      </button>
    </div>
  );
}
