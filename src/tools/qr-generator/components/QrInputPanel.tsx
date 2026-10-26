// src/tools/qr-generator/components/QrInputPanel.tsx
import { useState } from 'preact/hooks';
import type { QrOptionsState, QrContentType } from '../types';

interface Props {
  state: QrOptionsState;
  onChange: (updates: Partial<QrOptionsState>) => void;
}

const CONTENT_TYPES: Array<{
  id: QrContentType;
  label: string;
  icon: string;
}> = [
  {
    id: 'url',
    label: 'Enlace / URL',
    icon: 'M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.084a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364l1.757 1.757',
  },
  {
    id: 'text',
    label: 'Texto Plano',
    icon: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12',
  },
  {
    id: 'wifi',
    label: 'Red Wi-Fi',
    icon: 'M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22a.75.75 0 11-1.06 0 .75.75 0 011.06 0z',
  },
  {
    id: 'email',
    label: 'Correo',
    icon: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75',
  },
  {
    id: 'vcard',
    label: 'Contacto (vCard)',
    icon: 'M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.364a4.125 4.125 0 00-6.338 0 .375.375 0 00.28.611h5.778a.375.375 0 00.28-.611z',
  },
];

export default function QrInputPanel({ state, onChange }: Props) {
  const [showWifiPassword, setShowWifiPassword] = useState(false);
  const [pasteNotice, setPasteNotice] = useState(false);

  const handlePasteUrl = async () => {
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          onChange({ rawText: text.trim() });
          setPasteNotice(true);
          setTimeout(() => setPasteNotice(false), 2000);
        }
      }
    } catch {
      // Acceso al portapapeles bloqueado por permisos del navegador
    }
  };

  const isUrlValid = (url: string) => {
    return /^https?:\/\/.+/i.test(url.trim());
  };

  return (
    <div class="space-y-4 min-w-0 max-w-full">
      {/* Selector de Tipo de Carga Útil */}
      <div class="min-w-0 max-w-full">
        <label class="block font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-neutral-500 mb-2">
          Tipo de Contenido a Codificar
        </label>
        <div
          class="flex items-center gap-1 overflow-x-auto pb-1.5 border-b border-neutral-200 dark:border-neutral-800 scrollbar-none min-w-0 max-w-full"
          role="tablist"
          aria-label="Tipo de contenido"
        >
          {CONTENT_TYPES.map((type) => {
            const isActive = state.contentType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onChange({ contentType: type.id })}
                class={`flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white ${
                  isActive
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d={type.icon} />
                </svg>
                <span>{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Formulario Dinámico según Carga Útil */}
      <div class="space-y-4">
        {/* Caso 1: URL */}
        {state.contentType === 'url' && (
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label for="qr-url-input" class="text-xs font-semibold text-neutral-900 dark:text-neutral-200">
                Dirección URL Destino
              </label>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePasteUrl}
                  class="font-mono text-[11px] text-neutral-500 hover:text-neutral-950 dark:hover:text-white transition-colors"
                  title="Pegar desde el portapapeles"
                >
                  {pasteNotice ? '✓ Pegado' : 'Pegar'}
                </button>
                {state.rawText && (
                  <button
                    type="button"
                    onClick={() => onChange({ rawText: '' })}
                    class="font-mono text-[11px] text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                  >
                    Limpiar
                  </button>
                )}
              </div>
            </div>

            <div class="relative">
              <input
                id="qr-url-input"
                type="url"
                value={state.rawText}
                onInput={(e) => onChange({ rawText: (e.target as HTMLInputElement).value })}
                placeholder="https://silantrolabs.com"
                class="input-field font-mono text-xs"
                autocomplete="off"
              />
            </div>

            {/* Ayuda y validación contextual */}
            <div class="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-1">
              {!isUrlValid(state.rawText) && state.rawText.length > 0 && !state.rawText.startsWith('http') ? (
                <span class="text-neutral-600 dark:text-neutral-400">
                  Tip: Para abrir automáticamente en navegadores móviles, incluye <code class="text-neutral-900 dark:text-neutral-100">https://</code>
                </span>
              ) : (
                <span>URI estándar para redirección directa al escanear</span>
              )}

              {isUrlValid(state.rawText) && (
                <a
                  href={state.rawText}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 text-neutral-900 dark:text-neutral-100 hover:underline"
                >
                  <span>Probar enlace</span>
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Caso 2: Texto */}
        {state.contentType === 'text' && (
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label for="qr-text-input" class="text-xs font-semibold text-neutral-900 dark:text-neutral-200">
                Texto Alfanumérico o Mensaje
              </label>
              {state.rawText && (
                <button
                  type="button"
                  onClick={() => onChange({ rawText: '' })}
                  class="font-mono text-[11px] text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                >
                  Limpiar
                </button>
              )}
            </div>

            <textarea
              id="qr-text-input"
              rows={4}
              value={state.rawText}
              onInput={(e) => onChange({ rawText: (e.target as HTMLTextAreaElement).value })}
              placeholder="Ingresa texto, fragmentos de código, notas o identificadores..."
              class="input-field font-mono text-xs resize-y"
            ></textarea>

            <div class="flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span>Procesado 100% en memoria volátil</span>
              <span>{state.rawText.length} caracteres</span>
            </div>
          </div>
        )}

        {/* Caso 3: Wi-Fi */}
        {state.contentType === 'wifi' && (
          <div class="space-y-4">
            <div>
              <label for="wifi-ssid" class="block text-xs font-semibold text-neutral-900 dark:text-neutral-200 mb-1.5">
                Nombre de la Red (SSID) *
              </label>
              <input
                id="wifi-ssid"
                type="text"
                value={state.wifi.ssid}
                onInput={(e) =>
                  onChange({
                    wifi: { ...state.wifi, ssid: (e.target as HTMLInputElement).value },
                  })
                }
                placeholder="Ej. Oficina-5G o MiRed_Invitados"
                class="input-field font-mono text-xs"
                required
              />
            </div>

            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label for="wifi-pass" class="text-xs font-semibold text-neutral-900 dark:text-neutral-200">
                  Contraseña de Red
                </label>
                <button
                  type="button"
                  onClick={() => setShowWifiPassword(!showWifiPassword)}
                  class="font-mono text-[11px] text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                >
                  {showWifiPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              <input
                id="wifi-pass"
                type={showWifiPassword ? 'text' : 'password'}
                value={state.wifi.password || ''}
                onInput={(e) =>
                  onChange({
                    wifi: { ...state.wifi, password: (e.target as HTMLInputElement).value },
                  })
                }
                placeholder="Clave de acceso inalámbrico"
                class="input-field font-mono text-xs"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label for="wifi-enc" class="block font-mono text-[11px] text-neutral-500 mb-1">
                  Tipo de Cifrado
                </label>
                <select
                  id="wifi-enc"
                  value={state.wifi.encryption}
                  onChange={(e) =>
                    onChange({
                      wifi: {
                        ...state.wifi,
                        encryption: (e.target as HTMLSelectElement).value as any,
                      },
                    })
                  }
                  class="input-field font-mono text-xs"
                >
                  <option value="WPA">WPA / WPA2 / WPA3 (Estándar)</option>
                  <option value="WEP">WEP (Antiguo)</option>
                  <option value="nopass">Sin Contraseña (Abierta)</option>
                </select>
              </div>

              <div class="flex items-center sm:justify-end pt-4 sm:pt-6">
                <label class="inline-flex items-center gap-2 font-mono text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={state.wifi.hidden || false}
                    onChange={(e) =>
                      onChange({
                        wifi: {
                          ...state.wifi,
                          hidden: (e.target as HTMLInputElement).checked,
                        },
                      })
                    }
                    class="w-3.5 h-3.5 rounded border-neutral-300 dark:border-neutral-700 accent-neutral-900 dark:accent-neutral-100"
                  />
                  <span>Red Wi-Fi Oculta</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Caso 4: Correo Electrónico */}
        {state.contentType === 'email' && (
          <div class="space-y-4">
            <div>
              <label for="email-to" class="block text-xs font-semibold text-neutral-900 dark:text-neutral-200 mb-1.5">
                Dirección de Correo Destino *
              </label>
              <input
                id="email-to"
                type="email"
                value={state.emailAddress}
                onInput={(e) => onChange({ emailAddress: (e.target as HTMLInputElement).value })}
                placeholder="contacto@ejemplo.com"
                class="input-field font-mono text-xs"
              />
            </div>

            <div>
              <label for="email-subject" class="block text-xs font-semibold text-neutral-900 dark:text-neutral-200 mb-1.5">
                Asunto Predefinido
              </label>
              <input
                id="email-subject"
                type="text"
                value={state.emailSubject}
                onInput={(e) => onChange({ emailSubject: (e.target as HTMLInputElement).value })}
                placeholder="Consulta sobre servicios o solicitud de información"
                class="input-field text-xs"
              />
            </div>

            <div>
              <label for="email-body" class="block text-xs font-semibold text-neutral-900 dark:text-neutral-200 mb-1.5">
                Cuerpo del Mensaje (Opcional)
              </label>
              <textarea
                id="email-body"
                rows={3}
                value={state.emailBody || ''}
                onInput={(e) => onChange({ emailBody: (e.target as HTMLTextAreaElement).value })}
                placeholder="Texto introductorio que aparecerá en el cliente de correo del usuario..."
                class="input-field text-xs"
              ></textarea>
            </div>
          </div>
        )}

        {/* Caso 5: Tarjeta de Contacto (vCard 3.0) */}
        {state.contentType === 'vcard' && (
          <div class="space-y-4">
            <span class="block font-mono text-[11px] text-neutral-500 border-b border-neutral-200 dark:border-neutral-800 pb-1.5">
              Estándar vCard 3.0 compatible con iOS y Android Contacts
            </span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label for="vc-first" class="block font-mono text-[11px] text-neutral-500 mb-1">Nombre *</label>
                <input
                  id="vc-first"
                  type="text"
                  value={state.vcard.firstName}
                  onInput={(e) =>
                    onChange({ vcard: { ...state.vcard, firstName: (e.target as HTMLInputElement).value } })
                  }
                  placeholder="Carlos"
                  class="input-field text-xs"
                />
              </div>

              <div>
                <label for="vc-last" class="block font-mono text-[11px] text-neutral-500 mb-1">Apellido</label>
                <input
                  id="vc-last"
                  type="text"
                  value={state.vcard.lastName}
                  onInput={(e) =>
                    onChange({ vcard: { ...state.vcard, lastName: (e.target as HTMLInputElement).value } })
                  }
                  placeholder="Gómez"
                  class="input-field text-xs"
                />
              </div>

              <div>
                <label for="vc-phone" class="block font-mono text-[11px] text-neutral-500 mb-1">Teléfono</label>
                <input
                  id="vc-phone"
                  type="tel"
                  value={state.vcard.phone}
                  onInput={(e) =>
                    onChange({ vcard: { ...state.vcard, phone: (e.target as HTMLInputElement).value } })
                  }
                  placeholder="+57 300 123 4567"
                  class="input-field font-mono text-xs"
                />
              </div>

              <div>
                <label for="vc-email" class="block font-mono text-[11px] text-neutral-500 mb-1">Correo Electrónico</label>
                <input
                  id="vc-email"
                  type="email"
                  value={state.vcard.email}
                  onInput={(e) =>
                    onChange({ vcard: { ...state.vcard, email: (e.target as HTMLInputElement).value } })
                  }
                  placeholder="carlos@empresa.com"
                  class="input-field font-mono text-xs"
                />
              </div>

              <div>
                <label for="vc-org" class="block font-mono text-[11px] text-neutral-500 mb-1">Organización / Empresa</label>
                <input
                  id="vc-org"
                  type="text"
                  value={state.vcard.organization || ''}
                  onInput={(e) =>
                    onChange({ vcard: { ...state.vcard, organization: (e.target as HTMLInputElement).value } })
                  }
                  placeholder="Silantro Labs"
                  class="input-field text-xs"
                />
              </div>

              <div>
                <label for="vc-url" class="block font-mono text-[11px] text-neutral-500 mb-1">Sitio Web</label>
                <input
                  id="vc-url"
                  type="url"
                  value={state.vcard.url || ''}
                  onInput={(e) =>
                    onChange({ vcard: { ...state.vcard, url: (e.target as HTMLInputElement).value } })
                  }
                  placeholder="https://silantrolabs.com"
                  class="input-field font-mono text-xs"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
