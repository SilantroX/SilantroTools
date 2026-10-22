// src/tools/qr-generator/components/QrInputPanel.tsx
import type { QrOptionsState, QrContentType } from '../types';

interface Props {
  state: QrOptionsState;
  onChange: (updates: Partial<QrOptionsState>) => void;
}

const contentTypes: Array<{ id: QrContentType; label: string }> = [
  { id: 'url', label: 'Enlace / URL' },
  { id: 'text', label: 'Texto Plano' },
  { id: 'wifi', label: 'Red Wi-Fi' },
  { id: 'email', label: 'Correo Electrónico' },
  { id: 'vcard', label: 'Tarjeta de Contacto (vCard)' },
];

export default function QrInputPanel({ state, onChange }: Props) {
  return (
    <div class="space-y-6">
      {/* Selector de Tipo de Contenido (Monocromático, sin emojis) */}
      <div>
        <label class="block font-mono text-[11px] uppercase tracking-wider text-neutral-500 mb-2">
          01.1 / Tipo de Carga Útil
        </label>
        <div class="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-neutral-200 dark:border-neutral-800">
          {contentTypes.map((type) => {
            const isActive = state.contentType === type.id;
            return (
              <button
                type="button"
                onClick={() => onChange({ contentType: type.id })}
                class={`flex-shrink-0 px-3 py-1.5 rounded text-xs transition-colors font-medium ${
                  isActive
                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
                }`}
              >
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Formulario Dinámico */}
      <div class="space-y-4">
        {state.contentType === 'url' && (
          <div>
            <label class="block text-xs font-semibold text-neutral-900 dark:text-neutral-200 mb-1.5">
              Dirección URL Destino
            </label>
            <input
              type="url"
              value={state.rawText}
              onInput={(e) => onChange({ rawText: (e.target as HTMLInputElement).value })}
              placeholder="https://silantrolabs.com"
              class="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-xs font-mono focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 transition-colors"
            />
            <p class="font-mono text-[11px] text-neutral-500 mt-2">
              Se compila como URI estándar para redirección directa al escanear.
            </p>
          </div>
        )}

        {state.contentType === 'text' && (
          <div>
            <label class="block text-xs font-semibold text-neutral-900 dark:text-neutral-200 mb-1.5">
              Texto Alfanumérico Libre
            </label>
            <textarea
              rows={4}
              value={state.rawText}
              onInput={(e) => onChange({ rawText: (e.target as HTMLTextAreaElement).value })}
              placeholder="Ingresa texto, fragmentos de código, claves o notas..."
              class="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-xs font-mono focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 transition-colors resize-y"
            ></textarea>
            <div class="flex justify-between font-mono text-[11px] text-neutral-500 mt-1">
              <span>Memoria volátil local</span>
              <span>{state.rawText.length} caracteres</span>
            </div>
          </div>
        )}

        {state.contentType === 'wifi' && (
          <div class="space-y-3.5">
            <div>
              <label class="block text-xs font-semibold text-neutral-900 dark:text-neutral-200 mb-1">
                Nombre de Red (SSID)
              </label>
              <input
                type="text"
                value={state.wifi.ssid}
                onInput={(e) =>
                  onChange({
                    wifi: { ...state.wifi, ssid: (e.target as HTMLInputElement).value },
                  })
                }
                placeholder="Nombre de la red Wi-Fi"
                class="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-xs font-mono focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-neutral-900 dark:text-neutral-200 mb-1">
                Contraseña
              </label>
              <input
                type="text"
                value={state.wifi.password || ''}
                onInput={(e) =>
                  onChange({
                    wifi: { ...state.wifi, password: (e.target as HTMLInputElement).value },
                  })
                }
                placeholder="Clave de red"
                class="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-xs font-mono focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100"
              />
            </div>
            <div class="flex items-center justify-between text-xs pt-1">
              <label class="font-mono text-neutral-500">Cifrado:</label>
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
                class="px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-mono"
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
              <label class="block text-xs font-semibold text-neutral-900 dark:text-neutral-200 mb-1">
                Dirección de Destino
              </label>
              <input
                type="email"
                value={state.emailAddress}
                onInput={(e) => onChange({ emailAddress: (e.target as HTMLInputElement).value })}
                placeholder="contacto@silantrolabs.com"
                class="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-xs font-mono focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-neutral-900 dark:text-neutral-200 mb-1">
                Asunto Predefinido
              </label>
              <input
                type="text"
                value={state.emailSubject}
                onInput={(e) => onChange({ emailSubject: (e.target as HTMLInputElement).value })}
                placeholder="Asunto del correo"
                class="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-xs font-mono focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100"
              />
            </div>
          </div>
        )}

        {state.contentType === 'vcard' && (
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-mono text-[11px] text-neutral-500 mb-1">Nombre</label>
              <input
                type="text"
                value={state.vcard.firstName}
                onInput={(e) =>
                  onChange({ vcard: { ...state.vcard, firstName: (e.target as HTMLInputElement).value } })
                }
                placeholder="Alex"
                class="w-full px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-mono"
              />
            </div>
            <div>
              <label class="block font-mono text-[11px] text-neutral-500 mb-1">Apellido</label>
              <input
                type="text"
                value={state.vcard.lastName}
                onInput={(e) =>
                  onChange({ vcard: { ...state.vcard, lastName: (e.target as HTMLInputElement).value } })
                }
                placeholder="Silantro"
                class="w-full px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-mono"
              />
            </div>
            <div>
              <label class="block font-mono text-[11px] text-neutral-500 mb-1">Teléfono</label>
              <input
                type="tel"
                value={state.vcard.phone}
                onInput={(e) =>
                  onChange({ vcard: { ...state.vcard, phone: (e.target as HTMLInputElement).value } })
                }
                placeholder="+57 300 000 0000"
                class="w-full px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-mono"
              />
            </div>
            <div>
              <label class="block font-mono text-[11px] text-neutral-500 mb-1">Email</label>
              <input
                type="email"
                value={state.vcard.email}
                onInput={(e) =>
                  onChange({ vcard: { ...state.vcard, email: (e.target as HTMLInputElement).value } })
                }
                placeholder="alex@silantrolabs.com"
                class="w-full px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-mono"
              />
            </div>
            <div class="sm:col-span-2">
              <label class="block font-mono text-[11px] text-neutral-500 mb-1">Organización</label>
              <input
                type="text"
                value={state.vcard.organization || ''}
                onInput={(e) =>
                  onChange({ vcard: { ...state.vcard, organization: (e.target as HTMLInputElement).value } })
                }
                placeholder="Silantro Labs"
                class="w-full px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-mono"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
