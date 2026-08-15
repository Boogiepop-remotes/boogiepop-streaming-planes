/**
 * Generado por Boogiepop App Studio — NO editar a mano.
 *
 * Plugin de Vite que estampa data-bp="src/archivo.tsx:linea" en el JSX, para
 * que marcar una zona del preview resuelva el archivo/línea real en vez de
 * adivinar por el texto del DOM.
 *
 * Usa la API de TypeScript (ya instalada en el preview) y solo INSERTA texto en
 * posiciones exactas: no reimprime el archivo, así que no puede reformatear ni
 * romper el código. @vitejs/plugin-react v6 delega JSX a oxc y ya no corre
 * Babel, por eso esto es un plugin de Vite `pre` y no un plugin de Babel.
 *
 * También estampa componentes (<Link>, <Card>): si reenvían props al DOM, el
 * nodo queda apuntando al call site, que suele ser el lugar a editar. Si no las
 * reenvían, es una prop ignorada — inofensiva.
 */
import path from 'node:path'
import ts from 'typescript'

const ATTR = 'data-bp'
// Componentes de control sin salida DOM propia: estamparlos no aporta.
const SKIP = new Set([
  'Fragment',
  'StrictMode',
  'Suspense',
  'Routes',
  'Route',
  'HashRouter',
  'BrowserRouter',
  'Provider',
])

export default function boogiepopJsxLoc() {
  let root = process.cwd()
  return {
    name: 'boogiepop-jsx-loc',
    enforce: 'pre',
    configResolved(config) {
      root = config.root || root
    },
    transform(code, id) {
      const file = id.split('?')[0]
      if (!/\.[jt]sx$/.test(file)) return null
      if (file.includes('node_modules')) return null
      const rel = path.relative(root, file).split(path.sep).join('/')
      if (!rel.startsWith('src/')) return null
      if (!code.includes('<')) return null

      const source = ts.createSourceFile(
        file,
        code,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX,
      )

      const inserts = []
      const visit = (node) => {
        if (
          ts.isJsxOpeningElement(node) ||
          ts.isJsxSelfClosingElement(node)
        ) {
          const tag = node.tagName.getText(source)
          if (!SKIP.has(tag) && !node.attributes.properties.some(
            (p) => p.name && p.name.getText && p.name.getText(source) === ATTR,
          )) {
            const line =
              source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1
            inserts.push({
              pos: node.tagName.getEnd(),
              text: ` ${ATTR}="${rel}:${line}"`,
            })
          }
        }
        ts.forEachChild(node, visit)
      }
      visit(source)
      if (!inserts.length) return null

      // De atrás para adelante: así los offsets previos siguen siendo válidos.
      inserts.sort((a, b) => b.pos - a.pos)
      let out = code
      for (const ins of inserts) {
        out = out.slice(0, ins.pos) + ins.text + out.slice(ins.pos)
      }
      return { code: out, map: null }
    },
  }
}
