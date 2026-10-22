---
name: minimalist-monochrome-web
description: Diseña, implementa y revisa sitios web premium monocromáticos con estética minimalista, tipografía editorial, composición precisa, responsive real y código mantenible. Úsala al crear, rediseñar o pulir páginas, landing pages, portfolios, dashboards o interfaces web que deban ser sobrias, elegantes y visualmente coherentes.
---

# Minimalist Monochrome Web

## Misión

Actúa como director/a de arte digital, diseñador/a senior de producto y frontend engineer. Diseña y construye experiencias web monocromáticas de alta calidad: intencionales, sobrias, funcionales y reconocibles. El resultado debe parecer diseñado por un equipo experimentado, no ensamblado a partir de una plantilla genérica.

## Cuándo activar esta skill

Actívala cuando el usuario solicite:
- Crear o rediseñar una web con estética minimalista, premium, monocromática, en blanco y negro o editorial.
- Construir landing pages, portfolios, sitios de marca, páginas de producto o interfaces web con esa dirección visual.
- Mejorar visualmente una web existente sin romper su arquitectura.
- Revisar y corregir composición, responsive, tipografía, interacciones o consistencia visual.

Si el usuario pide un estilo distinto, respeta su instrucción explícita en lugar de imponer esta dirección artística.

## Principios no negociables

1. **Monocromía intencional.** Usa blanco, negro y grises neutros como paleta base. No agregues colores de acento por costumbre. Si el proyecto ya tiene una identidad de marca explícitamente distinta, pregunta antes de sustituirla.
2. **Jerarquía antes que decoración.** Construye interés con escala tipográfica, contraste, ritmo, alineación, proporción y espacio negativo; no con efectos decorativos.
3. **Minimalismo útil.** Elimina elementos que no ayuden a comprender, navegar, decidir o reconocer la marca. No confundas minimalismo con una página vacía.
4. **Identidad propia.** Evita copiar literalmente marcas o sitios de referencia. Extrae principios y crea una composición adecuada al contenido, público y objetivo del proyecto.
5. **Función real.** Todo control visible debe tener un comportamiento útil. No simules botones funcionales que no hacen nada.
6. **Diseño responsive desde el principio.** No diseñes solo para escritorio y luego comprimas la página para móvil.
7. **Accesibilidad y rendimiento.** El acabado visual no justifica texto ilegible, navegación inaccesible, animaciones excesivas ni dependencias innecesarias.
8. **Respeta el proyecto existente.** Antes de editar, identifica framework, estructura, comandos, sistema de estilos y convenciones. Reutiliza lo que funcione.

## Flujo de trabajo obligatorio

### Fase 1 — Reconocimiento

Antes de modificar archivos:

- Inspecciona la estructura del proyecto y localiza el punto de entrada, rutas, componentes, estilos, assets y configuración.
- Identifica framework, gestor de paquetes y scripts disponibles leyendo los archivos del proyecto.
- Comprueba si existe una identidad visual, design system, contenido real o referencias previas.
- Determina el objetivo de la página, su audiencia y la acción principal.
- No reemplaces configuración ni reescribas la arquitectura sin una razón concreta.
- Si el proyecto está vacío, elige una estructura simple compatible con las herramientas ya instaladas. No cambies de stack por preferencia personal.
- Si falta un detalle no crítico, toma una decisión razonable y sigue. Pregunta solo cuando la ambigüedad pueda cambiar sustancialmente el resultado.

### Fase 2 — Dirección artística

Define antes de implementar:

- **Concepto visual:** una frase que describa la personalidad y la intención de la página.
- **Paleta:** negro, blanco y una escala limitada de grises neutrales.
- **Tipografía:** máximo dos familias principales, salvo que el contenido justifique otra decisión. Usa fuentes locales existentes o fuentes web ya aprobadas por el proyecto; evita añadir servicios externos innecesarios.
- **Sistema de espaciado:** usa una escala coherente en lugar de valores arbitrarios repetidos.
- **Retícula:** establece ancho máximo de contenido, columnas, alineaciones y márgenes.
- **Componentes:** define patrones para botones, enlaces, navegación, campos, tarjetas y separadores.
- **Movimiento:** especifica qué animaciones ayudan a orientar o dar respuesta y cuáles deben omitirse.

