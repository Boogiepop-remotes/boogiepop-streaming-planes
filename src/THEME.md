# Design system (Tailwind + --bp-*) — obligatorio

Generado desde las referencias de diseño del usuario.

## Stack
- **Siempre Tailwind CSS v4** (clases utility en JSX).
- Tokens en `src/styles/theme.css` (`@theme` + `:root --bp-*`).

## Clases de color / tipo
- Fondo: `bg-background` · texto: `text-foreground` · muted: `text-muted`
- Accent / labels: `text-accent` `bg-accent` · primary: `bg-primary`
- Surface: `bg-surface` · bordes: `border-border`
- Titulares: `font-display` · body: `font-sans`
- Helpers: `.ds-label` `.ds-btn-primary` `.ds-btn-accent` `.ds-card` `.ds-link`

## Librería src/ui
- Card/Button leen `--bp-*` de este mismo `theme.css` (no del scaffold).
- No edites `src/ui/*`; cambiá tokens acá.

## Reglas
- **NO** uses `style={{ color/background }}` ni CSS suelto para layout/colores.
- Si cambiás tokens, editá `theme.css` — no hardcodees hex en App.tsx.
- No inventes secciones de UI; solo el look de lo ya pedido.

## Brief fuente (extracto)
=== REFERENCIAS DE DISEÑO (obedecé tipografía, colores, layout y tono) ===

--- [markdown] pack-diseno-premium.md ---
PACK DE DISEÑO PREMIUM (opcional — el cliente lo pidió).
OBLIGATORIO mientras esta referencia esté adjunta. No sustituyas por scaffold plano.

# Pack de diseño premium (opcional)

El cliente pidió **UI/UX profesional**. Esto no es el default del Studio: solo
aplica cuando esta referencia está adjunta. La app ya puede ser funcional;
ahora elevá el acabado visual y la experiencia sin romper `src/ui`.

## Reglas duras

1. Usá `src/ui` (Button, Card, Badge, Field, ToggleGroup, Section, Stack,
   Grid, EmptyState, Skeleton…). No reinventes controles con HTML crudo.
   **No edites** `src/ui/*`.
2. Look vía tokens: `theme.css` debe tener `@theme` **y** `:root --bp-*`
   (Card/Button leen `--bp-*`). Sin hex sueltos en JSX.
3. Respetá `prefers-reduced-motion`.
4. Dirección anclada al producto del brief — no un template AI genérico.
5. **Alcance:** solo los bloques que el cliente ya pidió. No agregues secciones
   nuevas. Si faltara alcance, el Studio pregunta en el chat — no inventés vos.

## Qué hacer en este pass

1. Definí una dirección (paleta + tipografía + un gesto memorable).
2. Regenerá `theme.css` con `@theme` + `--bp-*` alineados (sombras/radios con
   presencia — no casi invisibles).
3. Elevá composición de **lo que ya existe**: tipografía, ritmo, `className`
   sobre Card/Button, CTAs claros, modales si ya están pedidos.
4. Sé creativo en la **composición**; no en reinventar la librería ni en
   inventar bloques de contenido.
5. No inventes features ni secciones nuevas.

## Listo cuando

Se siente producto profesional (no scaffold plano), las **cards** reflejan el
theme vía `--bp-*`, tipografía y color coherentes — sin clutter ni secciones
de más.
=== FIN REFERENCIAS ===
