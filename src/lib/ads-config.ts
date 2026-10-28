/**
 * Configuración centralizada de Bloques de Google AdSense para SilantroTools.
 */

export const ADS_CONFIG = {
  clientId: import.meta.env.PUBLIC_ADSENSE_ID || 'ca-pub-1982658636778600',
  slots: {
    // 1. Inmediatamente debajo del área interactiva de cada herramienta
    toolTop: import.meta.env.PUBLIC_ADSENSE_SLOT_TOOL_TOP || '',

    // 2. Al final de la página de la herramienta (tras la guía técnica y FAQs)
    toolBottom: import.meta.env.PUBLIC_ADSENSE_SLOT_TOOL_BOTTOM || '',

    // 3. Al final del catálogo principal en la página de inicio
    homeBottom: import.meta.env.PUBLIC_ADSENSE_SLOT_HOME_BOTTOM || '',
  },
} as const;
