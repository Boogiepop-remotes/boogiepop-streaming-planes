# Patrones UI — apps de App Studio

## La librería es obligatoria

La app trae `src/ui` con las primitivas compartidas. **Son las mismas en todas
las apps y no se editan.** Lo que cambia entre una app y otra son los tokens
(`--bp-*` en `src/index.css`) y cómo se componen.

```tsx
import { Button, Card, Badge, Field, Input, Select, SearchSelect, ToggleGroup, Table, Section, Stack, Grid, EmptyState, Skeleton, Text } from './ui'
```

Prohibido reinventar controles básicos con HTML crudo (`<button>`, inputs
sueltos, tablas a mano). **Usá** `Button`, `Input`, `Card`, etc. de `src/ui`
(no se edita la librería). La **composición** dentro/alrededor de esas
primitivas sí puede ser creativa: `className`, tipografía, ritmo, elevación,
atmósfera — sobre todo si el usuario pide UI/UX o estilos profesionales.

## Qué da cada primitiva

| Componente | Para qué | Props que importan |
|---|---|---|
| `Button` | Acciones y links | `variant="primary" \| "secondary"`, `size="sm"`, `href` |
| `Card` | Contenedor de un ítem | `className="bp-card-interactive"` para hover elevado |
| `Badge` | Estado o destaque | `tone="accent" \| "muted" \| "ok" \| "warn"` |
| `Field` | Label + control + error | `label`, `htmlFor`, `error`, `hint`, `required` |
| `Input` / `Select` | Controles de formulario | van adentro de `Field` |
| `ToggleGroup` | Elegir una opción entre pocas, en línea | `options` (`value`/`label`/`hint`), `value`, `onChange`, `label` |
| `SearchSelect` | Filtrar una lista larga escribiendo | `options` (strings), `value`, `onChange`, `placeholder` |
| `Table` | Listados tabulares | `columns`, `rows`, `rowKey`, `empty`, `sort`, `onSort` |
| `Section` | Bloque con título | `title`, `lead`, `actions` |
| `Stack` / `Grid` | Espaciado y columnas | `gap="sm\|md\|lg"`, `cols={2\|3\|4}` |
| `EmptyState` | Lista vacía o sin resultados | `title`, `hint`, `action` |
| `Skeleton` | Carga | `lines` |

## Reglas de composición

- Una sección = un propósito. `Section` con `title` y, si hace falta, `actions`.
- Toda lista contempla **tres estados**: cargando (`Skeleton`), vacía
  (`EmptyState` o el `empty` de `Table`) y con datos. Una lista muda es un bug.
- Los formularios usan `Field` con `htmlFor` cableado al `id` del control. Los
  errores se muestran con la prop `error`, no con texto suelto.
- Las columnas ordenables de `Table` pasan `sortKey` y `onSort`; para numerar
  filas se usa el `index` que recibe `cell`, no el id de la base.
- Un selector de pocas opciones en línea (periodicidad, rango, vista) es
  `ToggleGroup`, no una fila de `<button>` con ternarios en el `className`: es
  un `radiogroup`, la selección es estado y no acción, y se navega con flechas.
- Un filtro sobre muchos valores (autores, temas, países) es `SearchSelect`, y
  sus `options` salen **de los datos ya cargados**, no de una lista escrita a
  mano: si un valor no está en el dataset, no tiene por qué estar en el filtro.
  Un `Select` con cincuenta opciones es inusable y un `Input` libre le pide al
  usuario que adivine qué existe.
- Para destacar una card, `className="bp-card-featured"` (borde de color y
  elevación); para hover elevado, `bp-card-interactive`. Podés sumar clases
  Tailwind de layout/ritmo/elevación sobre `Card` si el pedido pide más diseño.
- **No inventes navbar** / chrome de producto si el usuario no lo pidió (en el
  hub la pone el host).
- **Alcance:** solo bloques que el pedido nombra. Si una landing queda vaga,
  el Studio pregunta en el chat — no rellenes con secciones de marketing.
- Espaciado con `Stack`/`Grid`, no con márgenes sueltos.

## Estilo

- El look se cambia en `:root` de `src/index.css` (`--bp-primary`, `--bp-bg`,
  `--bp-body`, `--bp-border`, tipografías). **Nunca** hex hardcodeado en el JSX.
