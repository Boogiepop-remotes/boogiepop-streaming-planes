import { useLocation, Link } from 'react-router-dom'
import { Badge, Button, Card } from '../ui'
import type { Plan, Periodicidad } from '../data/planes'
import { formatearPrecio, etiquetaPeriodicidad } from '../data/planes'

type LocationState = {
  plan?: Plan
  periodicidad?: Periodicidad
}

export function ExitoPage() {
  const location = useLocation()
  const state = (location.state ?? {}) as LocationState
  const plan = state.plan
  const periodicidad = state.periodicidad ?? 'anual'

  if (!plan) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6">
        <Card className="max-w-md p-8 text-center">
          <h1 className="font-display text-3xl text-foreground">No se encontró el plan</h1>
          <p className="mt-2 text-muted">Volvé a elegir un plan para contratar.</p>
          <div className="mt-6">
            <Button href="#/">Ver planes</Button>
          </div>
        </Card>
      </main>
    )
  }

  const precio = plan.precios[periodicidad]

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <Card className="w-full max-w-lg p-8 text-center">
        <div className="mb-4 flex justify-center">
          <Badge tone="ok" className="text-sm">
            ✓ Pago confirmado
          </Badge>
        </div>

        <h1 className="font-display text-4xl text-foreground">
          ¡Bienvenido a {plan.nombre}!
        </h1>

        <p className="mt-3 text-muted">
          Contrataste el plan <strong className="text-foreground">{plan.nombre}</strong> en
          modalidad <strong className="text-foreground">{etiquetaPeriodicidad(periodicidad)}</strong>.
        </p>

        <div className="mt-6 rounded-md bg-surface p-4">
          <p className="text-sm text-muted">Total a pagar</p>
          <p className="font-display text-3xl text-foreground">{formatearPrecio(precio)}</p>
          <p className="mt-1 text-xs text-muted">{plan.ahorroAnual}</p>
        </div>

        <ul className="mx-auto mt-6 max-w-xs space-y-2 text-left">
          {plan.incluye.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-foreground">
              <span className="mt-0.5 text-accent" aria-hidden="true">✓</span>
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-4 py-2 text-sm font-medium text-white no-underline hover:bg-primary/90"
          >
            Volver a los planes
          </Link>
        </div>
      </Card>
    </main>
  )
}
