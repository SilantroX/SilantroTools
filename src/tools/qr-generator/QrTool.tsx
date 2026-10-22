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

    dotsColor: '#09090b',
    bgColor: '#ffffff',
    cornersSquareColor: '#09090b',
    cornersDotColor: '#16885c',

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

  const tabs: Array<{ id: TabId; label: string; badge?: string; icon: string }> = [
    { id: 'content', label: '1. Contenido', icon: '📝' },
    { id: 'style', label: '2. Diseño & Colores', icon: '🎨' },
    {
      id: 'logo',
      label: '3. Logo & Marca',
      badge: qrState.logoUrl ? 'Activo' : undefined,
      icon: '✨',
    },
  ];

  return (
    <div class="w-full">
      {/* Barra de Título Minimalista de la Herramienta */}
      <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200/80 dark:border-zinc-800">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Studio Suite
            </span>
            <span class="text-xs text-zinc-300 dark:text-zinc-700">•</span>
            <span class="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              Client-Side Local Engine
            </span>
          </div>
          <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Generador de QR <span class="font-normal text-zinc-500">by Silantro Labs</span>
          </h2>
        </div>

        {/* Badge de Marca con Logotipo */}
        <div class="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-2xl glass-panel">
          <img
            src="/logos/logo-con-fondo.jpg"
            alt="Silantro Labs"
            class="w-6 h-6 rounded-lg object-cover border border-zinc-200 dark:border-zinc-700"
          />
          <span class="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Silantro Labs
          </span>
        </div>
      </div>

      {/* Grid Principal de 2 Columnas (Mobile First: primero controles o apilado, luego preview) */}
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Columna Izquierda: Pestañas y Controles (7 cols en desktop) */}
        <div class="lg:col-span-7 flex flex-col gap-6 order-2 lg:order-1">
          {/* Navegación por Pestañas */}
          <div class="flex items-center gap-1.5 p-1.5 rounded-2xl glass-panel">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  class={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                    isActive
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100/60 dark:hover:bg-zinc-800/40'
                  }`}
                >
                  <span class="text-sm">{tab.icon}</span>
                  <span class="truncate">{tab.label}</span>
                  {tab.badge && (
                    <span class="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-brand-500 text-white font-bold">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Panel Activo */}
          <div class="glass-panel rounded-3xl p-6 sm:p-7 min-h-[420px] transition-all duration-300">
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

        {/* Columna Derecha: Vista Previa y Descarga (5 cols en desktop, sticky en scroll) */}
        <div class="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-24">
          <QrPreviewCard state={qrState} onChange={handleUpdate} />
        </div>
      </div>
    </div>
  );
}
