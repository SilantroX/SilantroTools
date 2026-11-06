// src/tools/qr-generator/components/Step4Result.tsx
import { useState, useRef } from 'preact/hooks';
import type { QrOptionsState } from '../types';
import type { FileExtension } from 'qr-code-styling';
import { downloadQr, buildQrPayload } from '../engine/qrRenderer';
import QrLiveCanvas from './QrLiveCanvas';

interface Props {
  state: QrOptionsState;
  onChange: (updates: Partial<QrOptionsState>) => void;
  onEditStyle: () => void;
  onReset: () => void;
}

const RESOLUTIONS = [
  { size: 512, label: '512px' },
  { size: 1024, label: '1024px' },
  { size: 2048, label: '2048px' },
];

export default function Step4Result({
  state,
  onChange,
  onEditStyle,
  onReset,
}: Props) {
  const [downloadFormat, setDownloadFormat] = useState<FileExtension>('png');
  const [isExporting, setIsExporting] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showInspector, setShowInspector] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const payload = buildQrPayload(state);

  const handleDownload = async () => {
    try {
      setIsExporting(true);
      await downloadQr(state, downloadFormat);
    } catch (err) {
      console.error('Error al exportar QR:', err);
      alert('Hubo un inconveniente al generar la descarga.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      if (!canvasRef.current) {
        setCopyStatus('error');
        setTimeout(() => setCopyStatus('idle'), 2000);
        return;
      }

      canvasRef.current.toBlob(async (blob) => {
        if (!blob) {
          setCopyStatus('error');
          setTimeout(() => setCopyStatus('idle'), 2000);
          return;
        }
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          setCopyStatus('success');
          setTimeout(() => setCopyStatus('idle'), 2000);
        } catch {
          setCopyStatus('error');
          setTimeout(() => setCopyStatus('idle'), 2000);
        }
      }, 'image/png');
    } catch {
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  return (
    <div class="animate-step-enter max-w-2xl mx-auto space-y-2.5 sm:space-y-3 py-1">
      {/* Título */}
      <div class="text-center sm:text-left">
        <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
          Tu código está listo
        </h2>
      </div>

      {/* Tarjeta de Estudio: Lado a Lado en Desktop, Apilado en Móvil */}
      <div class="surface-card p-3 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-sm">
        {/* Lado QR: Marco Editorial con Passe-Partout */}
        <div class="animate-qr-reveal p-2.5 sm:p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col items-center flex-shrink-0">
          <div class="w-[150px] h-[150px] sm:w-[175px] sm:h-[175px] p-2 rounded-lg bg-white border border-neutral-100 dark:border-neutral-800 flex items-center justify-center shadow-inner">
            <QrLiveCanvas
              state={state}
              size={160}
              className="w-full h-full"
              onCanvasReady={(canvas) => {
                canvasRef.current = canvas;
              }}
            />
          </div>
          <span class="text-[10px] font-mono text-neutral-400 mt-1 uppercase tracking-wider">
            {downloadFormat.toUpperCase()} · {downloadFormat === 'svg' ? 'Vector' : `${state.downloadSize}px`}
          </span>
        </div>

        {/* Lado Controles y Descarga */}
        <div class="flex-1 w-full space-y-2.5">
          {/* Toggle Formato: PNG / SVG */}
          <div class="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Formato de exportación">
            <button
              type="button"
              role="radio"
              aria-checked={downloadFormat === 'png'}
              onClick={() => setDownloadFormat('png')}
              class={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                downloadFormat === 'png'
                  ? 'border-neutral-950 dark:border-white bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-2xs'
                  : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
              }`}
            >
              <span>Imagen PNG</span>
              <span class="text-[9px] opacity-75 font-normal">(Universal)</span>
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={downloadFormat === 'svg'}
              onClick={() => setDownloadFormat('svg')}
              class={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                downloadFormat === 'svg'
                  ? 'border-neutral-950 dark:border-white bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-2xs'
                  : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
              }`}
            >
              <span>Vector SVG</span>
              <span class="text-[9px] opacity-75 font-normal">(Nitidez ∞)</span>
            </button>
          </div>

          {/* Selector de Tamaño si es PNG */}
          {downloadFormat === 'png' && (
            <div class="flex items-center justify-between gap-1 pt-0.5">
              <span class="text-[11px] text-neutral-500 whitespace-nowrap">Resolución:</span>
              <div class="flex items-center gap-1.5">
                {RESOLUTIONS.map((res) => {
                  const isSelected = state.downloadSize === res.size;
                  return (
                    <button
                      key={res.size}
                      type="button"
                      onClick={() => onChange({ downloadSize: res.size })}
                      class={`py-1 px-2.5 rounded-md text-[10px] font-mono border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-neutral-950 dark:border-white bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white font-bold'
                          : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-neutral-400'
                      }`}
                    >
                      {res.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Botón Principal de Descarga (44px) */}
          <button
            type="button"
            disabled={isExporting}
            onClick={handleDownload}
            class="btn-primary w-full py-3 text-xs sm:text-sm font-semibold cursor-pointer shadow-sm flex items-center justify-center gap-2 group active:scale-[0.99] transition-transform"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <span>
              {isExporting ? 'Descargando...' : `Descargar mi código QR (${downloadFormat.toUpperCase()})`}
            </span>
          </button>

          {/* Botones de Acción Secundaria en 1 Fila */}
          <div class="grid grid-cols-3 gap-1.5 pt-1 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={handleCopyToClipboard}
              class="py-2 px-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-[11px] font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center gap-1 cursor-pointer transition-colors"
              title="Copiar imagen al portapapeles"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.849A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.599m7.332 0c.055.194.084.4.084.611v.006a1.5 1.5 0 01-1.5 1.5H9.75a1.5 1.5 0 01-1.5-1.5v-.006c0-.211.029-.417.084-.611m7.332 0H18a2.25 2.25 0 012.25 2.25v13.5A2.25 2.25 0 0118 21.75H6a2.25 2.25 0 01-2.25-2.25V6a2.25 2.25 0 012.25-2.25h1.5" />
              </svg>
              <span>{copyStatus === 'success' ? 'Copiado ✓' : 'Copiar'}</span>
            </button>

            <button
              type="button"
              onClick={onEditStyle}
              class="py-2 px-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-[11px] font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center gap-1 cursor-pointer transition-colors"
              title="Modificar estilo"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
              </svg>
              <span>Estilo</span>
            </button>

            <button
              type="button"
              onClick={onReset}
              class="py-2 px-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-[11px] font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center gap-1 cursor-pointer transition-colors"
              title="Crear un nuevo código QR"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span>Nuevo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Inspector mínimo colapsable */}
      <div class="text-center">
        <button
          type="button"
          onClick={() => setShowInspector(!showInspector)}
          class="text-[10px] text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
        >
          {showInspector ? 'Ocultar datos ▲' : 'Ver datos codificados ▼'}
        </button>
        {showInspector && (
          <div class="mt-1.5 p-2 rounded bg-neutral-100 dark:bg-neutral-900 text-left font-mono text-[10px] text-neutral-700 dark:text-neutral-300 break-all max-h-20 overflow-y-auto">
            {payload}
          </div>
        )}
      </div>
    </div>
  );
}
