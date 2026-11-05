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
    label: 'Página web',
    icon: 'M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.084a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364l1.757 1.757',
  },
  {
    id: 'text',
    label: 'Texto o nota',
    icon: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12',
  },
  {
    id: 'wifi',
    label: 'Clave Wi-Fi',
    icon: 'M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22a.75.75 0 11-1.06 0 .75.75 0 011.06 0z',
  },
  {
    id: 'email',
    label: 'Correo',
    icon: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75',
  },
  {
    id: 'vcard',
    label: 'Contacto',
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
      // Permiso de portapapeles restringido
    }
  };

  const isUrlValid = (url: string) => {
    return /^https?:\/\/.+/i.test(url.trim());
  };

  return (
    <div class="space-y-4 min-w-0 max-w-full">
      {/* Selector de Tipo de Contenido */}
      <div class="min-w-0 max-w-full">
        <label class="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
          ¿Qué quieres compartir en tu código QR?
        </label>
        <div
          class="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-neutral-200 dark:border-neutral-800 scrollbar-none min-w-0 max-w-full"
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
                class={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white ${
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

      {/* Formulario Dinámico según Contenido */}
      <div class="space-y-4 pt-1">
        {/* Caso 1: Enlace / URL */}
        {state.contentType === 'url' && (
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label for="qr-url-input" class="text-xs font-semibold text-neutral-900 dark:text-neutral-200">
                Enlace o dirección web
              </label>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePasteUrl}
                  class="text-xs text-neutral-500 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
                  title="Pegar enlace copiado"
                >
                  {pasteNotice ? '✓ Pegado' : 'Pegar'}
                </button>
                {state.rawText && (
                  <button
                    type="button"
                    onClick={() => onChange({ rawText: '' })}
                    class="text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                  >
                    Borrar
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
                placeholder="https://silantrolabs.com o tu enlace"
                class="input-field text-xs font-mono"
                autocomplete="off"
              />
            </div>

            {/* Mensajes de ayuda contextuales */}
            <div class="flex flex-wrap items-center justify-between gap-1 text-[11px] text-neutral-500 pt-0.5">
              {!isUrlValid(state.rawText) && state.rawText.length > 0 && !state.rawText.startsWith('http') ? (
                <span class="text-neutral-700 dark:text-neutral-300 font-medium">
                  Consejo: incluye <code class="font-mono text-neutral-900 dark:text-white">https://</code> para que los celulares lo abran directamente.
                </span>
              ) : (
                <span>Al escanearlo, las personas abrirán esta página directamente en su navegador.</span>
              )}

              {isUrlValid(state.rawText) && (
                <a
                  href={state.rawText}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 text-neutral-900 dark:text-neutral-100 hover:underline font-medium"
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

        {/* Caso 2: Texto o Nota */}
        {state.contentType === 'text' && (
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label for="qr-text-input" class="text-xs font-semibold text-neutral-900 dark:text-neutral-200">
                Escribe tu mensaje o texto
              </label>
              {state.rawText && (
                <button
                  type="button"
                  onClick={() => onChange({ rawText: '' })}
                  class="text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                >
                  Borrar
                </button>
              )}
            </div>

            <textarea
              id="qr-text-input"
              rows={4}
              value={state.rawText}
              onInput={(e) => onChange({ rawText: (e.target as HTMLTextAreaElement).value })}
              placeholder="Escribe aquí cualquier mensaje, datos, notas o información que quieras compartir..."
              class="input-field text-xs resize-y"
            ></textarea>

            <div class="flex items-center justify-between text-[11px] text-neutral-500">
              <span>Se procesa directamente en tu dispositivo</span>
              <span class="font-mono">{state.rawText.length} caracteres</span>
            </div>
          </div>
        )}

        {/* Caso 3: Wi-Fi */}
        {state.contentType === 'wifi' && (
          <div class="space-y-3.5">
            <div>
              <label for="wifi-ssid" class="block text-xs font-semibold text-neutral-900 dark:text-neutral-200 mb-1.5">
                Nombre de la red Wi-Fi (SSID) *
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
                placeholder="Ej. MiCasa-5G o Cafeteria_Clientes"
                class="input-field text-xs"
                required
              />
            </div>

            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label for="wifi-pass" class="text-xs font-semibold text-neutral-900 dark:text-neutral-200">
                  Contraseña de la red
                </label>
                <button
                  type="button"
                  onClick={() => setShowWifiPassword(!showWifiPassword)}
                  class="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
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
                placeholder="Escribe la clave de acceso"
                class="input-field text-xs font-mono"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label for="wifi-enc" class="block text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                  Seguridad de la red
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
                  class="input-field text-xs cursor-pointer"
                >
                  <option value="WPA">WPA / WPA2 / WPA3 (La más habitual)</option>
                  <option value="WEP">WEP (Redes antiguas)</option>
                  <option value="nopass">Sin contraseña (Red abierta)</option>
                </select>
              </div>

              <div class="flex items-center sm:justify-end pt-2 sm:pt-6">
                <label class="inline-flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer select-none">
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
                    class="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 accent-neutral-900 dark:accent-neutral-100"
                  />
                  <span>Esta es una red oculta</span>
                </label>
              </div>
            </div>

            <p class="text-[11px] text-neutral-500 dark:text-neutral-400">
              Al escanear este código con la cámara, el celular ofrecerá conectarse al Wi-Fi sin tener que escribir la contraseña a mano.
            </p>
          </div>
        )}

        {/* Caso 4: Correo Electrónico */}
        {state.contentType === 'email' && (
          <div class="space-y-3.5">
            <div>
              <label for="email-to" class="block text-xs font-semibold text-neutral-900 dark:text-neutral-200 mb-1.5">
                ¿A qué correo quieres que te escriban? *
              </label>
              <input
                id="email-to"
                type="email"
                value={state.emailAddress}
                onInput={(e) => onChange({ emailAddress: (e.target as HTMLInputElement).value })}
                placeholder="contacto@ejemplo.com"
                class="input-field text-xs font-mono"
              />
            </div>

            <div>
              <label for="email-subject" class="block text-xs font-semibold text-neutral-900 dark:text-neutral-200 mb-1.5">
                Asunto del correo (opcional)
              </label>
              <input
                id="email-subject"
                type="text"
                value={state.emailSubject}
                onInput={(e) => onChange({ emailSubject: (e.target as HTMLInputElement).value })}
                placeholder="Ej. Consulta sobre servicios o información"
                class="input-field text-xs"
              />
            </div>

            <div>
              <label for="email-body" class="block text-xs font-semibold text-neutral-900 dark:text-neutral-200 mb-1.5">
                Mensaje predeterminado (opcional)
              </label>
              <textarea
                id="email-body"
                rows={3}
                value={state.emailBody || ''}
                onInput={(e) => onChange({ emailBody: (e.target as HTMLTextAreaElement).value })}
                placeholder="Escribe un mensaje de ejemplo o déjalo vacío..."
                class="input-field text-xs"
              ></textarea>
            </div>
          </div>
        )}

        {/* Caso 5: Tarjeta de Contacto */}
        {state.contentType === 'vcard' && (
          <div class="space-y-3.5">
            <p class="text-xs text-neutral-600 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800 pb-2">
              Al escanearlo, las personas podrán guardar tu contacto directamente en la agenda de su teléfono.
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label for="vc-first" class="block text-xs text-neutral-600 dark:text-neutral-400 mb-1">Nombre *</label>
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
                <label for="vc-last" class="block text-xs text-neutral-600 dark:text-neutral-400 mb-1">Apellidos</label>
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
                <label for="vc-phone" class="block text-xs text-neutral-600 dark:text-neutral-400 mb-1">Teléfono o WhatsApp</label>
                <input
                  id="vc-phone"
                  type="tel"
                  value={state.vcard.phone}
                  onInput={(e) =>
                    onChange({ vcard: { ...state.vcard, phone: (e.target as HTMLInputElement).value } })
                  }
                  placeholder="+57 300 123 4567"
                  class="input-field text-xs font-mono"
                />
              </div>

              <div>
                <label for="vc-email" class="block text-xs text-neutral-600 dark:text-neutral-400 mb-1">Correo electrónico</label>
                <input
                  id="vc-email"
                  type="email"
                  value={state.vcard.email}
                  onInput={(e) =>
                    onChange({ vcard: { ...state.vcard, email: (e.target as HTMLInputElement).value } })
                  }
                  placeholder="carlos@ejemplo.com"
                  class="input-field text-xs font-mono"
                />
              </div>

              <div>
                <label for="vc-org" class="block text-xs text-neutral-600 dark:text-neutral-400 mb-1">Empresa o actividad</label>
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
                <label for="vc-url" class="block text-xs text-neutral-600 dark:text-neutral-400 mb-1">Página web</label>
                <input
                  id="vc-url"
                  type="url"
                  value={state.vcard.url || ''}
                  onInput={(e) =>
                    onChange({ vcard: { ...state.vcard, url: (e.target as HTMLInputElement).value } })
                  }
                  placeholder="https://silantrolabs.com"
                  class="input-field text-xs font-mono"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
