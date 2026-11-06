// src/tools/qr-generator/components/Step2ContentInput.tsx
import { useState } from 'preact/hooks';
import type { QrOptionsState } from '../types';

interface Props {
  state: QrOptionsState;
  onChange: (updates: Partial<QrOptionsState>) => void;
  onBack: () => void;
  onContinue: () => void;
  onDirectDownload: () => void;
}

export default function Step2ContentInput({
  state,
  onChange,
  onBack,
  onContinue,
  onDirectDownload,
}: Props) {
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
      // noop
    }
  };

  const isUrlValid = (url: string) => {
    return /^https?:\/\/.+/i.test(url.trim());
  };

  const getValidation = (): { isValid: boolean; message?: string } => {
    switch (state.contentType) {
      case 'url':
        if (!state.rawText.trim()) return { isValid: false, message: 'Ingresa un enlace o URL.' };
        return { isValid: true };
      case 'text':
        if (!state.rawText.trim()) return { isValid: false, message: 'Escribe tu mensaje o texto.' };
        return { isValid: true };
      case 'wifi':
        if (!state.wifi.ssid.trim()) return { isValid: false, message: 'Ingresa el nombre de red (SSID).' };
        return { isValid: true };
      case 'email':
        if (!state.emailAddress.trim()) return { isValid: false, message: 'Ingresa una dirección de correo.' };
        if (!state.emailAddress.includes('@')) return { isValid: false, message: 'Formato de correo incompleto.' };
        return { isValid: true };
      case 'vcard':
        if (!state.vcard.firstName.trim() && !state.vcard.phone.trim() && !state.vcard.email.trim()) {
          return { isValid: false, message: 'Ingresa al menos nombre, teléfono o correo.' };
        }
        return { isValid: true };
      default:
        return { isValid: true };
    }
  };

  const validation = getValidation();

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && validation.isValid) {
      onContinue();
    }
  };

  return (
    <div class="animate-step-enter max-w-3xl mx-auto space-y-3 sm:space-y-4 py-1">
      {/* Título Limpio */}
      <div class="flex items-center justify-between">
        <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
          Introduce tu contenido
        </h2>
        <span class="text-[11px] font-mono text-neutral-500 uppercase">
          {state.contentType}
        </span>
      </div>

      {/* Formulario Compacto */}
      <div class="surface-card p-4 sm:p-5 space-y-3">
        {/* Caso 1: Enlace / URL */}
        {state.contentType === 'url' && (
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs">
              <label for="qr-url-input" class="font-semibold text-neutral-900 dark:text-neutral-100">
                Pega aquí tu enlace web
              </label>
              <button
                type="button"
                onClick={handlePasteUrl}
                class="text-[11px] text-neutral-500 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.849A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.599m7.332 0c.055.194.084.4.084.611v.006a1.5 1.5 0 01-1.5 1.5H9.75a1.5 1.5 0 01-1.5-1.5v-.006c0-.211.029-.417.084-.611m7.332 0H18a2.25 2.25 0 012.25 2.25v13.5A2.25 2.25 0 0118 21.75H6a2.25 2.25 0 01-2.25-2.25V6a2.25 2.25 0 012.25-2.25h1.5" />
                </svg>
                <span>{pasteNotice ? 'Pegado' : 'Pegar enlace'}</span>
              </button>
            </div>

            <input
              id="qr-url-input"
              type="url"
              value={state.rawText}
              onInput={(e) => onChange({ rawText: (e.target as HTMLInputElement).value })}
              onKeyDown={handleKeyDown}
              placeholder="https://ejemplo.com o tu enlace"
              class="input-field text-xs sm:text-sm font-mono py-2.5 px-3"
              autocomplete="off"
              autoFocus
            />

            {isUrlValid(state.rawText) && (
              <div class="flex items-center justify-between text-[11px] text-neutral-500 pt-0.5">
                <span>✓ Formato de enlace reconocido</span>
                <a
                  href={state.rawText}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-medium text-neutral-900 dark:text-neutral-100 hover:underline flex items-center gap-1"
                >
                  <span>Probar enlace</span>
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        )}

        {/* Caso 2: Texto */}
        {state.contentType === 'text' && (
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs">
              <label for="qr-text-input" class="font-semibold text-neutral-900 dark:text-neutral-100">
                Escribe tu mensaje o nota
              </label>
              <span class="font-mono text-[10px] text-neutral-400">{state.rawText.length} car.</span>
            </div>
            <textarea
              id="qr-text-input"
              rows={3}
              value={state.rawText}
              onInput={(e) => onChange({ rawText: (e.target as HTMLTextAreaElement).value })}
              placeholder="Escribe el texto que deseas compartir..."
              class="input-field text-xs sm:text-sm resize-none p-2.5 leading-relaxed"
              autoFocus
            />
          </div>
        )}

        {/* Caso 3: Wi-Fi */}
        {state.contentType === 'wifi' && (
          <div class="space-y-2.5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label for="wifi-ssid" class="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                  Nombre red (SSID) *
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
                  onKeyDown={handleKeyDown}
                  placeholder="Ej. Red_Clientes"
                  class="input-field text-xs p-2"
                  autoFocus
                  required
                />
              </div>

              <div>
                <div class="flex items-center justify-between mb-1">
                  <label for="wifi-pass" class="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    Contraseña
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowWifiPassword(!showWifiPassword)}
                    class="text-[10px] text-neutral-500 hover:text-neutral-950 dark:hover:text-white cursor-pointer"
                  >
                    {showWifiPassword ? 'Ocultar' : 'Ver'}
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
                  onKeyDown={handleKeyDown}
                  placeholder="Clave de red"
                  class="input-field text-xs font-mono p-2"
                />
              </div>
            </div>

            <div class="flex items-center justify-between gap-2 pt-0.5">
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
                class="input-field text-[11px] p-1.5 w-auto cursor-pointer"
              >
                <option value="WPA">Seguridad WPA / WPA2 / WPA3</option>
                <option value="WEP">Seguridad WEP</option>
                <option value="nopass">Red abierta (sin clave)</option>
              </select>

              <label class="inline-flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer select-none">
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
                  class="w-3.5 h-3.5 rounded border-neutral-300 dark:border-neutral-700 accent-neutral-950 dark:accent-white"
                />
                <span class="text-[11px]">Red oculta</span>
              </label>
            </div>
          </div>
        )}

        {/* Caso 4: Correo */}
        {state.contentType === 'email' && (
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label for="email-to" class="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                Correo destinatario *
              </label>
              <input
                id="email-to"
                type="email"
                value={state.emailAddress}
                onInput={(e) => onChange({ emailAddress: (e.target as HTMLInputElement).value })}
                onKeyDown={handleKeyDown}
                placeholder="contacto@ejemplo.com"
                class="input-field text-xs font-mono p-2"
                autoFocus
              />
            </div>
            <div>
              <label for="email-subject" class="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                Asunto (opcional)
              </label>
              <input
                id="email-subject"
                type="text"
                value={state.emailSubject}
                onInput={(e) => onChange({ emailSubject: (e.target as HTMLInputElement).value })}
                onKeyDown={handleKeyDown}
                placeholder="Ej. Consulta"
                class="input-field text-xs p-2"
              />
            </div>
          </div>
        )}

        {/* Caso 5: vCard */}
        {state.contentType === 'vcard' && (
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div>
              <label for="vc-first" class="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-0.5">Nombre *</label>
              <input
                id="vc-first"
                type="text"
                value={state.vcard.firstName}
                onInput={(e) => onChange({ vcard: { ...state.vcard, firstName: (e.target as HTMLInputElement).value } })}
                onKeyDown={handleKeyDown}
                placeholder="Carlos"
                class="input-field text-xs p-1.5"
                autoFocus
              />
            </div>
            <div>
              <label for="vc-last" class="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-0.5">Apellidos</label>
              <input
                id="vc-last"
                type="text"
                value={state.vcard.lastName}
                onInput={(e) => onChange({ vcard: { ...state.vcard, lastName: (e.target as HTMLInputElement).value } })}
                onKeyDown={handleKeyDown}
                placeholder="Gómez"
                class="input-field text-xs p-1.5"
              />
            </div>
            <div>
              <label for="vc-phone" class="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-0.5">Teléfono *</label>
              <input
                id="vc-phone"
                type="tel"
                value={state.vcard.phone}
                onInput={(e) => onChange({ vcard: { ...state.vcard, phone: (e.target as HTMLInputElement).value } })}
                onKeyDown={handleKeyDown}
                placeholder="+57 300 123 4567"
                class="input-field text-xs font-mono p-1.5"
              />
            </div>
            <div>
              <label for="vc-email" class="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-0.5">Correo</label>
              <input
                id="vc-email"
                type="email"
                value={state.vcard.email}
                onInput={(e) => onChange({ vcard: { ...state.vcard, email: (e.target as HTMLInputElement).value } })}
                onKeyDown={handleKeyDown}
                placeholder="carlos@mail.com"
                class="input-field text-xs font-mono p-1.5"
              />
            </div>
            <div>
              <label for="vc-org" class="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-0.5">Empresa</label>
              <input
                id="vc-org"
                type="text"
                value={state.vcard.organization || ''}
                onInput={(e) => onChange({ vcard: { ...state.vcard, organization: (e.target as HTMLInputElement).value } })}
                onKeyDown={handleKeyDown}
                placeholder="Silantro Labs"
                class="input-field text-xs p-1.5"
              />
            </div>
            <div>
              <label for="vc-url" class="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-0.5">Web</label>
              <input
                id="vc-url"
                type="url"
                value={state.vcard.url || ''}
                onInput={(e) => onChange({ vcard: { ...state.vcard, url: (e.target as HTMLInputElement).value } })}
                onKeyDown={handleKeyDown}
                placeholder="https://..."
                class="input-field text-xs font-mono p-1.5"
              />
            </div>
          </div>
        )}

        {!validation.isValid && validation.message && (
          <p class="text-[11px] text-neutral-500 dark:text-neutral-400">
            {validation.message}
          </p>
        )}
      </div>

      {/* Botones de Navegación con Iconos (Touch target 42-44px) */}
      <div class="pt-1 space-y-2">
        <div class="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            class="btn-secondary py-2.5 px-3.5 text-xs font-medium cursor-pointer flex items-center gap-1.5 flex-shrink-0"
            title="Volver a seleccionar tipo"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span class="hidden sm:inline">Atrás</span>
          </button>

          <button
            type="button"
            onClick={onContinue}
            disabled={!validation.isValid}
            class="btn-primary flex-1 py-2.5 px-4 text-xs sm:text-sm font-semibold cursor-pointer shadow-xs flex items-center justify-center gap-2 group active:scale-[0.99] transition-transform"
          >
            <span>Personalizar estilo</span>
            <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>

        {/* Atajo rápido */}
        {validation.isValid && (
          <div class="text-center">
            <button
              type="button"
              onClick={onDirectDownload}
              class="text-[11px] text-neutral-500 hover:text-neutral-950 dark:hover:text-white transition-colors underline cursor-pointer"
            >
              ¿Tienes prisa? Saltar personalización y descargar mi código QR ahora →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
