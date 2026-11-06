// src/tools/qr-generator/components/Step1ContentType.tsx
import type { QrContentType } from '../types';

interface Props {
  selectedType: QrContentType;
  onSelect: (type: QrContentType) => void;
  onContinue: () => void;
}

interface TypeItem {
  id: QrContentType;
  title: string;
  hint: string;
  iconPath: string;
}

const CONTENT_TYPES: TypeItem[] = [
  {
    id: 'url',
    title: 'Sitio web',
    hint: 'Enlace o URL',
    iconPath:
      'M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.084a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364l1.757 1.757',
  },
  {
    id: 'wifi',
    title: 'Wi-Fi',
    hint: 'Conexión directa',
    iconPath:
      'M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22a.75.75 0 11-1.06 0 .75.75 0 011.06 0z',
  },
  {
    id: 'vcard',
    title: 'Contacto',
    hint: 'Tarjeta vCard',
    iconPath:
      'M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.364a4.125 4.125 0 00-6.338 0 .375.375 0 00.28.611h5.778a.375.375 0 00.28-.611z',
  },
  {
    id: 'email',
    title: 'Correo',
    hint: 'Mensaje directo',
    iconPath:
      'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75',
  },
  {
    id: 'text',
    title: 'Texto',
    hint: 'Nota simple',
    iconPath: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12',
  },
];

export default function Step1ContentType({ selectedType, onSelect, onContinue }: Props) {
  const currentOption = CONTENT_TYPES.find((t) => t.id === selectedType) || CONTENT_TYPES[0];

  const handleCardClick = (typeId: QrContentType) => {
    if (selectedType === typeId) {
      onContinue();
    } else {
      onSelect(typeId);
    }
  };

  return (
    <div class="animate-step-enter max-w-4xl mx-auto space-y-3 sm:space-y-4 py-1">
      {/* Título Limpio y Directo */}
      <div class="text-center sm:text-left">
        <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
          ¿Qué quieres compartir?
        </h2>
      </div>

      {/* Grid de Tarjetas Animadas (Desktop: 5 cols en 1 fila; Móvil: 2 cols + 1 ancho) */}
      <div
        class="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5"
        role="radiogroup"
        aria-label="Selecciona tipo de contenido"
      >
        {CONTENT_TYPES.map((type, idx) => {
          const isSelected = selectedType === type.id;
          const isLastOnMobile = idx === 4;

          return (
            <div
              key={type.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => handleCardClick(type.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (isSelected) onContinue();
                  else onSelect(type.id);
                }
              }}
              class={`group relative p-3 sm:p-3.5 rounded-xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between select-none active:scale-[0.98] ${
                isLastOnMobile ? 'col-span-2 sm:col-span-1' : ''
              } ${
                isSelected
                  ? 'border-neutral-950 dark:border-white bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-sm -translate-y-0.5'
                  : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/70 text-neutral-900 dark:text-white hover:border-neutral-400 dark:hover:border-neutral-600 hover:-translate-y-0.5'
              }`}
            >
              <div class="flex items-center sm:flex-col sm:items-start justify-between gap-2">
                <div
                  class={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ${
                    isSelected
                      ? 'bg-white/15 text-white dark:bg-black/10 dark:text-neutral-950'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d={type.iconPath} />
                  </svg>
                </div>

                <div class="flex-1 min-w-0 sm:mt-2">
                  <h3 class="text-xs sm:text-sm font-semibold tracking-tight truncate">
                    {type.title}
                  </h3>
                  <span
                    class={`text-[10px] block truncate ${
                      isSelected ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-400 dark:text-neutral-500'
                    }`}
                  >
                    {type.hint}
                  </span>
                </div>

                {/* Checkmark sutil */}
                <div
                  class={`w-3.5 h-3.5 rounded-full border flex items-center justify-center sm:self-end flex-shrink-0 ${
                    isSelected
                      ? 'border-white bg-white text-neutral-950 dark:border-neutral-950 dark:bg-neutral-950 dark:text-white'
                      : 'border-neutral-300 dark:border-neutral-700'
                  }`}
                  aria-hidden="true"
                >
                  {isSelected && <span class="text-[8px] font-bold">✓</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Botón Principal de Acción (Touch target 44px) */}
      <div class="pt-1">
        <button
          type="button"
          onClick={onContinue}
          class="btn-primary w-full py-3 text-xs sm:text-sm font-semibold cursor-pointer shadow-xs flex items-center justify-center gap-2 group active:scale-[0.99] transition-transform"
        >
          <span>Continuar con {currentOption.title}</span>
          <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
