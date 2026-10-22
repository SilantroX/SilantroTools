// src/tools/qr-generator/components/QrInputPanel.tsx
import type { QrOptionsState, QrContentType } from '../types';

interface Props {
  state: QrOptionsState;
  onChange: (updates: Partial<QrOptionsState>) => void;
}

const contentTypes: Array<{ id: QrContentType; label: string; icon: string }> = [
  { id: 'url', label: 'Enlace / URL', icon: '🔗' },
  { id: 'text', label: 'Texto Libre', icon: '📄' },
  { id: 'wifi', label: 'Red Wi-Fi', icon: '📶' },
  { id: 'email', label: 'Email', icon: '✉️' },
  { id: 'vcard', label: 'Contacto (vCard)', icon: '👤' },
];

export default function QrInputPanel({ state, onChange }: Props) {
  return (
    <div class="space-y-5">
      {/* Selector Horizontal de Tipo de Contenido (Mobile-friendly horizontal scroll) */}
      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5">
          Tipo de Información
        </label>
        <div class="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {contentTypes.map((type) => {
            const isActive = state.contentType === type.id;
            return (
              <button
                type="button"
                onClick={() => onChange({ contentType: type.id })}
                class={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                    : 'bg-zinc-100/80 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/80 dark:bg-zinc-800/60 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <span>{type.icon}</span>
                <span>{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Formulario Dinámico según Tipo */}
      <div class="glass-subtle p-4 sm:p-5 rounded-2xl transition-all">
        {state.contentType === 'url' && (
          <div>
            <label class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Dirección Web (URL)
            </label>
            <div class="relative">
              <input
                type="url"
                value={state.rawText}
                onInput={(e) => onChange({ rawText: (e.target as HTMLInputElement).value })}
                placeholder="https://silantrolabs.com"
                class="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all placeholder:text-zinc-400"
              />
            </div>
            <p class="text-[11px] text-zinc-400 dark:text-zinc-500 mt-2">
              Se recomienda incluir siempre el protocolo <code>https://</code> para apertura automática en smartphones.
            </p>
          </div>
        )}

        {state.contentType === 'text' && (
          <div>
            <label class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Mensaje o Texto Alfanumérico
            </label>
            <textarea
              rows={4}
              value={state.rawText}
              onInput={(e) => onChange({ rawText: (e.target as HTMLTextAreaElement).value })}
              placeholder="Escribe cualquier nota, token o fragmento de texto..."
              class="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all placeholder:text-zinc-400 resize-y"
            ></textarea>
            <div class="flex justify-between items-center text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">
              <span>Procesado 100% en memoria RAM local</span>
              <span>{state.rawText.length} caracteres</span>
            </div>
          </div>
        )}

        {state.contentType === 'wifi' && (
          <div class="space-y-3.5">
            <div>
              <label class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Nombre de la Red (SSID)
              </label>
              <input
                type="text"
                value={state.wifi.ssid}
                onInput={(e) =>
                  onChange({
                    wifi: { ...state.wifi, ssid: (e.target as HTMLInputElement).value },
                  })
                }
                placeholder="Ej. Silantro_Guest"
                class="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Contraseña de Seguridad
              </label>
              <input
                type="text"
                value={state.wifi.password || ''}
                onInput={(e) =>
                  onChange({
                    wifi: { ...state.wifi, password: (e.target as HTMLInputElement).value },
                  })
                }
                placeholder="Contraseña del Wi-Fi"
                class="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              />
            </div>
            <div class="flex items-center justify-between pt-1 text-xs">
              <label class="font-medium text-zinc-600 dark:text-zinc-400">Encriptación:</label>
              <select
                value={state.wifi.encryption}
                onChange={(e) =>
                  onChange({
                    wifi: {
                      ...state.wifi,
                      encryption: (e.target as HTMLSelectElement).value as any,
                    },
                  })
                }
                class="px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-medium"
              >
                <option value="WPA">WPA / WPA2 / WPA3</option>
                <option value="WEP">WEP</option>
                <option value="nopass">Sin Contraseña</option>
              </select>
            </div>
          </div>
        )}

        {state.contentType === 'email' && (
          <div class="space-y-3.5">
            <div>
              <label class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Destinatario
              </label>
              <input
                type="email"
                value={state.emailAddress}
                onInput={(e) => onChange({ emailAddress: (e.target as HTMLInputElement).value })}
                placeholder="soporte@silantrolabs.com"
                class="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Asunto Predeterminado
              </label>
              <input
                type="text"
                value={state.emailSubject}
                onInput={(e) => onChange({ emailSubject: (e.target as HTMLInputElement).value })}
                placeholder="Consulta sobre servicios"
                class="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              />
            </div>
          </div>
        )}

        {state.contentType === 'vcard' && (
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Nombre</label>
              <input
                type="text"
                value={state.vcard.firstName}
                onInput={(e) =>
                  onChange({ vcard: { ...state.vcard, firstName: (e.target as HTMLInputElement).value } })
                }
                placeholder="Alex"
                class="w-full px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
              />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Apellido</label>
              <input
                type="text"
                value={state.vcard.lastName}
                onInput={(e) =>
                  onChange({ vcard: { ...state.vcard, lastName: (e.target as HTMLInputElement).value } })
                }
                placeholder="Silantro"
                class="w-full px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
              />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Teléfono Móvil</label>
              <input
                type="tel"
                value={state.vcard.phone}
                onInput={(e) =>
                  onChange({ vcard: { ...state.vcard, phone: (e.target as HTMLInputElement).value } })
                }
                placeholder="+57 300 000 0000"
                class="w-full px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
              />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Email Profesional</label>
              <input
                type="email"
                value={state.vcard.email}
                onInput={(e) =>
                  onChange({ vcard: { ...state.vcard, email: (e.target as HTMLInputElement).value } })
                }
                placeholder="alex@silantrolabs.com"
                class="w-full px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
              />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Organización / Empresa</label>
              <input
                type="text"
                value={state.vcard.organization || ''}
                onInput={(e) =>
                  onChange({ vcard: { ...state.vcard, organization: (e.target as HTMLInputElement).value } })
                }
                placeholder="Silantro Labs"
                class="w-full px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
