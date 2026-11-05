// src/tools/image-compressor/components/CompressionMetricsBar.tsx
import type { CompressionResult, ImageSourceInfo } from '../types';
import { formatBytes } from '../engine/imageDimensions';
import { generateOptimizedFilename, triggerDownload } from '../engine/fileDownloadUtils';

interface CompressionMetricsBarProps {
  imageInfo: ImageSourceInfo;
  result: CompressionResult | null;
  isProcessing: boolean;
  onReset: () => void;
}

export default function CompressionMetricsBar({
  imageInfo,
  result,
  isProcessing,
  onReset,
}: CompressionMetricsBarProps) {
  const handleDownload = () => {
    if (!result) return;
    const filename = generateOptimizedFilename(imageInfo.name, result.format);
    triggerDownload(result.url, filename);
  };

  const isSmaller = result && result.size < imageInfo.originalSize;
  const isLarger = result && result.size > imageInfo.originalSize;

  return (
    <div class="space-y-4 pt-3 border-t border-neutral-200 dark:border-neutral-800">
      {/* Resumen Métrico */}
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {/* Tamaño Original */}
        <div class="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
          <div class="text-[11px] text-neutral-400">Tamaño Original</div>
          <div class="font-mono text-sm font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">
            {formatBytes(imageInfo.originalSize)}
          </div>
          <div class="text-[10px] font-mono text-neutral-400">
            {imageInfo.originalWidth} × {imageInfo.originalHeight} px
          </div>
        </div>

        {/* Tamaño Optimizado */}
        <div class="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
          <div class="text-[11px] text-neutral-400">Tamaño Optimizado</div>
          <div class="font-mono text-sm font-semibold text-neutral-950 dark:text-white mt-0.5">
            {result ? formatBytes(result.size) : '...'}
          </div>
          <div class="text-[10px] font-mono text-neutral-400">
            {result ? `${result.width} × ${result.height} px` : ''}
          </div>
        </div>

        {/* Ahorro Porcentual */}
        <div class="col-span-2 sm:col-span-1 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 flex flex-col justify-center">
          <div class="text-[11px] text-neutral-400">Reducción Total</div>
          <div class="mt-0.5 flex items-baseline gap-1.5">
            {isSmaller && (
              <span class="font-mono text-base font-bold text-neutral-950 dark:text-white">
                -{result.savingsPercentage}%
              </span>
            )}
            {isLarger && (
              <span class="font-mono text-xs text-neutral-500">
                +{(100 - result.savingsPercentage).toFixed(0)}% (sin compresión)
              </span>
            )}
            {!result && <span class="font-mono text-xs text-neutral-400">-</span>}
            {isSmaller && (
              <span class="text-[10px] font-mono text-neutral-400">
                ({formatBytes(result.savingsBytes)} menos)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Botones de Acción */}
      <div class="flex flex-col sm:flex-row items-center gap-2.5">
        <button
          type="button"
          onClick={handleDownload}
          disabled={!result || isProcessing}
          class="btn-primary w-full py-2.5 text-sm cursor-pointer shadow-sm"
        >
          {isProcessing ? (
            <span>Comprimiendo imagen...</span>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>
                Descargar Imagen Optimizada {result ? `(${formatBytes(result.size)})` : ''}
              </span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onReset}
          class="btn-secondary w-full sm:w-auto px-4 py-2.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
        >
          Nueva imagen
        </button>
      </div>
    </div>
  );
}
