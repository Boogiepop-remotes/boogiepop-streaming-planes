import { useState } from 'react'
import { Button } from '../ui'
import type { Plan, Periodicidad } from '../data/planes'
import { PLANES, formatearPrecio, etiquetaPeriodicidad } from '../data/planes'

type PlanQuizModalProps = {
  periodicidad: Periodicidad
  onClose: () => void
  onContratar: (plan: Plan) => void
}

type Contenido = 'series' | 'cine' | 'deportes'
type Pantallas = 1 | 2 | 4

const CONTENIDO_OPTIONS: { value: Contenido; label: string }[] = [
  { value: 'series', label: 'Series y películas' },
  { value: 'cine', label: 'Estrenos de cine' },
  { value: 'deportes', label: 'Deportes en vivo' },
]

const PANTALLAS_OPTIONS: { value: Pantallas; label: string }[] = [
  { value: 1, label: '1 pantalla' },
  { value: 2, label: '2 pantallas' },
  { value: 4, label: '4 pantallas' },
]

function recomendarPlan(contenido: Contenido[], pantallas: Pantallas): Plan {
  // 4 pantallas en simultáneo solo lo cubre Total.
  if (pantallas === 4) {
    return PLANES.find((p) => p.id === 'total')!
  }
  const tieneDeportes = contenido.includes('deportes')
  const tieneCine = contenido.includes('cine')
  if (tieneDeportes && tieneCine) {
    return PLANES.find((p) => p.id === 'total')!
  }
  if (tieneDeportes) {
    return PLANES.find((p) => p.id === 'deportes')!
  }
  if (tieneCine) {
    return PLANES.find((p) => p.id === 'cine')!
  }
  return PLANES.find((p) => p.id === 'basico')!
}

export function PlanQuizModal({ periodicidad, onClose, onContratar }: PlanQuizModalProps) {
  const [paso, setPaso] = useState(0)
  const [contenido, setContenido] = useState<Contenido[]>([])
  const [pantallas, setPantallas] = useState<Pantallas | null>(null)

  const puedeAvanzar = paso === 0 ? contenido.length > 0 : pantallas !== null
  const planRecomendado =
    contenido.length > 0 && pantallas !== null ? recomendarPlan(contenido, pantallas) : null

  const toggleContenido = (value: Contenido) => {
    setContenido((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    )
  }

  const irAtras = () => {
    if (paso > 0) setPaso((p) => p - 1)
  }

  const irAdelante = () => {
    if (paso === 0 && contenido.length > 0) setPaso(1)
    else if (paso === 1 && pantallas !== null) setPaso(2)
  }

  const handleContratar = () => {
    if (planRecomendado) {
      onContratar(planRecomendado)
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Conocer mi plan ideal"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg bg-background p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="font-display text-2xl text-foreground">Tu plan ideal</h2>
            <p className="mt-1 text-sm text-muted">
              {paso < 2 ? `Pregunta ${paso + 1} de 2` : 'Recomendación'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-muted hover:bg-surface hover:text-foreground"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {paso === 0 && (
          <div className="space-y-4">
            <p className="text-foreground">¿Qué te gusta ver? Elegí todas las que apliquen.</p>
            <div role="group" aria-label="Qué te gusta ver" className="bp-toggle-group">
              {CONTENIDO_OPTIONS.map((o) => {
                const active = contenido.includes(o.value)
                return (
                  <button
                    key={o.value}
                    type="button"
                    aria-pressed={active}
                    className={`bp-toggle-option${active ? ' bp-toggle-option-active' : ''}`}
                    onClick={() => toggleContenido(o.value)}
                  >
                    <span className="bp-toggle-label">{o.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {paso === 1 && (
          <div className="space-y-4">
            <p className="text-foreground">¿En cuántas pantallas lo vas a ver?</p>
            <div role="radiogroup" aria-label="Cantidad de pantallas" className="bp-toggle-group">
              {PANTALLAS_OPTIONS.map((o) => {
                const active = pantallas === o.value
                return (
                  <button
                    key={o.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    className={`bp-toggle-option${active ? ' bp-toggle-option-active' : ''}`}
                    onClick={() => setPantallas(o.value)}
                  >
                    <span className="bp-toggle-label">{o.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {paso === 2 && planRecomendado && (
          <div className="space-y-4">
            <div className="rounded-md bg-surface p-5 text-center">
              <p className="text-sm text-muted">Te recomendamos</p>
              <p className="font-display text-3xl text-foreground">{planRecomendado.nombre}</p>
              <p className="mt-1 text-sm text-muted">{planRecomendado.tagline}</p>
              <p className="mt-3 text-foreground">
                {etiquetaPeriodicidad(periodicidad)} ·{' '}
                {formatearPrecio(planRecomendado.precios[periodicidad])}
              </p>
            </div>
            <ul className="space-y-2">
              {planRecomendado.incluye.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="mt-0.5 text-accent" aria-hidden="true">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          {paso > 0 ? (
            <Button variant="secondary" onClick={irAtras}>
              ← Atrás
            </Button>
          ) : (
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
          )}

          {paso < 2 ? (
            <Button className="w-auto px-6" onClick={irAdelante} disabled={!puedeAvanzar}>
              Siguiente →
            </Button>
          ) : (
            <Button className="w-auto px-6" onClick={handleContratar}>
              Contratar {planRecomendado?.nombre}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
