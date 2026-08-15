import type { InputHTMLAttributes } from 'react'

export type InputProps = {
  label?: string
  error?: string
  className?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'className'>

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
  return (
    <div className="bp-field">
      {label && <label className="bp-label" htmlFor={inputId}>{label}</label>}
      <input
        id={inputId}
        className={`bp-input${error ? ' bp-input--error' : ''}${className ? ' ' + className : ''}`}
        {...props}
      />
      {error && <span className="bp-error-msg">{error}</span>}
    </div>
  )
}
