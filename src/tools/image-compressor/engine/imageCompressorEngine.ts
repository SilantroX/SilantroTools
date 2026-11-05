// src/tools/image-compressor/engine/imageCompressorEngine.ts
import type { CompressionOptions, CompressionResult, OutputFormat } from '../types';
import { clampSafeDimensions } from './imageDimensions';

/**
 * Carga un archivo de imagen en un elemento ImageBitmap o HTMLImageElement con compatibilidad universal.
 */
export async function loadImageSource(file: File): Promise<{
  source: ImageBitmap | HTMLImageElement;
  width: number;
  height: number;
  cleanup: () => void;
}> {
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file);
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        cleanup: () => {
          bitmap.close();
        },
      };
    } catch {
      // Si falla createImageBitmap, recurrir al método estándar HTMLImageElement
    }
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      resolve({
        source: img,
        width: img.naturalWidth,
        height: img.naturalHeight,
        cleanup: () => {
          URL.revokeObjectURL(url);
        },
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('No se pudo decodificar la imagen seleccionada.'));
    };
    img.src = url;
  });
}

/**
 * Convierte un Canvas a Blob usando una Promesa tipada.
 */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: OutputFormat,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Error al serializar el canvas a Blob.'));
        }
      },
      format,
      format === 'image/png' ? undefined : quality
    );
  });
}

/**
 * Dibuja la imagen en un Canvas aplicando dimensiones, fondo para JPEG y filtros opcionales.
 */
export function drawImageOnCanvas(
  source: CanvasImageSource,
  targetWidth: number,
  targetHeight: number,
  options: {
    format: OutputFormat;
    grayscale?: boolean;
    highContrast?: boolean;
  }
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const { width, height } = clampSafeDimensions(targetWidth, targetHeight);
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d', { alpha: options.format !== 'image/jpeg' });
  if (!ctx) {
    throw new Error('No se pudo inicializar el contexto 2D del Canvas.');
  }

  // Si el destino es JPEG, llenar el fondo de blanco para evitar zonas transparentes negras
  if (options.format === 'image/jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
  }

  // Filtros visuales (documentos escaneados, blanco y negro)
  const filters: string[] = [];
  if (options.grayscale) {
    filters.push('grayscale(100%)');
  }
  if (options.highContrast) {
    filters.push('contrast(135%)');
  }

  if (filters.length > 0) {
    ctx.filter = filters.join(' ');
  } else {
    ctx.filter = 'none';
  }

  // Suavizado bicúbico de alta calidad
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(source, 0, 0, width, height);

  return canvas;
}

/**
 * Ejecuta el proceso completo de compresión y optimización en cliente.
 */
export async function compressImage(
  sourceImage: ImageBitmap | HTMLImageElement,
  originalFileSize: number,
  options: CompressionOptions,
  customQuality?: number
): Promise<CompressionResult> {
  const startTime = performance.now();

  const effectiveQuality = customQuality !== undefined ? customQuality : options.quality;

  // 1. Dibujar en canvas con redimensionado y filtros
  const canvas = drawImageOnCanvas(sourceImage, options.customWidth, options.customHeight, {
    format: options.format,
    grayscale: options.grayscale,
    highContrast: options.highContrast,
  });

  // 2. Codificar a Blob
  const blob = await canvasToBlob(canvas, options.format, effectiveQuality);
  const size = blob.size;
  const url = URL.createObjectURL(blob);

  const savingsBytes = Math.max(0, originalFileSize - size);
  const savingsPercentage = originalFileSize > 0 ? (savingsBytes / originalFileSize) * 100 : 0;
  const processingTimeMs = Math.round(performance.now() - startTime);

  return {
    blob,
    url,
    size,
    width: canvas.width,
    height: canvas.height,
    format: options.format,
    savingsPercentage: parseFloat(savingsPercentage.toFixed(1)),
    savingsBytes,
    effectiveQuality,
    processingTimeMs,
  };
}
