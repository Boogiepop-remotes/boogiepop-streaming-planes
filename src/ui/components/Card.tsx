import type { HTMLAttributes, ReactNode } from 'react'

export type CardProps = {
  children: ReactNode
  className?: string
} & Omit<HTMLAttributes<HTMLDivElement>, 'className'>

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div className={`bp-card${className ? ' ' + className : ''}`} {...props}>
      {children}
    </div>
  )
}
