// src/tools/qr-generator/components/QrLiveCanvas.tsx
import { useEffect, useRef, useState } from 'preact/hooks';
import type { QrOptionsState } from '../types';
import { renderQrCode, buildEngineOptions } from '../engine/qrRenderer';

interface Props {
  state: QrOptionsState;
  size?: number;
  className?: string;
  onCanvasReady?: (canvas: HTMLCanvasElement | null) => void;
}

export default function QrLiveCanvas({ state, size = 240, className = '', onCanvasReady }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function update() {
      if (!containerRef.current) return;
      try {
        setIsLoading(true);
        setError(null);

        const options = buildEngineOptions(state, size);
        await renderQrCode(containerRef.current, options);

        if (!isCancelled) {
          setIsLoading(false);
          const canvas = containerRef.current.querySelector('canvas');
          if (onCanvasReady) {
            onCanvasReady(canvas);
          }
        }
      } catch (err: any) {
        console.error('Error al renderizar QR en vivo:', err);
        if (!isCancelled) {
          setIsLoading(false);
          setError('No se pudo generar el código con los datos actuales.');
          if (onCanvasReady) {
            onCanvasReady(null);
          }
        }
      }
    }

    update();

    return () => {
      isCancelled = true;
    };
  }, [state, size]);

  return (
    <div
      class={`relative flex items-center justify-center select-none overflow-hidden ${className}`}
      style={{ minWidth: `${size}px`, minHeight: `${size}px` }}
    >
      <div
        ref={containerRef}
        class="w-full h-full flex items-center justify-center [&>canvas]:max-w-full [&>canvas]:h-auto [&>canvas]:rounded-md"
        aria-label="Código QR generado en vivo"
      />

      {isLoading && (
        <div class="absolute inset-0 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-[1px] flex items-center justify-center transition-opacity">
          <div class="w-5 h-5 rounded-full border-2 border-neutral-300 dark:border-neutral-700 border-t-neutral-900 dark:border-t-white animate-spin" />
        </div>
      )}

      {error && (
        <div class="absolute inset-0 bg-neutral-100 dark:bg-neutral-900 flex flex-col items-center justify-center p-4 text-center text-xs text-neutral-600 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 rounded-lg">
          <p class="font-medium text-neutral-900 dark:text-white mb-1">Aviso</p>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
