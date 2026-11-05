// src/tools/image-compressor/engine/imageDimensions.ts

/**
 * Formatea un número de bytes en una cadena legible por humanos (B, KB, MB).
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 B';
  if (bytes < 0) return '0 B';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const idx = Math.min(i, sizes.length - 1);

  return `${parseFloat((bytes / Math.pow(k, idx)).toFixed(dm))} ${sizes[idx]}`;
}

/**
 * Calcula dimensiones manteniendo la proporción de aspecto.
 */
export function calculateAspectDimensions(
  originalWidth: number,
  originalHeight: number,
  newWidth?: number,
  newHeight?: number
): { width: number; height: number } {
  if (!originalWidth || !originalHeight) {
    return { width: 1, height: 1 };
  }

  const aspectRatio = originalWidth / originalHeight;

  if (newWidth && !newHeight) {
    const calculatedHeight = Math.round(newWidth / aspectRatio);
    return { width: Math.max(1, Math.round(newWidth)), height: Math.max(1, calculatedHeight) };
  }

  if (newHeight && !newWidth) {
    const calculatedWidth = Math.round(newHeight * aspectRatio);
    return { width: Math.max(1, calculatedWidth), height: Math.max(1, Math.round(newHeight)) };
  }

  if (newWidth && newHeight) {
    return { width: Math.max(1, Math.round(newWidth)), height: Math.max(1, Math.round(newHeight)) };
  }

  return { width: originalWidth, height: originalHeight };
}

/**
 * Clampea dimensiones a límites seguros para evitar fallos de memoria en Canvas de móviles.
 */
export const MAX_SAFE_CANVAS_DIMENSION = 8192;

export function clampSafeDimensions(width: number, height: number): { width: number; height: number } {
  if (width <= MAX_SAFE_CANVAS_DIMENSION && height <= MAX_SAFE_CANVAS_DIMENSION) {
    return { width, height };
  }

  const ratio = width / height;
  if (width > height) {
    return {
      width: MAX_SAFE_CANVAS_DIMENSION,
      height: Math.round(MAX_SAFE_CANVAS_DIMENSION / ratio),
    };
  } else {
    return {
      width: Math.round(MAX_SAFE_CANVAS_DIMENSION * ratio),
      height: MAX_SAFE_CANVAS_DIMENSION,
    };
  }
}
