export type ToggleOption<T extends string = string> = {
  value: T
  label: string
  /** Texto chico bajo el label (ahorros, aclaraciones). */
  hint?: string
}

export type ToggleGroupProps<T extends string = string> = {
  options: ToggleOption<T>[]
  value: T
  onChange: (value: T) => void
  /** Describe el grupo para lectores de pantalla ("Periodicidad de pago"). */
  label: string
  className?: string
}

/**
 * Selector de una opción entre pocas, en línea: periodicidad de pago, rangos,
 * filtros de vista.
 *
 * Existe porque sin él cada app lo rearma con `<button>` crudos y un
 * `className` con ternarios — que es exactamente lo que la librería viene a
 * evitar. Es `radiogroup`, no una fila de botones: la selección es un estado,
 * no una acción, y con flechas se navega como corresponde.
 */
export function ToggleGroup<T extends string = string>({
  options,
  value,
  onChange,
  label,
  className = '',
}: ToggleGroupProps<T>) {
  const move = (dir: 1 | -1) => {
    const i = options.findIndex((o) => o.value === value)
    if (i < 0) return
    const next = options[(i + dir + options.length) % options.length]
    if (next) onChange(next.value)
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={`bp-toggle-group${className ? ' ' + className : ''}`}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault()
          move(1)
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault()
          move(-1)
        }
      }}
    >
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            className={`bp-toggle-option${active ? ' bp-toggle-option-active' : ''}`}
            onClick={() => onChange(o.value)}
          >
            <span className="bp-toggle-label">{o.label}</span>
            {o.hint ? <span className="bp-toggle-hint">{o.hint}</span> : null}
          </button>
        )
      })}
    </div>
  )
}
