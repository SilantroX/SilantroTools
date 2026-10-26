// src/tools/qr-generator/components/QrPreviewCard.tsx
import { useEffect, useRef, useState } from 'preact/hooks';
import type { QrOptionsState } from '../types';
import { getQrEngine, buildEngineOptions, downloadQr, buildQrPayload } from '../engine/qrRenderer';

interface Props {
  state: QrOptionsState;
  onChange: (updates: Partial<QrOptionsState>) => void;
}

export default function QrPreviewCard({ state, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [copyPayloadStatus, setCopyPayloadStatus] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [showPayloadInspector, setShowPayloadInspector] = useState(false);

  const payload = buildQrPayload(state);

  useEffect(() => {
    let isCancelled = false;

    async function render() {
      try {
        setRenderError(null);
        // Renderizamos a 240px para una vista previa nítida y compacta
        const options = buildEngineOptions(state, 240);
        const engine = await getQrEngine(options);

        if (!isCancelled && containerRef.current) {
          containerRef.current.innerHTML = '';
          engine.append(containerRef.current);
        }
      } catch (err: any) {
        console.error('Error al renderizar QR:', err);
        if (!isCancelled) {
          setRenderError('Error al renderizar el código QR. Revisa los datos de entrada.');
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
      console.error('Error al exportar archivo:', err);
      alert('Hubo un error al generar la exportación.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      if (!containerRef.current) return;
      const canvas = containerRef.current.querySelector('canvas');
      if (!canvas) {
        setCopyStatus('error');
        setTimeout(() => setCopyStatus('idle'), 2500);
        return;
      }

      canvas.toBlob(async (blob) => {
        if (!blob) {
          setCopyStatus('error');
          setTimeout(() => setCopyStatus('idle'), 2500);
          return;
        }
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          setCopyStatus('success');
          setTimeout(() => setCopyStatus('idle'), 2500);
        } catch {
          setCopyStatus('error');
          setTimeout(() => setCopyStatus('idle'), 2500);
        }
      }, 'image/png');
    } catch {
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2500);
    }
  };

  const handleCopyPayload = async () => {
    try {
      await navigator.clipboard.writeText(payload);
      setCopyPayloadStatus(true);
      setTimeout(() => setCopyPayloadStatus(false), 2000);
    } catch {
      // noop
    }
  };

  return (
    <div class="surface-card p-4 sm:p-5 flex flex-col items-center">
      {/* Barra Técnica Superior */}
      <div class="w-full flex items-center justify-between pb-2.5 border-b border-neutral-200 dark:border-neutral-800 font-mono text-xs">
        <div class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-neutral-900 dark:bg-white animate-pulse" aria-hidden="true"></span>
          <span class="font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider text-[11px]">
            Vista Previa
          </span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="text-[10px] text-neutral-500 uppercase tracking-wider">Redundancia:</span>
          <span class="px-1.5 py-0.2 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 text-[10px] font-bold text-neutral-800 dark:text-neutral-200">
            {state.errorCorrectionLevel}
          </span>
        </div>
      </div>

      {/* Contenedor del Lienzo QR Compacto */}
      <div class="my-3.5 relative w-full max-w-[240px] aspect-square flex items-center justify-center p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white shadow-xs">
        <div
          ref={containerRef}
          class="w-full h-full flex items-center justify-center [&>canvas]:max-w-full [&>canvas]:h-auto [&>canvas]:rounded"
          aria-label="Código QR generado en vivo"
        >
          <span class="font-mono text-xs text-neutral-400">
            Renderizando...
          </span>
        </div>

        {renderError && (
          <div class="absolute inset-0 bg-neutral-100 dark:bg-neutral-900 rounded-lg flex items-center justify-center p-3 text-center font-mono text-xs text-neutral-900 dark:text-neutral-100 border border-neutral-400">
            {renderError}
          </div>
        )}
      </div>

      {/* Selector de Resolución / Tamaño */}
      <div class="w-full pt-3 border-t border-neutral-200 dark:border-neutral-800 space-y-1.5">
        <div class="flex items-center justify-between font-mono text-xs">
          <span class="text-neutral-500 text-[11px]">Resolución:</span>
          <span class="text-neutral-900 dark:text-neutral-100 font-semibold text-[11px]">
            {state.downloadSize} × {state.downloadSize} px
          </span>
        </div>

        <div class="grid grid-cols-3 gap-1.5">
          {[
            { size: 512, label: '512 px', tag: 'Web' },
            { size: 1024, label: '1024 px', tag: 'Print' },
            { size: 2048, label: '2048 px', tag: 'HD' },
          ].map((item) => {
            const isSelected = state.downloadSize === item.size;
            return (
              <button
                key={item.size}
                type="button"
                onClick={() => onChange({ downloadSize: item.size })}
                class={`py-1 px-1.5 rounded text-xs font-mono border transition-all text-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white ${
                  isSelected
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold border-neutral-900 dark:border-white'
                    : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                }`}
                aria-pressed={isSelected}
              >
                <span class="block text-[11px] leading-tight">{item.label}</span>
                <span class={`block text-[9px] ${isSelected ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-400'}`}>
                  {item.tag}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Botones de Descarga */}
      <div class="grid grid-cols-2 gap-2 w-full mt-3">
        <button
          type="button"
          disabled={isExporting}
          onClick={() => handleDownload('png')}
          class="btn-primary w-full py-2 text-xs"
          title="Descargar imagen rasterizada en PNG"
          aria-label="Descargar código QR en formato PNG"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          <span>{isExporting ? 'Exportando...' : 'PNG'}</span>
        </button>

        <button
          type="button"
          disabled={isExporting}
          onClick={() => handleDownload('svg')}
          class="btn-secondary w-full py-2 text-xs"
          title="Descargar gráfico vectorial escalable en SVG"
          aria-label="Descargar código QR en formato vectorial SVG"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <span>Vector SVG</span>
        </button>
      </div>

      {/* Copiar Portapapeles Rápido */}
      <button
        type="button"
        onClick={handleCopyToClipboard}
        class="mt-2 w-full py-1.5 px-2.5 rounded text-xs font-mono text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
        aria-live="polite"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.849A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.599m7.332 0c.055.194.084.4.084.611v.006a1.5 1.5 0 01-1.5 1.5H9.75a1.5 1.5 0 01-1.5-1.5v-.006c0-.211.029-.417.084-.611m7.332 0H18a2.25 2.25 0 012.25 2.25v13.5A2.25 2.25 0 0118 21.75H6a2.25 2.25 0 01-2.25-2.25V6a2.25 2.25 0 012.25-2.25h1.5" />
        </svg>
        <span>
          {copyStatus === 'success' && '✓ Copiado al portapapeles'}
          {copyStatus === 'error' && '✗ No soportado en este navegador'}
          {copyStatus === 'idle' && 'Copiar imagen'}
        </span>
      </button>

      {/* Inspector de Datos Decodificados (Transparencia Total) */}
      <div class="w-full mt-3 pt-2.5 border-t border-neutral-200 dark:border-neutral-800">
        <button
          type="button"
          onClick={() => setShowPayloadInspector(!showPayloadInspector)}
          class="w-full flex items-center justify-between text-[11px] font-mono text-neutral-500 hover:text-neutral-950 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white rounded py-0.5 px-1"
          aria-expanded={showPayloadInspector}
        >
          <span>Carga decodificada</span>
          <span class="text-[10px]">{showPayloadInspector ? '▲ Ocultar' : '▼ Ver datos'}</span>
        </button>

        {showPayloadInspector && (
          <div class="mt-2 p-2.5 rounded bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/80 space-y-1.5">
            <div class="flex items-center justify-between text-[10px] font-mono text-neutral-500">
              <span>Sintaxis óptica:</span>
              <button
                type="button"
                onClick={handleCopyPayload}
                class="hover:text-neutral-900 dark:hover:text-white underline"
              >
                {copyPayloadStatus ? '✓ Copiado' : 'Copiar texto'}
              </button>
            </div>
            <pre class="font-mono text-[10px] text-neutral-800 dark:text-neutral-200 break-all whitespace-pre-wrap max-h-24 overflow-y-auto">
              {payload}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
