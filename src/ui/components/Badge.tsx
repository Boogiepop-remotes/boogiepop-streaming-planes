import type { ReactNode } from 'react'

export type BadgeProps = {
  /** `accent` destaca (planes recomendados, "más elegido"); `muted` informa. */
  tone?: 'accent' | 'muted' | 'ok' | 'warn'
  children: ReactNode
  className?: string
}

export function Badge({ tone = 'muted', children, className = '' }: BadgeProps) {
  return (
    <span className={`bp-badge bp-badge-${tone}${className ? ' ' + className : ''}`}>
      {children}
    </span>
  )
}
