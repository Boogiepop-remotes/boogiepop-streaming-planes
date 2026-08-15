# Cómo se hace el front

Esto es un **seed de Vite + React + TypeScript ya armado**, con una librería de
componentes vendorizada. No se elige stack ni se inventa estructura: se componen
pantallas con lo que ya está.

    Vite + React + TS · Tailwind v4 (plugin de Vite) · HashRouter · src/ui

---

## 1. Los campos los define la API, no vos

El front **no inventa nombres de campo**. Si la API devuelve `portada`, el
front lee `portada` — no `imagen_url` porque suene mejor.

Cuando el contexto trae el bloque `ESQUEMA ACORDADO CON EL USUARIO` o el
contrato de la API, esos son los nombres. Si no sabés cómo se llama un campo,
**preguntá o mirá la respuesta real** — no supongas.

Un `libro.imagen_url` contra una API que manda `portada` no falla: renderiza
vacío. Es el error más caro porque no avisa.

---

## 2. Estructura

    src/
      App.tsx          ← solo rutas y layout
      pages/           ← una pantalla por archivo
      components/      ← piezas propias de esta app
      data/            ← acceso a la API, tipos
      ui/              ← librería compartida — SE USA, NO SE TOCA

`App.tsx` no lleva lógica de pantalla. Si una página necesita algo, va en
`pages/`.

---

## 3. La librería de componentes

    Badge · Button · Card · Field · Input · Layout · SearchSelect
    Select · Table · Text · ToggleGroup

Se importan de `'./ui'` o `'../ui'`. **Usá esas primitivas** (no reinventes
`Button`/`Input`/`Table` con HTML crudo). `src/ui` **no se edita**.

La composición alrededor de `Card`/`Section`/etc. **sí puede ser creativa**
(className, tokens, tipografía, ritmo) cuando el pedido pide buen UI/UX.

- Listas → `Table` con su prop `empty`, o `EmptyState`. Nunca una lista vacía muda.
- Filtro con opciones → `SearchSelect` (combo buscable, ya resuelto).
- Cargando → `Skeleton`.
- **No inventes navbar** de producto si el usuario no la pidió (la pone el host).

Los componentes de `src/ui` son iguales en todas las apps: **no se editan**. Lo
que cambia es el theme y la composición.

---

## 4. Rutas

`HashRouter`. Una ruta por pantalla, y **el catch-all no reemplaza rutas**:

```tsx
<Routes>
  <Route path="/" element={<ListadoPage />} />
  <Route path="/libro/:id" element={<DetallePage />} />   {/* ← existe de verdad */}
  <Route path="*" element={<ListadoPage />} />
</Routes>
```

Si el usuario pide «una página por libro a la que se llega clickeando», eso es
una `<Route>` propia más un `<Link>` que navega. Un `path="*"` que devuelve
siempre el listado hace que toda URL renderice algo y **parezca** que la página
existe: no existe.

Volver al listado: `<Link to="/">`, no `history.back()`.

---

## 5. Datos de la API

La URL sale de la env, nunca hardcodeada:

```ts
const API = import.meta.env.VITE_API_BASE_URL
const res = await fetch(`${API}/api/libros`)
```

Estados obligatorios en cualquier pantalla que traiga datos:

1. **cargando** → `Skeleton`
2. **error** → mensaje visible, no un `console.error`
3. **vacío** → `EmptyState` con texto
4. **con datos** → lo que corresponda

Las opciones de un filtro salen de los datos que la API ya trajo, no de una
lista escrita a mano: el usuario no puede adivinar qué temas o países existen.

---

## 6. Estilos

Solo clases Tailwind (`flex`, `grid`, `gap-*`, `p-*`, `text-*`, `bg-*`).
Prohibido `style={{}}` para layout o color.

Tokens del theme, no hex: `bg-background`, `text-foreground`, `text-muted`,
`text-accent`, `bg-primary`, `bg-surface`, `border-border`.

`theme.css` y `THEME.md` son la fuente de verdad visual: no se borran, no se
pisan con colores literales.

---

## 7. Tailwind

Entra por el **plugin de Vite** (`@tailwindcss/vite`), ya configurado.

**No escribas `postcss.config.*`.** Ese es el patrón de Tailwind v3; acá el
paquete `@tailwindcss/postcss` no está instalado y el archivo hace fallar el
build antes de compilar una línea de TypeScript.

---

## 8. Prohibido

- editar `src/ui/*` — es la librería compartida
- hardcodear la URL de la API
- inventar nombres de campo
- `postcss.config.*`

**Sobre agregar dependencias:** la regla es una sola:

> **Si no podés comprobar que el build sigue pasando después de instalarla, no
> la instales.**

Un `import` de algo que no está hace fallar el build **antes** de compilar una
línea. Si tenés cómo correr `npm install` y el build, y pasa, no hay problema.
Si trabajás a ciegas, componé con lo que ya está.

Y mirá el peso: una librería grande en el bundle la paga el usuario en cada
carga. Para el front eso pesa más que en el back.

---

## Cómo se conecta esto con el resto

Este documento es **el molde**: cómo se construye un front acá. Qué campos
tiene esta app en particular está en otro lado:

| documento | qué dice |
|---|---|
| `docs/ENTIDADES.md` (en la API) | los nombres reales de las columnas |
| `docs/DECISIONES.md` (en la API) | qué se decidió antes |
| `ESQUEMA ACORDADO` (en el contexto) | los nombres que eligió el usuario |

**Si alguno contradice a este documento, ganan ellos.**

Y para los campos: la fuente es la API. Si `ENTIDADES.md` dice `portada`, el
front lee `portada`. Un nombre inventado no falla — renderiza vacío, y eso se
descubre tres turnos después.
