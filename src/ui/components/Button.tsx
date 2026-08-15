import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type BaseProps = {
  variant?: 'primary' | 'secondary'
  size?: 'md' | 'sm'
  children: ReactNode
  className?: string
}

type AsButton = BaseProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & { href?: never }
type AsAnchor = BaseProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & { href: string }

export type ButtonProps = AsButton | AsAnchor

export function Button({ variant = 'primary', size, children, className = '', ...props }: ButtonProps) {
  const base = variant === 'primary' ? 'bp-btn-primary' : 'bp-btn-secondary'
  const sz = size === 'sm' ? ' bp-btn-sm' : ''
  const cls = `${base}${sz}${className ? ' ' + className : ''}`

  if ('href' in props && props.href !== undefined) {
    const { href, ...rest } = props as AsAnchor
    return <a href={href} className={cls} {...rest}>{children}</a>
  }

  const { ...rest } = props as AsButton
  return <button className={cls} {...rest}>{children}</button>
}
