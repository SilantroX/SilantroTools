// src/tools/qr-generator/engine/qrRenderer.ts
import type QRCodeStyling from 'qr-code-styling';
import type { Options, FileExtension } from 'qr-code-styling';
import type { QrOptionsState } from '../types';

let qrInstance: QRCodeStyling | null = null;

/**
 * Convierte el estado de la aplicación en el string de carga útil estándar del QR
 */
export function buildQrPayload(state: QrOptionsState): string {
  switch (state.contentType) {
    case 'url': {
      const text = state.rawText.trim();
      return text || 'https://tools.silantrolabs.com';
    }

    case 'text':
      return state.rawText.trim() || 'Silantro Tools';

    case 'wifi': {
      const { ssid, password, encryption, hidden } = state.wifi;
      const cleanSsid = (ssid || 'MiWiFi').replace(/([\\;,:"])/g, '\\$1');
      const cleanPass = (password || '').replace(/([\\;,:"])/g, '\\$1');
      const hiddenFlag = hidden ? 'H:true;' : '';
      return `WIFI:S:${cleanSsid};T:${encryption};P:${cleanPass};${hiddenFlag};`;
    }

    case 'email': {
      const email = state.emailAddress.trim();
      const params = new URLSearchParams();
      if (state.emailSubject) params.set('subject', state.emailSubject);
      if (state.emailBody) params.set('body', state.emailBody);
      const queryString = params.toString();
      return `mailto:${email}${queryString ? `?${queryString}` : ''}`;
    }

    case 'vcard': {
      const { firstName, lastName, phone, email, organization, url } = state.vcard;
      return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${lastName || ''};${firstName || ''};;;`,
        `FN:${`${firstName || ''} ${lastName || ''}`.trim() || 'Contacto'}`,
        organization ? `ORG:${organization}` : '',
        phone ? `TEL;TYPE=CELL:${phone}` : '',
        email ? `EMAIL:${email}` : '',
        url ? `URL:${url}` : '',
        'END:VCARD',
      ]
        .filter(Boolean)
        .join('\n');
    }

    default:
      return 'https://tools.silantrolabs.com';
  }
}

/**
 * Obtiene o crea la instancia singleton de QRCodeStyling en el navegador
 */
export async function getQrEngine(options: Options): Promise<QRCodeStyling> {
  if (typeof window === 'undefined') {
    throw new Error('QRCodeStyling solo puede ejecutarse en el navegador del cliente');
  }

  if (!qrInstance) {
    const { default: QRCodeStylingModule } = await import('qr-code-styling');
    qrInstance = new QRCodeStylingModule(options);
  } else {
    qrInstance.update(options);
  }

  return qrInstance;
}

/**
 * Construye el objeto de configuración tipado para QRCodeStyling
 */
export function buildEngineOptions(state: QrOptionsState, size: number = 320): Options {
  const payload = buildQrPayload(state);

  return {
    width: size,
    height: size,
    type: 'canvas',
    data: payload,
    margin: state.margin,
    qrOptions: {
      errorCorrectionLevel: state.errorCorrectionLevel,
    },
    image: state.logoUrl,
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: state.logoSize,
      margin: 4,
      crossOrigin: 'anonymous',
    },
    dotsOptions: {
      color: state.dotsColor,
      type: state.dotsType,
    },
    backgroundOptions: {
      color: state.bgColor,
    },
    cornersSquareOptions: {
      color: state.cornersSquareColor || state.dotsColor,
      type: state.cornersSquareType,
    },
    cornersDotOptions: {
      color: state.cornersDotColor || state.dotsColor,
      type: state.cornersDotType,
    },
  };
}

/**
 * Descarga el código QR con el tamaño y formato deseado
 */
export async function downloadQr(state: QrOptionsState, format: FileExtension = 'png'): Promise<void> {
  const highResOptions = buildEngineOptions(state, state.downloadSize);
  
  if (format === 'svg') {
    highResOptions.type = 'svg';
  }

  const { default: QRCodeStylingModule } = await import('qr-code-styling');
  const exporter = new QRCodeStylingModule(highResOptions);

  await exporter.download({
    name: `silantro-qr-${Date.now()}`,
    extension: format,
  });
}
