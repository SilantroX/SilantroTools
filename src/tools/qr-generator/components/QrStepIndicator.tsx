// src/tools/qr-generator/components/QrStepIndicator.tsx
import type { QrStep } from '../types';

interface Props {
  currentStep: QrStep;
  onStepClick: (step: QrStep) => void;
  maxReachableStep: QrStep;
  onReset: () => void;
}

const STEPS: Array<{ step: QrStep; num: string; label: string }> = [
  { step: 1, num: '01', label: 'Tipo' },
  { step: 2, num: '02', label: 'Datos' },
  { step: 3, num: '03', label: 'Estilo' },
  { step: 4, num: '04', label: 'Listo' },
];

export default function QrStepIndicator({ currentStep, onStepClick, maxReachableStep, onReset }: Props) {
  const currentStepData = STEPS.find((s) => s.step === currentStep) || STEPS[0];

  return (
    <div class="w-full border-b border-neutral-200 dark:border-neutral-800 pb-2 mb-3">
      <div class="flex items-center justify-between gap-3">
        {/* Desktop Stepper Compacto */}
        <nav
          class="hidden sm:flex items-center gap-1 overflow-x-auto scrollbar-none"
          aria-label="Progreso del generador QR"
        >
          {STEPS.map((s, index) => {
            const isActive = currentStep === s.step;
            const isCompleted = currentStep > s.step;
            const isReachable = s.step <= maxReachableStep;

            return (
              <div key={s.step} class="flex items-center">
                <button
                  type="button"
                  onClick={() => isReachable && onStepClick(s.step)}
                  disabled={!isReachable}
                  class={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-all select-none ${
                    isActive
                      ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-semibold shadow-2xs'
                      : isCompleted
                      ? 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer'
                      : isReachable
                      ? 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer'
                      : 'text-neutral-300 dark:text-neutral-700 cursor-not-allowed opacity-50'
                  }`}
                  aria-current={isActive ? 'step' : undefined}
                >
                  <span
                    class={`font-mono text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                      isActive
                        ? 'bg-white/20 text-white dark:bg-black/15 dark:text-neutral-900 font-bold'
                        : isCompleted
                        ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                        : 'text-neutral-400 dark:text-neutral-600'
                    }`}
                  >
                    {isCompleted ? '✓' : s.num}
                  </span>
                  <span>{s.label}</span>
                </button>

                {index < STEPS.length - 1 && (
                  <span class="mx-1 text-neutral-300 dark:text-neutral-700 text-xs" aria-hidden="true">
                    /
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        {/* Mobile Header Compacto (ocupa solo ~22px) */}
        <div class="sm:hidden flex items-center gap-2 flex-1 min-w-0">
          <span class="font-mono text-[10px] text-neutral-500 uppercase tracking-wider flex-shrink-0">
            {currentStepData.num}/04 · <strong class="text-neutral-900 dark:text-white">{currentStepData.label}</strong>
          </span>

          {/* 4 Mini Barras de Progreso */}
          <div class="grid grid-cols-4 gap-1 flex-1">
            {STEPS.map((s) => (
              <div
                key={s.step}
                class={`h-1 rounded-full transition-colors ${
                  s.step <= currentStep
                    ? 'bg-neutral-950 dark:bg-white'
                    : 'bg-neutral-200 dark:bg-neutral-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Botón Reiniciar con Icono */}
        <button
          type="button"
          onClick={onReset}
          class="text-xs text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-1"
          title="Reiniciar a valores por defecto"
          aria-label="Reiniciar valores"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          <span class="hidden md:inline text-[11px]">Reiniciar</span>
        </button>
      </div>
    </div>
  );
}
