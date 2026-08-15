import type { ReactNode } from 'react'

export type FieldProps = {
  label: string
  /** Se cablea con el control hijo vía htmlFor/id. */
  htmlFor: string
  hint?: string
  error?: string
  required?: boolean
  children: ReactNode
}

/**
 * Label + control + estado de error, con la relación htmlFor/id explícita.
 * Que el error viva acá y no en cada form evita que cada app invente su propia
 * forma de mostrarlo.
 */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
}: FieldProps) {
  return (
    <div className="bp-field">
      <label className="bp-field-label" htmlFor={htmlFor}>
        {label}
        {required ? <span className="bp-field-required"> *</span> : null}
      </label>
      {children}
      {error ? (
        <p className="bp-field-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="bp-field-hint">{hint}</p>
      ) : null}
    </div>
  )
}
