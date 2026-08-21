import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Grid, ToggleGroup } from '../ui'
import { PLANES, PERIODICIDADES, type Periodicidad, type Plan } from '../data/planes'
import { PlanCard } from '../components/PlanCard'
import { PaymentModal } from '../components/PaymentModal'
import { PlanQuizModal } from '../components/PlanQuizModal'

export function LandingPage() {
  const [periodicidad, setPeriodicidad] = useState<Periodicidad>('anual')
  const [planSeleccionado, setPlanSeleccionado] = useState<Plan | null>(null)
  const [quizAbierto, setQuizAbierto] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') !== 'false'
  })
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode))
  }, [darkMode])

  const handleContratar = (plan: Plan) => {
    setPlanSeleccionado(plan)
    setQuizAbierto(false)
  }

  const handleConfirmarPago = () => {
    if (!planSeleccionado) return
    navigate(
      `/exito/${planSeleccionado.id}/${periodicidad}`,
      { state: { plan: planSeleccionado, periodicidad } },
    )
  }

  return (
    <main className={`min-h-screen text-foreground ${darkMode ? 'dark' : ''}`}>
      <div className="mx-auto max-w-6xl px-6 pt-8 pb-16">
        <header className="mb-12 text-center">
          <h1 className="font-display text-5xl leading-tight text-foreground md:text-6xl">
            Elegí tu plan,<br />
            <span className="text-accent">empezá a mirar hoy</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
            Cuatro planes pensados para cada forma de mirar. Contratá mensual,
            trimestral o anual — y cuanto más largo, más conviene.
          </p>
          <div className="mt-6">
            <Button onClick={() => setQuizAbierto(true)}>
              ¿No sabés cuál elegir? Conocé tu plan ideal
            </Button>
          </div>

          <div className="mt-8 flex justify-center">
            <ToggleGroup
              label="Periodicidad de pago"
              options={PERIODICIDADES}
              value={periodicidad}
              onChange={(v) => setPeriodicidad(v as Periodicidad)}
            />
          </div>
        </header>

        <Grid cols={4} gap="md">
          {PLANES.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              periodicidad={periodicidad}
              onContratar={handleContratar}
            />
          ))}
        </Grid>

        <p className="mt-10 text-center text-sm text-muted">
          Todos los planes incluyen cancelación en cualquier momento.
        </p>
      </div>

      {/* Dark mode switch — fijo abajo a la izquierda */}
      <div className="hidden fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 shadow-md">
        <span className="text-xs font-medium text-muted" aria-hidden="true">
          {darkMode ? '🌙' : '☀️'}
        </span>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
            className="peer sr-only"
            aria-label="Alternar modo oscuro"
          />
          <span className="h-5 w-9 rounded-full bg-muted/30 transition-colors peer-checked:bg-accent" />
          <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-background shadow transition-transform peer-checked:translate-x-4" />
        </label>
      </div>

      {planSeleccionado ? (
        <PaymentModal
          plan={planSeleccionado}
          periodicidad={periodicidad}
          onClose={() => setPlanSeleccionado(null)}
          onConfirm={handleConfirmarPago}
        />
      ) : null}

      {quizAbierto ? (
        <PlanQuizModal
          periodicidad={periodicidad}
          onClose={() => setQuizAbierto(false)}
          onContratar={handleContratar}
        />
      ) : null}
    </main>
  )
}
