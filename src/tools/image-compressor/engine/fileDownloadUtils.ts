// src/tools/image-compressor/engine/fileDownloadUtils.ts
import type { OutputFormat } from '../types';

/**
 * Obtiene la extensión recomendada según el formato MIME.
 */
export function getExtensionFromMime(format: OutputFormat): string {
  switch (format) {
    case 'image/webp':
      return 'webp';
    case 'image/jpeg':
      return 'jpg';
    case 'image/png':
      return 'png';
    default:
      return 'webp';
  }
}

/**
 * Genera un nombre de archivo optimizado limpio.
 */
export function generateOptimizedFilename(originalName: string, format: OutputFormat): string {
  const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
  const cleanBase = baseName
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-');
  const ext = getExtensionFromMime(format);
  return `${cleanBase}-silantro-opt.${ext}`;
}

/**
 * Dispara la descarga directa de un Blob o URL en el navegador.
 */
export function triggerDownload(urlOrBlob: string | Blob, filename: string): void {
  const url = typeof urlOrBlob === 'string' ? urlOrBlob : URL.createObjectURL(urlOrBlob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  if (typeof urlOrBlob !== 'string') {
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  }
}
