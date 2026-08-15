export type Periodicidad = 'mensual' | 'trimestral' | 'anual'

export type Plan = {
  id: string
  nombre: string
  tagline: string
  descripcion: string
  incluye: string[]
  destacado?: boolean
  badge?: string
  imagen: string
  precios: Record<Periodicidad, number>
  ahorroAnual: string
}

export const PERIODICIDADES: { value: Periodicidad; label: string; hint?: string }[] = [
  { value: 'mensual', label: 'Mensual' },
  { value: 'trimestral', label: 'Trimestral', hint: '−10%' },
  { value: 'anual', label: 'Anual', hint: '−40%' },
]

export const PLANES: Plan[] = [
  {
    id: 'basico',
    nombre: 'Básico',
    tagline: 'Streaming puro',
    descripcion: 'Todo el catálogo de series y películas en streaming.',
    incluye: ['Streaming en 1 pantalla', 'Calidad HD', 'Catálogo completo'],
    imagen: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=1200&auto=format&fit=crop',
    precios: { mensual: 499, trimestral: 1347, anual: 3593 },
    ahorroAnual: 'Ahorrás 2 meses',
  },
  {
    id: 'deportes',
    nombre: 'Deportes',
    tagline: 'Streaming + deportes en vivo',
    descripcion: 'Todo el streaming más los eventos deportivos en vivo.',
    incluye: ['Todo lo de Básico', 'Deportes en vivo', 'Repeticiones y resúmenes'],
    destacado: true,
    badge: 'El preferido',
    imagen: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1200&auto=format&fit=crop',
    precios: { mensual: 799, trimestral: 2157, anual: 5753 },
    ahorroAnual: 'Ahorrás 3 meses',
  },
  {
    id: 'cine',
    nombre: 'Cine',
    tagline: 'Streaming + cine',
    descripcion: 'Streaming más estrenos de cine y clásicos restaurados.',
    incluye: ['Todo lo de Básico', 'Estrenos de cine', 'Clásicos restaurados'],
    imagen: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop',
    precios: { mensual: 699, trimestral: 1887, anual: 5033 },
    ahorroAnual: 'Ahorrás 2 meses',
  },
  {
    id: 'total',
    nombre: 'Total',
    tagline: 'Todo junto',
    descripcion: 'Streaming, deportes y cine: todo en un solo plan.',
    incluye: ['Todo lo de Deportes', 'Todo lo de Cine', '4 pantallas en simultáneo'],
    imagen: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200&auto=format&fit=crop',
    precios: { mensual: 999, trimestral: 2697, anual: 7193 },
    ahorroAnual: 'Ahorrás 3 meses',
  },
]

export function formatearPrecio(valor: number): string {
  return `$${valor.toLocaleString('es-AR')}`
}

export function precioPorPeriodicidad(plan: Plan, periodicidad: Periodicidad): number {
  return plan.precios[periodicidad]
}

export function etiquetaPeriodicidad(p: Periodicidad): string {
  return PERIODICIDADES.find((x) => x.value === p)?.label ?? p
}
