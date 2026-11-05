// src/tools/image-compressor/components/ImageCompareView.tsx
import { useState, useRef, useEffect } from 'preact/hooks';
import type { CompressionResult, ImageSourceInfo } from '../types';

interface ImageCompareViewProps {
  imageInfo: ImageSourceInfo;
  result: CompressionResult | null;
  isProcessing: boolean;
}

type ViewMode = 'split' | 'optimized' | 'original';

export default function ImageCompareView({
  imageInfo,
  result,
  isProcessing,
}: ImageCompareViewProps) {
  const [sliderPos, setSliderPos] = useState(50); // 0 a 100%
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clampedX = Math.max(0, Math.min(x, rect.width));
    const percentage = (clampedX / rect.width) * 100;
    setSliderPos(Math.round(percentage));
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging]);

  const previewSrc = result ? result.url : imageInfo.previewUrl;

  return (
    <div class="surface-card p-4 sm:p-5 flex flex-col gap-3 min-w-0 max-w-full">
      {/* Barra de Controles de Vista */}
      <div class="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2.5">
        <span class="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
          <span>Comparar antes y después</span>
          {isProcessing && (
            <span class="inline-block w-2 h-2 rounded-full bg-neutral-900 dark:bg-white animate-pulse" aria-hidden="true" />
          )}
        </span>

        <div class="inline-flex rounded-lg border border-neutral-200 dark:border-neutral-800 p-0.5 bg-neutral-100 dark:bg-neutral-900 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('split')}
            class={`px-2.5 py-0.5 rounded-md cursor-pointer transition-colors ${
              viewMode === 'split'
                ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white font-medium shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Dividida
          </button>
          <button
            type="button"
            onClick={() => setViewMode('optimized')}
            class={`px-2.5 py-0.5 rounded-md cursor-pointer transition-colors ${
              viewMode === 'optimized'
                ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white font-medium shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Optimizada
          </button>
          <button
            type="button"
            onClick={() => setViewMode('original')}
            class={`px-2.5 py-0.5 rounded-md cursor-pointer transition-colors ${
              viewMode === 'original'
                ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white font-medium shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Original
          </button>
        </div>
      </div>

      {/* Contenedor del Visor */}
      <div
        ref={containerRef}
        class="relative w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 overflow-hidden select-none flex items-center justify-center min-h-[260px] sm:min-h-[320px] max-h-[480px]"
        style={{
          backgroundImage:
            'radial-gradient(var(--border-subtle) 1px, transparent 0)',
          backgroundSize: '16px 16px',
        }}
      >
        {viewMode === 'original' && (
          <img
            src={imageInfo.previewUrl}
            alt="Foto original"
            class="max-h-[480px] w-auto max-w-full object-contain mx-auto"
          />
        )}

        {viewMode === 'optimized' && (
          <img
            src={previewSrc}
            alt="Foto optimizada"
            class="max-h-[480px] w-auto max-w-full object-contain mx-auto"
          />
        )}

        {viewMode === 'split' && (
          <div class="relative w-full h-full flex items-center justify-center min-h-[260px] sm:min-h-[320px] max-h-[480px]">
            {/* Capa Inferior: Imagen Optimizada */}
            <img
              src={previewSrc}
              alt="Foto optimizada"
              class="max-h-[480px] w-auto max-w-full object-contain block mx-auto pointer-events-none"
            />

            {/* Capa Superior Recortada: Imagen Original */}
            <div
              class="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center"
              style={{
                clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
              }}
            >
              <img
                src={imageInfo.previewUrl}
                alt="Foto original"
                class="max-h-[480px] w-auto max-w-full object-contain block mx-auto"
              />
            </div>

            {/* Línea Divisoria y Tirador de Desplazamiento */}
            <div
              class="absolute top-0 bottom-0 w-0.5 bg-white dark:bg-neutral-200 cursor-ew-resize z-20 shadow-md touch-none"
              style={{ left: `${sliderPos}%` }}
              onPointerDown={handlePointerDown}
            >
              <div class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 shadow-md flex items-center justify-center text-[10px] text-neutral-800 dark:text-neutral-200 select-none cursor-ew-resize">
                ◄►
              </div>
            </div>

            {/* Etiquetas Superpuestas */}
            <div class="absolute top-3 left-3 px-2 py-1 rounded bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium tracking-wide pointer-events-none z-10">
              Original
            </div>
            <div class="absolute top-3 right-3 px-2 py-1 rounded bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium tracking-wide pointer-events-none z-10">
              Optimizada
            </div>
          </div>
        )}
      </div>

      <div class="text-[11px] text-neutral-500 dark:text-neutral-400 text-center">
        {viewMode === 'split'
          ? 'Arrastra la barra en el centro para comparar la nitidez de la foto original frente a la optimizada.'
          : 'Alterna entre los botones de arriba para inspeccionar los detalles de cada versión.'}
      </div>
    </div>
  );
}
