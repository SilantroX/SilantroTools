// src/tools/qr-generator/QrTool.tsx
import { useState } from 'preact/hooks';
import type { QrOptionsState } from './types';
import QrInputPanel from './components/QrInputPanel';
import QrStylePanel from './components/QrStylePanel';
import QrLogoPanel from './components/QrLogoPanel';
import QrPreviewCard from './components/QrPreviewCard';

type TabId = 'content' | 'style' | 'logo';

const DEFAULT_STATE: QrOptionsState = {
  contentType: 'url',
  rawText: 'https://silantrolabs.com',
  wifi: {
    ssid: '',
    password: '',
    encryption: 'WPA',
    hidden: false,
  },
  vcard: {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    organization: 'Silantro Labs',
    url: 'https://silantrolabs.com',
  },
  emailAddress: '',
  emailSubject: '',
  emailBody: '',

  dotsType: 'rounded',
  cornersSquareType: 'extra-rounded',
  cornersDotType: 'dot',

  dotsColor: '#09090b',
  bgColor: '#ffffff',
  cornersSquareColor: '#09090b',
  cornersDotColor: '#09090b',

  logoUrl: undefined,
  isBrandLogoActive: false,
  logoSize: 0.26,
  margin: 10,
  errorCorrectionLevel: 'Q',

  downloadSize: 1024,
  downloadFormat: 'png',
};

export default function QrTool() {
  const [activeTab, setActiveTab] = useState<TabId>('content');
  const [qrState, setQrState] = useState<QrOptionsState>(DEFAULT_STATE);

  const handleUpdate = (updates: Partial<QrOptionsState>) => {
    setQrState((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const handleReset = () => {
    if (confirm('¿Quieres volver a los valores iniciales del código QR?')) {
      setQrState(DEFAULT_STATE);
    }
  };

  const tabs: Array<{ id: TabId; num: string; label: string; tag?: string }> = [
    { id: 'content', num: '01', label: 'Contenido' },
    { id: 'style', num: '02', label: 'Diseño' },
    {
      id: 'logo',
      num: '03',
      label: 'Logo',
      tag: qrState.logoUrl ? 'Activo' : undefined,
    },
  ];

  return (
    <div class="w-full space-y-4 min-w-0 max-w-full">
      {/* Contenedor Principal: 2 Columnas Balanceadas */}
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start min-w-0 max-w-full">
        {/* Columna de Configuración (7 Cols en Desktop) */}
        <div class="lg:col-span-7 flex flex-col gap-3 min-w-0 max-w-full">
          {/* Selector de Pestañas con Acción de Reset */}
          <div class="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-px gap-2 min-w-0 max-w-full">
            <div class="flex items-center gap-1 overflow-x-auto min-w-0 flex-1 scrollbar-none py-0.5" role="tablist" aria-label="Secciones para personalizar el código QR">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(tab.id)}
                    class={`flex-shrink-0 py-2 px-3 text-xs font-medium rounded-t-md transition-all flex items-center gap-1.5 border-b-2 -mb-px cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white ${
                      isActive
                        ? 'border-neutral-900 dark:border-white text-neutral-950 dark:text-white font-semibold'
                        : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50'
                    }`}
                  >
                    <span class="font-mono text-[10px] text-neutral-400 dark:text-neutral-500">{tab.num}.</span>
                    <span>{tab.label}</span>
                    {tab.tag && (
                      <span class="text-[9px] px-1.5 py-0.2 rounded font-mono font-medium border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                        {tab.tag}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleReset}
              class="flex-shrink-0 text-xs text-neutral-500 hover:text-neutral-950 dark:hover:text-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white rounded px-2 py-1 cursor-pointer"
              title="Volver a los valores predeterminados"
            >
              ↺ Restablecer
            </button>
          </div>

          {/* Panel Activo */}
          <div class="surface-card p-4 sm:p-5 min-w-0 max-w-full overflow-hidden">
            {activeTab === 'content' && (
              <QrInputPanel state={qrState} onChange={handleUpdate} />
            )}
            {activeTab === 'style' && (
              <QrStylePanel state={qrState} onChange={handleUpdate} />
            )}
            {activeTab === 'logo' && (
              <QrLogoPanel state={qrState} onChange={handleUpdate} />
            )}
          </div>

          {/* Acceso directo a la descarga en móvil */}
          <div class="lg:hidden">
            <a
              href="#qr-preview-card"
              class="w-full flex items-center justify-between py-2 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100/80 dark:bg-neutral-900 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors"
            >
              <span>Tu código QR está listo abajo</span>
              <span class="underline font-mono text-[11px]">Ver y descargar ↓</span>
            </a>
          </div>
        </div>

        {/* Columna de Previsualización & Descarga (5 Cols en Desktop, Sticky) */}
        <div id="qr-preview-card" class="lg:col-span-5 lg:sticky lg:top-20 min-w-0 max-w-full">
          <QrPreviewCard state={qrState} onChange={handleUpdate} />
        </div>
      </div>
    </div>
  );
}
