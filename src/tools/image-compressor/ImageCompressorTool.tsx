// src/tools/image-compressor/ImageCompressorTool.tsx
import { useState, useEffect, useRef } from 'preact/hooks';
import type {
  ImageSourceInfo,
  CompressionOptions,
  CompressionResult,
  TabId,
} from './types';
import { loadImageSource, compressImage } from './engine/imageCompressorEngine';
import { findOptimalQualityForTargetSize } from './engine/targetSizeFinder';
import ImageDropzone from './components/ImageDropzone';
import CompressionControls from './components/CompressionControls';
import ResizeControls from './components/ResizeControls';
import ImageCompareView from './components/ImageCompareView';
import CompressionMetricsBar from './components/CompressionMetricsBar';

const DEFAULT_OPTIONS: CompressionOptions = {
  format: 'image/webp',
  mode: 'quality',
  quality: 0.8,
  targetSizeKb: 500,
  scalePercent: 100,
  customWidth: 0,
  customHeight: 0,
  maintainAspectRatio: true,
  grayscale: false,
  highContrast: false,
};

export default function ImageCompressorTool() {
  const [imageInfo, setImageInfo] = useState<ImageSourceInfo | null>(null);
  const [options, setOptions] = useState<CompressionOptions>(DEFAULT_OPTIONS);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('compress');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Referencias a blobs y URLs activas para evitar fugas de memoria
  const activeResultUrlRef = useRef<string | null>(null);
  const debounceTimerRef = useRef<number | null>(null);

  // Carga y decodificación de nueva imagen
  const handleFileSelected = async (file: File) => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Liberar URL previa si existía
      if (imageInfo?.previewUrl) {
        URL.revokeObjectURL(imageInfo.previewUrl);
      }
      if (activeResultUrlRef.current) {
        URL.revokeObjectURL(activeResultUrlRef.current);
        activeResultUrlRef.current = null;
      }

      const { width, height } = await loadImageSource(file);
      const previewUrl = URL.createObjectURL(file);

      const info: ImageSourceInfo = {
        file,
        name: file.name,
        originalSize: file.size,
        originalWidth: width,
        originalHeight: height,
        aspectRatio: width / height,
        previewUrl,
        mimeType: file.type,
      };

      setImageInfo(info);
      setOptions((prev) => ({
        ...prev,
        customWidth: width,
        customHeight: height,
        scalePercent: 100,
      }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al procesar la imagen seleccionada.';
      setErrorMessage(msg);
      setIsProcessing(false);
    }
  };

  // Restablecer herramienta al estado inicial
  const handleReset = () => {
    if (imageInfo?.previewUrl) {
      URL.revokeObjectURL(imageInfo.previewUrl);
    }
    if (activeResultUrlRef.current) {
      URL.revokeObjectURL(activeResultUrlRef.current);
      activeResultUrlRef.current = null;
    }
    setImageInfo(null);
    setResult(null);
    setOptions(DEFAULT_OPTIONS);
    setErrorMessage(null);
  };

  // Actualizar opciones
  const handleOptionsChange = (updates: Partial<CompressionOptions>) => {
    setOptions((prev) => ({ ...prev, ...updates }));
  };

  // Efecto reactivo: re-ejecutar compresión con debounce adaptativo cuando cambian las opciones o la imagen
  useEffect(() => {
    if (!imageInfo) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setIsProcessing(true);

    debounceTimerRef.current = window.setTimeout(async () => {
      try {
        const { source, cleanup } = await loadImageSource(imageInfo.file);

        let newResult: CompressionResult;
        if (options.mode === 'target-size') {
          newResult = await findOptimalQualityForTargetSize(source, imageInfo.originalSize, options);
        } else {
          newResult = await compressImage(source, imageInfo.originalSize, options);
        }

        cleanup();

        // Liberar URL anterior del resultado para no saturar memoria RAM
        if (activeResultUrlRef.current && activeResultUrlRef.current !== newResult.url) {
          URL.revokeObjectURL(activeResultUrlRef.current);
        }
        activeResultUrlRef.current = newResult.url;

        setResult(newResult);
        setIsProcessing(false);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error al optimizar la imagen.';
        setErrorMessage(msg);
        setIsProcessing(false);
      }
    }, 200);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [
    imageInfo?.file,
    options.format,
    options.mode,
    options.quality,
    options.targetSizeKb,
    options.customWidth,
    options.customHeight,
    options.grayscale,
    options.highContrast,
  ]);

  const tabs: Array<{ id: TabId; num: string; label: string }> = [
    { id: 'compress', num: '01', label: 'Compresión' },
    { id: 'resize', num: '02', label: 'Dimensiones' },
  ];

  return (
    <div class="w-full space-y-4 min-w-0 max-w-full">
      {errorMessage && (
        <div class="p-3.5 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200 text-xs flex items-center justify-between">
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            class="text-xs font-mono underline cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      )}

      {!imageInfo ? (
        /* Estado Inicial: Selector / Dropzone */
        <div class="max-w-2xl mx-auto py-6">
          <ImageDropzone onFileSelected={handleFileSelected} disabled={isProcessing} />
        </div>
      ) : (
        /* Estado Activo: Layout Balanceado en 2 Columnas */
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start min-w-0 max-w-full">
          {/* Columna Izquierda: Panel de Configuración (5 Cols en Desktop) */}
          <div class="lg:col-span-5 flex flex-col gap-3 min-w-0 max-w-full">
            {/* Pestañas de Control */}
            <div class="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-px gap-2 min-w-0 max-w-full">
              <div
                class="flex items-center gap-1 overflow-x-auto min-w-0 flex-1 scrollbar-none py-0.5"
                role="tablist"
              >
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveTab(tab.id)}
                      class={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                      }`}
                    >
                      <span
                        class={`font-mono text-[10px] ${
                          isActive
                            ? 'text-neutral-300 dark:text-neutral-600'
                            : 'text-neutral-400 dark:text-neutral-500'
                        }`}
                      >
                        {tab.num}
                      </span>
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleReset}
                class="btn-ghost text-xs cursor-pointer text-neutral-500 hover:text-neutral-950 dark:hover:text-white"
                title="Cambiar imagen"
              >
                ↺ Cambiar
              </button>
            </div>

            {/* Contenido de la Pestaña Activa */}
            <div class="surface-card p-4 sm:p-5">
              {activeTab === 'compress' && (
                <CompressionControls options={options} onChange={handleOptionsChange} />
              )}
              {activeTab === 'resize' && (
                <ResizeControls
                  imageInfo={imageInfo}
                  options={options}
                  onChange={handleOptionsChange}
                />
              )}

              {/* Barra de Estadísticas y Descarga */}
              <CompressionMetricsBar
                imageInfo={imageInfo}
                result={result}
                isProcessing={isProcessing}
                onReset={handleReset}
              />
            </div>
          </div>

          {/* Columna Derecha: Comparador Visual y Métricas (7 Cols en Desktop) */}
          <div class="lg:col-span-7 flex flex-col gap-4 min-w-0 max-w-full">
            <ImageCompareView
              imageInfo={imageInfo}
              result={result}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      )}
    </div>
  );
}