- Las transiciones base vienen en la librería (`bp-card-interactive`, hover de
  botones) y respetan `prefers-reduced-motion`. Si el usuario pide más
  presencia, podés enriquecer composición y tokens — sin editar `src/ui`.
- **Flip / giro al hover:** no alcanza con mostrar otra cara al instante. El
  pedido implica animación visible. Patrón seguro: wrapper sin `transform` (ahí
  va el hover) + hijo que anima (`transition`/`element.animate` sobre
  `transform`). Preferí un `.css` del componente frente a solo utilities
  Tailwind `rotateY` (suelen no interpolar). Si pedían ver el giro, no apagues
  la transición a 0ms por `prefers-reduced-motion`; acortala, no la borres.
- Tailwind se usa para layout y acabado visual; no reconstruyas un `Button`.

## Datos

- Mock en `src/data/*.ts`, tipado y exportado. Ahí van las listas.
- Contra una API: `VITE_API_BASE_URL`, y los tres estados de arriba.

## Consumir una API de Boogiepop

Cuando la app tiene una API linkeada, el runtime te pasa su **contrato real**:
las rutas que existen, si piden `Authorization`, y qué devuelve cada una. Ese
bloque no es una sugerencia — es lo que la API responde de verdad.

**Las rutas no se deducen.** Si el contrato dice `GET /api/libros`, no escribas
`GET /books`: no hay redirección ni alias, es un 404. Y no traduzcas los nombres
de los recursos al inglés.

**Los campos se leen del endpoint que los manda, no de la app.** El contrato
lista cada ruta por separado justamente porque no todas devuelven lo mismo. Que
un campo exista en `GET /api/libros/mejor-puntuados` no quiere decir que venga
en `GET /api/libros`.

```ts
// MAL — `score` lo manda mejor-puntuados; en /api/libros no viene.
const data = await (await fetch(`${API_BASE}/api/libros`)).json()
return data.libros.map((l) => ({
  titulo: String(l.titulo ?? ''),
  score: Number(l.score ?? 0),   // → 0 en TODAS las filas
}))
```

El `?? 0` es lo que vuelve grave al error: un campo ausente no llega como
`undefined` a la pantalla, llega como `0` — y `★ 0.0` en las diez filas parece
un dato real, no un bug. Lo mismo `?? ''` con un texto o una imagen.

Antes de mapear un campo, buscalo en la línea del contrato de **esa** ruta. Si
no está, hay dos salidas honestas: pedir la ruta que sí lo trae, o agregarlo a
la API. La que no vale es leerlo igual y taparlo con un default.

**El envelope tampoco.** Si devuelve `{ libros: [...], total }`, leé
`data.libros`. No agregues fallbacks a nombres que imaginás
(`data.data ?? data.items ?? []`): si el campo no está en el contrato, no
existe, y el fallback solo esconde el error hasta que la pantalla sale vacía.

**Mapeá campo por campo.** Este es el error más caro y el más difícil de ver:

```ts
// MAL — compila, y deja todos los campos en undefined
const data = (await res.json()) as { libros: Libro[] }
return data.libros

// BIEN — el type del front puede llamarse como quiera; el mapeo es explícito
const data = (await res.json()) as { libros: Array<Record<string, unknown>> }
return data.libros.map((l) => ({
  id: String(l.id),
  nombre: String(l.titulo ?? ''),     // la API manda `titulo`
  score: Number(l.score_calidad ?? 0), // la API manda `score_calidad`
}))
```

El `as` es un cast, no una conversión: TypeScript no valida nada y la tabla
renderiza celdas vacías sin un solo error. **El runtime chequea esto**: si leés
del objeto de la API un campo que el contrato no tiene, el turno se reintenta
con el detalle.

**Si falta un endpoint para lo que te piden, decilo.** No lo inventes ni lo
simules con datos mock: el front queda mintiendo y el back sin enterarse.

## Dependencias

La caja de herramientas es la del `package.json` del seed y **no se puede
ampliar**. No agregues librerías de fechas, tablas, iconos ni charts: se compone
con la librería, Tailwind y lo que ya está instalado. Un `import` de algo que no
está no compila, y no hay forma de instalarlo.
