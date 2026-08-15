import { useState } from 'react'
import { Button, Field, Input } from '../ui'
import type { Plan, Periodicidad } from '../data/planes'
import { formatearPrecio, etiquetaPeriodicidad } from '../data/planes'

type PaymentModalProps = {
  plan: Plan
  periodicidad: Periodicidad
  onClose: () => void
  onConfirm: () => void
}

function soloDigitos(valor: string): string {
  return valor.replace(/\D/g, '')
}

function validarNumero(numero: string): boolean {
  const limpio = soloDigitos(numero)
  if (limpio.length < 13 || limpio.length > 19) return false
  let suma = 0
  let doble = false
  for (let i = limpio.length - 1; i >= 0; i--) {
    let d = Number(limpio[i])
    if (doble) {
      d *= 2
      if (d > 9) d -= 9
    }
    suma += d
    doble = !doble
  }
  return suma % 10 === 0
}

function validarVencimiento(valor: string): boolean {
  const m = /^(\d{2})\/(\d{2})$/.exec(valor)
  if (!m) return false
  const mes = Number(m[1])
  const anio = 2000 + Number(m[2])
  if (mes < 1 || mes > 12) return false
  const ahora = new Date()
  const actual = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
  const venc = new Date(anio, mes, 1)
  return venc >= actual
}

function validarCvv(cvv: string): boolean {
  return /^\d{3,4}$/.test(cvv)
}

export function PaymentModal({ plan, periodicidad, onClose, onConfirm }: PaymentModalProps) {
  const [numero, setNumero] = useState('')
  const [vencimiento, setVencimiento] = useState('')
  const [cvv, setCvv] = useState('')
  const [errores, setErrores] = useState<{ numero?: string; vencimiento?: string; cvv?: string }>({})
  const [confirmando, setConfirmando] = useState(false)

  const precio = plan.precios[periodicidad]

  const formatearNumero = (v: string) => {
    const d = soloDigitos(v).slice(0, 16)
    return d.replace(/(\d{4})(?=\d)/g, '$1 ')
  }

  const formatearVencimiento = (v: string) => {
    const d = soloDigitos(v).slice(0, 4)
    if (d.length <= 2) return d
    return `${d.slice(0, 2)}/${d.slice(2)}`
  }

  const handleConfirmar = () => {
    const nuevos: typeof errores = {}
    if (!validarNumero(numero)) nuevos.numero = 'Número de tarjeta inválido'
    if (!validarVencimiento(vencimiento)) nuevos.vencimiento = 'Vencimiento inválido o ya vencido'
    if (!validarCvv(cvv)) nuevos.cvv = 'Código de seguridad inválido'
    setErrores(nuevos)
    if (Object.keys(nuevos).length === 0) {
      setConfirmando(true)
      onConfirm()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Pagar plan ${plan.nombre}`}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="font-display text-2xl text-foreground">Pagar {plan.nombre}</h2>
            <p className="mt-1 text-sm text-muted">
              {etiquetaPeriodicidad(periodicidad)} · {formatearPrecio(precio)}
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

        <div className="space-y-4">
          <Field label="Número de tarjeta" htmlFor="card-numero" required error={errores.numero}>
            <Input
              id="card-numero"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="1234 5678 9012 3456"
              value={numero}
              onChange={(e) => setNumero(formatearNumero(e.target.value))}
              error={errores.numero}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Vencimiento" htmlFor="card-vencimiento" required error={errores.vencimiento}>
              <Input
                id="card-vencimiento"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/AA"
                value={vencimiento}
                onChange={(e) => setVencimiento(formatearVencimiento(e.target.value))}
                error={errores.vencimiento}
              />
            </Field>

            <Field label="Código de seguridad" htmlFor="card-cvv" required error={errores.cvv}>
              <Input
                id="card-cvv"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="123"
                type="password"
                maxLength={4}
                value={cvv}
                onChange={(e) => setCvv(soloDigitos(e.target.value).slice(0, 4))}
                error={errores.cvv}
              />
            </Field>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="flex-1" onClick={handleConfirmar} disabled={confirmando}>
            {confirmando ? 'Procesando…' : 'Confirmar pago'}
          </Button>
        </div>
      </div>
    </div>
  )
}
