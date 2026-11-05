// src/tools/image-compressor/types.ts

export type OutputFormat = 'image/webp' | 'image/jpeg' | 'image/png';

export type OutputFormatExtension = 'webp' | 'jpg' | 'png';

export type CompressionMode = 'quality' | 'target-size';

export interface ImageSourceInfo {
  file: File;
  name: string;
  originalSize: number; // Bytes
  originalWidth: number;
  originalHeight: number;
  aspectRatio: number;
  previewUrl: string;
  mimeType: string;
}

export interface CompressionOptions {
  format: OutputFormat;
  mode: CompressionMode;
  quality: number; // 0.05 a 1.0 (5% a 100%)
  targetSizeKb: number; // p.ej. 500 KB
  scalePercent: number; // 25, 50, 75, 100
  customWidth: number;
  customHeight: number;
  maintainAspectRatio: boolean;
  grayscale: boolean;
  highContrast: boolean;
}

export interface CompressionResult {
  blob: Blob;
  url: string;
  size: number; // Bytes
  width: number;
  height: number;
  format: OutputFormat;
  savingsPercentage: number;
  savingsBytes: number;
  effectiveQuality: number;
  processingTimeMs: number;
}

export type TabId = 'compress' | 'resize' | 'filters';
