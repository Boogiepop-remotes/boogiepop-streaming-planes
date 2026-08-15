import { useState } from 'react'
import { Badge, Button } from '../ui'
import type { Plan, Periodicidad } from '../data/planes'
import { formatearPrecio } from '../data/planes'
import './PlanCard.css'

type PlanCardProps = {
  plan: Plan
  periodicidad: Periodicidad
  onContratar: (plan: Plan) => void
}

export function PlanCard({ plan, periodicidad, onContratar }: PlanCardProps) {
  const [flipped, setFlipped] = useState(false)
  const precio = plan.precios[periodicidad]
  const esAnual = periodicidad === 'anual'
  const esDestacado = Boolean(plan.destacado)

  const featuredFront = esDestacado
    ? 'bp-card-featured border-2 border-accent shadow-lg'
    : 'border border-border'
  const featuredBack = esDestacado
    ? 'border-2 border-accent shadow-lg'
    : 'border border-border'

  const handleContratar = (e: React.MouseEvent) => {
    e.stopPropagation()
    onContratar(plan)
  }

  return (
    <div
      className={`plan-card-flip group h-[460px] ${flipped ? 'is-flipped' : ''}`}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped((f) => !f)}
    >
      <div className="plan-card-flip-inner">
        {/* ── Frente: imagen de fondo, nombre, qué incluye y si es el destacado ── */}
        <div
          className={`plan-card-face bp-card flex flex-col ${featuredFront}`}
        >
          {/* Imagen de fondo recortada a las esquinas redondeadas de la card */}
          <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${plan.imagen})` }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-background/35 to-background/15" />
          </div>

          <div className="relative flex flex-1 flex-col p-6">
            <div className="mb-4 flex items-start justify-between gap-2">
              <div>
                <h3 className="font-display text-2xl text-foreground">{plan.nombre}</h3>
                <p className="mt-0.5 text-sm text-muted">{plan.tagline}</p>
              </div>
            </div>

            <p className="mb-5 text-sm leading-relaxed text-muted">{plan.descripcion}</p>

            <ul className="space-y-2">
              {plan.incluye.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="mt-0.5 text-accent" aria-hidden="true">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Badge en el borde superior derecho de la card, sobresaliendo */}
          {plan.badge ? (
            <Badge tone="accent" className="absolute -top-3 -right-3 shrink-0 shadow-md">
              {plan.badge}
            </Badge>
          ) : null}
        </div>

        {/* ── Dorso: precio y botón Contratar ── */}
        <div
          className={`plan-card-face plan-card-face--back bp-card flex flex-col p-6 ${featuredBack}`}
        >
          <div className="mb-4 flex items-start justify-between gap-2">
            <div>
              <h3 className="font-display text-2xl text-foreground">{plan.nombre}</h3>
              <p className="mt-0.5 text-sm text-muted">{plan.tagline}</p>
            </div>
          </div>

          <div className="mb-5">
            <p className="font-display text-4xl text-foreground">
              {formatearPrecio(precio)}
            </p>
            <p className="mt-1 text-xs text-muted">
              {periodicidad === 'mensual'
                ? 'por mes'
                : periodicidad === 'trimestral'
                  ? 'por trimestre'
                  : 'por año'}
            </p>
          </div>

          <div className="mb-6 rounded-md bg-surface px-3 py-2 text-sm">
            {esAnual ? (
              <p className="text-foreground">
                <span className="font-medium text-accent">✓</span> Ya estás pagando el
                plan anual: es el que más conviene.
              </p>
            ) : (
              <p className="text-foreground">
                <span className="font-medium text-accent">✓</span> Conviene el anual:{' '}
                <span className="font-medium">{plan.ahorroAnual}</span>
              </p>
            )}
          </div>

          <div className="mt-auto">
            <Button
              variant={esDestacado ? 'primary' : 'secondary'}
              className="w-full"
              onClick={handleContratar}
            >
              Contratar {plan.nombre}
            </Button>
          </div>

          {/* Badge en el borde superior derecho de la card, sobresaliendo */}
          {plan.badge ? (
            <Badge tone="accent" className="absolute -top-3 -right-3 shrink-0 shadow-md">
              {plan.badge}
            </Badge>
          ) : null}
        </div>
      </div>
    </div>
  )
}
