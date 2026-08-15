import type { SelectHTMLAttributes } from 'react'

export type SelectOption = { value: string; label: string }

export type SelectProps = {
  label?: string
  options: SelectOption[]
  error?: string
  placeholder?: string
  className?: string
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'>

export function Select({ label, options, error, placeholder, className = '', id, ...props }: SelectProps) {
  const selectId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
  return (
    <div className="bp-field">
      {label && <label className="bp-label" htmlFor={selectId}>{label}</label>}
      <select
        id={selectId}
        className={`bp-select${error ? ' bp-input--error' : ''}${className ? ' ' + className : ''}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span className="bp-error-msg">{error}</span>}
    </div>
  )
}
