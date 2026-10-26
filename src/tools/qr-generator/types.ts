// src/tools/qr-generator/types.ts
import type { DotType, CornerSquareType, CornerDotType, ErrorCorrectionLevel, FileExtension } from 'qr-code-styling';

export type QrContentType = 'url' | 'text' | 'wifi' | 'email' | 'vcard';

export interface WifiData {
  ssid: string;
  password?: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden?: boolean;
}

export interface VCardData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  organization?: string;
  url?: string;
}

export interface QrOptionsState {
  // Contenido
  contentType: QrContentType;
  rawText: string;
  wifi: WifiData;
  vcard: VCardData;
  emailAddress: string;
  emailSubject: string;
  emailBody?: string;

  // Estilo y Forma
  dotsType: DotType;
  cornersSquareType: CornerSquareType;
  cornersDotType: CornerDotType;
  
  // Colores
  dotsColor: string;
  bgColor: string;
  cornersSquareColor: string;
  cornersDotColor: string;

  // Logo & Parámetros
  logoUrl?: string;
  isBrandLogoActive: boolean;
  logoSize: number;
  margin: number;
  errorCorrectionLevel: ErrorCorrectionLevel;
  
  // Dimensiones de exportación
  downloadSize: number; // 512, 1024, 2048
  downloadFormat: FileExtension; // png, svg, webp
}

export interface QrPreset {
  id: string;
  name: string;
  description: string;
  dotsColor: string;
  bgColor: string;
  cornersSquareColor: string;
  cornersDotColor: string;
  dotsType: DotType;
  cornersSquareType: CornerSquareType;
  cornersDotType: CornerDotType;
}