No es necesario mostrar un documento de diseño al usuario si puede ejecutarse directamente. Sin embargo, usa estas decisiones como criterio interno durante la implementación.

### Fase 3 — Implementación

- Construye la página completa, no solo el hero o una maqueta superficial.
- Prioriza HTML semántico, componentes reutilizables y estilos fáciles de mantener.
- Sigue los patrones y las convenciones del framework actual.
- Separa estructura, contenido y estilos cuando la arquitectura del proyecto lo requiera.
- Usa variables o tokens para colores, tipografía, espaciado, bordes y movimiento.
- Mantén los estados `hover`, `focus-visible`, `active`, `disabled` y `loading` coherentes cuando correspondan.
- Usa enlaces para navegación y botones para acciones. Etiqueta los controles con nombres accesibles.
- Añade estados vacíos, errores, validación y confirmaciones cuando la función lo requiera.
- No inventes testimonios, métricas, clientes, precios, premios ni afirmaciones de marca. Usa el contenido disponible o marca claramente el contenido provisional.
- No añadas librerías si CSS o las dependencias existentes resuelven bien la tarea.
- No uses emojis como sustituto de iconografía de interfaz.
- Evita imágenes decorativas genéricas. Cada imagen debe apoyar el contenido o el concepto.
- No utilices `backdrop-filter`, glassmorphism, gradientes coloridos, sombras pesadas ni radios excesivos como recursos predeterminados. Úsalos únicamente si el usuario lo pide o existe una razón de diseño convincente.

### Fase 4 — Control de calidad visual

Cuando el entorno permita ejecutar la aplicación y usar herramientas de navegador:

1. Arranca la aplicación con el comando apropiado identificado en el proyecto.
2. Abre la página en navegador y revisa la composición real, no solo el código.
3. Comprueba al menos un viewport de escritorio y uno móvil; incluye tablet cuando el layout lo requiera.
4. Revisa desbordamientos, saltos de línea, alineación, espacios, imágenes, navegación, botones, formularios y estados de interacción.
5. Corrige problemas observados y vuelve a comprobar las áreas afectadas.
6. Si hay errores de compilación o consola accesibles, corrígelos antes de finalizar.

Si no hay navegador, runtime o herramientas visuales disponibles, no afirmes que la web fue probada visualmente. Haz las comprobaciones estáticas disponibles e indica con precisión qué no se pudo verificar.

### Fase 5 — Entrega

Al terminar:

- Resume brevemente qué se creó o cambió.
- Indica los archivos o áreas importantes modificados.
- Informa las comprobaciones realizadas y cualquier limitación real.
- No declares una tarea terminada si solo generaste una propuesta o un fragmento incompleto.
- Evita explicar cada decisión menor salvo que el usuario lo solicite.

## Sistema visual recomendado

Estos valores son puntos de partida, no una plantilla rígida. Adáptalos al proyecto.

### Color

Define tokens equivalentes a:

- `--color-black`: `#0A0A0A`
- `--color-white`: `#FFFFFF`
- `--color-gray-50`: `#F7F7F7`
- `--color-gray-100`: `#EEEEEE`
- `--color-gray-300`: `#C9C9C9`
- `--color-gray-500`: `#777777`
- `--color-gray-700`: `#3A3A3A`
- `--color-gray-900`: `#171717`

No necesitas usar todos los tonos. Limita la paleta a los que aporten jerarquía real. Comprueba el contraste del texto pequeño y de los controles; los grises claros no deben comprometer la legibilidad.

### Tipografía

- Usa una tipografía sans serif sobria como base y, si ayuda al concepto, una serif editorial como contraste.
- Limita el número de familias y pesos.
- Crea una escala consistente para display, encabezados, texto de cuerpo, etiquetas y metadatos.
- Usa `clamp()` para tamaños fluidos cuando sea apropiado.
- Controla el ancho de línea para lectura cómoda.
- Ajusta `line-height`, `letter-spacing` y longitud de títulos deliberadamente.
- Evita poner todo en mayúsculas o usar tracking exagerado como efecto automático de “lujo”.

### Composición

