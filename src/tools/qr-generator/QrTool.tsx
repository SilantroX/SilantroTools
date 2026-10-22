// src/tools/qr-generator/QrTool.tsx
import { useState } from 'preact/hooks';
import type { QrOptionsState } from './types';
import QrInputPanel from './components/QrInputPanel';
import QrStylePanel from './components/QrStylePanel';
import QrLogoPanel from './components/QrLogoPanel';
import QrPreviewCard from './components/QrPreviewCard';

type TabId = 'content' | 'style' | 'logo';

export default function QrTool() {
  const [activeTab, setActiveTab] = useState<TabId>('content');
  const [qrState, setQrState] = useState<QrOptionsState>({
    contentType: 'url',
    rawText: 'https://silantrolabs.com',
    wifi: {
      ssid: '',
      password: '',
      encryption: 'WPA',
    },
    vcard: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      organization: 'Silantro Labs',
    },
    emailAddress: '',
    emailSubject: '',

    dotsType: 'rounded',
    cornersSquareType: 'extra-rounded',
    cornersDotType: 'dot',

    dotsColor: '#0a0a0a',
    bgColor: '#ffffff',
    cornersSquareColor: '#0a0a0a',
    cornersDotColor: '#0a0a0a',

    logoUrl: undefined,
    isBrandLogoActive: false,
    logoSize: 0.28,
    margin: 10,
    errorCorrectionLevel: 'Q',

    downloadSize: 1024,
    downloadFormat: 'png',
  });

  const handleUpdate = (updates: Partial<QrOptionsState>) => {
    setQrState((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const tabs: Array<{ id: TabId; label: string; badge?: string }> = [
    { id: 'content', label: '01 / Contenido' },
    { id: 'style', label: '02 / Geometría & Color' },
    {
      id: 'logo',
      label: '03 / Marca & Logo',
      badge: qrState.logoUrl ? 'Activo' : undefined,
    },
  ];

  return (
    <div class="w-full">
      {/* Barra de Título Editorial */}
      <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <span class="font-mono text-[11px] uppercase tracking-wider text-neutral-500 block mb-0.5">
            Módulo 01 • Motor Local
          </span>
          <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
            Generador de QR <span class="font-normal text-neutral-500">by Silantro Labs</span>
          </h2>
        </div>

        <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-neutral-200 dark:border-neutral-800 text-xs font-mono text-neutral-600 dark:text-neutral-400 self-start sm:self-auto">
          <img
            src="/logos/logo-con-fondo.jpg"
            alt="Silantro Labs"
            class="w-4 h-4 rounded object-cover"
          />
          <span>Silantro Labs</span>
        </div>
      </div>

      {/* Grid Principal de 2 Columnas */}
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Columna Izquierda: Pestañas y Controles (7 columnas) */}
        <div class="lg:col-span-7 flex flex-col gap-6 order-2 lg:order-1">
          {/* Navegación por Pestañas */}
          <div class="flex items-center border-b border-neutral-200 dark:border-neutral-800">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  class={`py-2 px-3 sm:px-4 text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 border-b-2 -mb-[1px] ${
                    isActive
                      ? 'border-neutral-900 dark:border-neutral-100 text-neutral-950 dark:text-white'
                      : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span class="text-[10px] px-1 py-0.2 rounded border border-neutral-400 dark:border-neutral-600 font-mono">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Panel Activo */}
          <div class="p-6 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 min-h-[380px]">
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

        {/* Columna Derecha: Previsualización y Descarga (5 columnas, sticky en escritorio) */}
        <div class="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-20">
          <QrPreviewCard state={qrState} onChange={handleUpdate} />
        </div>
      </div>
    </div>
  );
}
