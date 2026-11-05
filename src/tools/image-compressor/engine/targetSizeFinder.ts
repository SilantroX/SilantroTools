// src/tools/image-compressor/engine/targetSizeFinder.ts
import type { CompressionOptions, CompressionResult } from '../types';
import { compressImage } from './imageCompressorEngine';

/**
 * Encuentra mediante búsqueda binaria el factor de calidad más alto que produce un archivo
 * cuyo tamaño esté dentro del objetivo especificado en kilobytes (KB).
 */
export async function findOptimalQualityForTargetSize(
  sourceImage: ImageBitmap | HTMLImageElement,
  originalFileSize: number,
  options: CompressionOptions,
  maxIterations: number = 6
): Promise<CompressionResult> {
  const targetBytes = options.targetSizeKb * 1024;

  // Si el formato es PNG sin pérdida, canvas.toBlob no acepta factor de calidad numérico.
  if (options.format === 'image/png') {
    return await compressImage(sourceImage, originalFileSize, options);
  }

  let low = 0.05;
  let high = 0.98;
  let bestResult: CompressionResult | null = null;
  let fallbackResult: CompressionResult | null = null;

  for (let i = 0; i < maxIterations; i++) {
    const midQuality = parseFloat(((low + high) / 2).toFixed(2));
    const result = await compressImage(sourceImage, originalFileSize, options, midQuality);

    if (!fallbackResult || result.size < fallbackResult.size) {
      if (fallbackResult) {
        URL.revokeObjectURL(fallbackResult.url);
      }
      fallbackResult = result;
    } else {
      URL.revokeObjectURL(result.url);
    }

    if (result.size <= targetBytes) {
      // Cumple con el objetivo: guardamos como mejor candidato y probamos una calidad más alta
      if (bestResult) {
        URL.revokeObjectURL(bestResult.url);
      }
      bestResult = result;
      low = midQuality + 0.05;
    } else {
      // Excede el límite de tamaño: debemos bajar la calidad
      high = midQuality - 0.05;
    }

    if (low > high) {
      break;
    }
  }

  // Si encontramos un resultado que cumplió con el tamaño objetivo, liberamos el fallback
  if (bestResult) {
    if (fallbackResult && fallbackResult !== bestResult) {
      URL.revokeObjectURL(fallbackResult.url);
    }
    return bestResult;
  }

  // Si incluso con calidad mínima excedió el objetivo, devolvemos el más pequeño posible
  return fallbackResult || (await compressImage(sourceImage, originalFileSize, options, 0.05));
}
