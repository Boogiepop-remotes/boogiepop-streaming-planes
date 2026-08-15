import { useId } from 'react'

export type SearchSelectProps = {
  /** Opciones reales del dataset. Vacío = el control queda deshabilitado. */
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  id?: string
  className?: string
}

/**
 * Filtro de una lista larga: se escribe para acotar y se elige una opción.
 *
 * Un `Select` con cincuenta autores es inusable y un `Input` de texto libre le
 * pide al usuario que adivine qué valores existen. Las opciones se pasan desde
 * los datos ya cargados, nunca hardcodeadas: si un tema no está en el dataset,
 * no tiene por qué estar en el filtro.
 *
 * Usa `<datalist>` nativo — sin dependencias, con el autocompletado y la
 * accesibilidad que ya trae el navegador.
 */
export function SearchSelect({
  options,
  value,
  onChange,
  placeholder,
  id,
  className = '',
}: SearchSelectProps) {
  const auto = useId()
  const listId = `${id || auto}-opciones`
  return (
    <div className={`bp-searchselect${className ? ' ' + className : ''}`}>
      <input
        id={id}
        className="bp-input bp-searchselect-input"
        list={listId}
        value={value}
        disabled={options.length === 0}
        placeholder={placeholder || 'Escribí para filtrar…'}
        onChange={(e) => onChange(e.target.value)}
      />
      {value ? (
        <button
          type="button"
          className="bp-searchselect-clear"
          aria-label="Limpiar filtro"
          onClick={() => onChange('')}
        >
          ×
        </button>
      ) : null}
      <datalist id={listId}>
        {options.map((o) => (
          <option key={o} value={o} />
        ))}
      </datalist>
    </div>
  )
}
