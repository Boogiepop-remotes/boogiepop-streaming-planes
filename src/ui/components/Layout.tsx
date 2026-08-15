import type { ReactNode } from 'react'

export type SectionProps = {
  title?: string
  /** Bajada corta debajo del título. */
  lead?: string
  /** Acciones a la derecha del encabezado (botones, filtros). */
  actions?: ReactNode
  children: ReactNode
  className?: string
}

/** Una sección = un propósito + un título + su contenido. */
export function Section({
  title,
  lead,
  actions,
  children,
  className = '',
}: SectionProps) {
  return (
    <section className={`bp-section${className ? ' ' + className : ''}`}>
      {(title || actions) && (
        <header className="bp-section-head">
          <div>
            {title ? <h2 className="bp-section-title">{title}</h2> : null}
            {lead ? <p className="bp-section-lead">{lead}</p> : null}
          </div>
          {actions ? <div className="bp-section-actions">{actions}</div> : null}
        </header>
      )}
      {children}
    </section>
  )
}

export type StackProps = {
  /** Dirección del flujo; `row` envuelve en pantallas chicas. */
  direction?: 'col' | 'row'
  gap?: 'sm' | 'md' | 'lg'
  children: ReactNode
  className?: string
}

/** Espaciado consistente sin márgenes sueltos por app. */
export function Stack({
  direction = 'col',
  gap = 'md',
  children,
  className = '',
}: StackProps) {
  return (
    <div
      className={`bp-stack bp-stack-${direction} bp-gap-${gap}${
        className ? ' ' + className : ''
      }`}
    >
      {children}
    </div>
  )
}

export type GridProps = {
  /** Columnas en desktop; siempre 1 en mobile. */
  cols?: 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
  children: ReactNode
  className?: string
}

export function Grid({ cols = 3, gap = 'md', children, className = '' }: GridProps) {
  return (
    <div
      className={`bp-grid bp-grid-${cols} bp-gap-${gap}${
        className ? ' ' + className : ''
      }`}
    >
      {children}
    </div>
  )
}

export type EmptyStateProps = {
  title: string
  hint?: string
  action?: ReactNode
}

/** Listas vacías, resultados sin match, errores de carga. */
export function EmptyState({ title, hint, action }: EmptyStateProps) {
  return (
    <div className="bp-empty">
      <p className="bp-empty-title">{title}</p>
      {hint ? <p className="bp-empty-hint">{hint}</p> : null}
      {action ? <div className="bp-empty-action">{action}</div> : null}
    </div>
  )
}

/** Placeholder de carga: evita que cada app invente su propio spinner. */
export function Skeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="bp-skeleton" aria-busy="true" aria-live="polite">
      {Array.from({ length: lines }).map((_, i) => (
        <span key={i} className="bp-skeleton-line" />
      ))}
    </div>
  )
}
