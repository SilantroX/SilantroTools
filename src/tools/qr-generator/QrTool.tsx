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
    if (confirm('¿Deseas restablecer los parámetros del código QR a sus valores predeterminados?')) {
      setQrState(DEFAULT_STATE);
    }
  };

  const tabs: Array<{ id: TabId; num: string; label: string; tag?: string }> = [
    { id: 'content', num: '01', label: 'Contenido' },
    { id: 'style', num: '02', label: 'Estilo' },
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
            <div class="flex items-center gap-0.5 sm:gap-1 overflow-x-auto min-w-0 flex-1 scrollbar-none py-0.5" role="tablist" aria-label="Secciones de configuración QR">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(tab.id)}
                    class={`flex-shrink-0 py-1.5 px-2 sm:px-3 text-xs font-mono font-medium transition-colors flex items-center gap-1 border-b-2 -mb-px rounded-t-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white ${
                      isActive
                        ? 'border-neutral-900 dark:border-white text-neutral-950 dark:text-white font-semibold'
                        : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    <span class="text-[10px] text-neutral-400 dark:text-neutral-500">{tab.num}.</span>
                    <span>{tab.label}</span>
                    {tab.tag && (
                      <span class="text-[9px] px-1 py-0.2 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800">
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
              class="flex-shrink-0 font-mono text-[10px] sm:text-[11px] text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white rounded px-1.5 py-0.5"
              title="Restablecer valores originales"
            >
              Restablecer
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
        </div>

        {/* Columna de Previsualización & Descarga (5 Cols en Desktop, Sticky) */}
        <div class="lg:col-span-5 lg:sticky lg:top-20 min-w-0 max-w-full">
          <QrPreviewCard state={qrState} onChange={handleUpdate} />
        </div>
      </div>
    </div>
  );
}