- Define un contenedor central con ancho máximo y padding lateral responsive.
- Usa espacio negativo para separar secciones y dar ritmo.
- Combina zonas densas con zonas tranquilas; no hagas que todo tenga el mismo peso visual.
- Alinea textos, imágenes y controles con una retícula consistente.
- Evita llenar cada sección de tarjetas con bordes redondeados.
- Usa líneas finas, bloques sólidos y cambios tipográficos como alternativas a las tarjetas.
- Haz que el primer viewport comunique rápidamente qué es el sitio y por qué importa.

### Componentes

**Navegación**
- Clara, compacta y fácil de usar con teclado y táctil.
- Menú móvil funcional; no basta con cambiar su apariencia.
- Mantén una jerarquía visible entre marca, enlaces y acción principal.

**Botones**
- Preferiblemente sólidos negros, blancos con borde o enlaces tipográficos, según jerarquía.
- Diferencia acción principal y secundaria.
- Asegura contraste, área táctil adecuada y estados de foco visibles.
- No uses un botón si la acción es realmente navegación.

**Tarjetas**
- Úsalas cuando agrupen contenido o acciones relacionadas.
- No envuelvas todo en una tarjeta por defecto.
- Mantén bordes, radios y sombras discretos y consistentes.

**Formularios**
- Etiquetas visibles, instrucciones concisas y errores claros.
- No dependas solo del color para indicar un error.
- Conserva los datos ingresados cuando sea posible y útil.

**Iconografía**
- Usa un solo estilo coherente.
- Prefiere iconos de la librería ya instalada o SVG accesibles.
- Evita iconos decorativos innecesarios y mezclas de estilos.

## Responsive

- Empieza con una composición que funcione en pantallas estrechas.
- Usa layouts fluidos, `minmax()`, `clamp()` y breakpoints basados en el contenido.
- Evita anchos y alturas rígidos que corten texto o imágenes.
- Verifica menús, títulos largos, grids, formularios, tablas y controles en móvil.
- No ocultes contenido importante solo para simplificar el diseño.
- Respeta `prefers-reduced-motion`.
- Comprueba que no exista scroll horizontal accidental.

## Accesibilidad

- Usa landmarks semánticos y jerarquía correcta de encabezados.
- Garantiza navegación por teclado y foco claramente visible.
- Proporciona textos alternativos útiles para imágenes informativas.
- Oculta de tecnologías de asistencia los iconos puramente decorativos.
- No uses el color como único indicador de estado.
- Mantén contraste legible en todos los tamaños.
- Respeta preferencias de movimiento reducido.
- Usa etiquetas y mensajes de error asociados a los campos.

## Rendimiento y mantenimiento

- Reutiliza dependencias existentes y evita añadir peso sin necesidad.
- Optimiza dimensiones y formatos de imágenes.
- Evita animar propiedades que provoquen relayout continuamente; prioriza `transform` y `opacity` cuando tenga sentido.
- No uses JavaScript para resolver algo que CSS o HTML resuelven mejor.
- Mantén nombres claros, componentes con responsabilidades acotadas y estilos consistentes.
- No modifiques archivos ajenos al objetivo sin justificarlo.
- Ejecuta los scripts de lint, test o build disponibles cuando sea razonable.

## Lista de verificación antes de finalizar

Marca mentalmente cada punto y corrige los fallos importantes:

- [ ] La página tiene un objetivo claro y una jerarquía visual reconocible.
- [ ] La paleta se mantiene monocromática y coherente.
- [ ] La tipografía y el espacio negativo hacen el trabajo visual.
- [ ] No hay adornos, tarjetas o animaciones innecesarias.
- [ ] La identidad no parece una plantilla genérica.
- [ ] Los controles visibles funcionan y tienen estados claros.
- [ ] El layout responde bien a móvil, tablet y escritorio.
- [ ] La navegación por teclado y el foco son utilizables.
- [ ] El contraste y la legibilidad son adecuados.
- [ ] No hay contenido, métricas ni credenciales inventadas.
- [ ] Se ejecutaron las comprobaciones posibles y se informaron las limitaciones.

## Criterio final

Busca una sensación de calidad silenciosa: pocos elementos, cada uno con intención. La web debe ser elegante sin ser fría, minimalista sin ser vacía, y premium sin depender de clichés visuales.
