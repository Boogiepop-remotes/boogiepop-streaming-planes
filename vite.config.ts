import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import boogiepopJsxLoc from './boogiepop-jsx-loc.mjs'

// App Studio: con BOOGIEPOP_JSX_LOC=1 el JSX sale estampado con data-bp="archivo:linea"
// para que marcar una zona del preview resuelva el archivo real. En deploy no corre.
const bpJsxLoc = process.env.BOOGIEPOP_JSX_LOC === '1'

export default defineConfig({
  base: process.env.VITE_BASE || './',
  plugins: [...(bpJsxLoc ? [boogiepopJsxLoc()] : []), react(), tailwindcss()],
  build: { outDir: 'dist', emptyOutDir: true },
})
