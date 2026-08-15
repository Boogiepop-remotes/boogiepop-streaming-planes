import type { HTMLAttributes, ReactNode } from 'react'

type TextTag = 'h1' | 'h2' | 'h3' | 'p' | 'span'

export type TextProps = {
  as?: TextTag
  muted?: boolean
  children: ReactNode
  className?: string
} & Omit<HTMLAttributes<HTMLElement>, 'className'>

export function Text({ as: Tag = 'p', muted = false, children, className = '', ...props }: TextProps) {
  const cls = `${muted ? 'bp-muted' : ''}${className ? (muted ? ' ' : '') + className : ''}`.trim()
  return (
    <Tag className={cls || undefined} {...(props as HTMLAttributes<HTMLElement>)}>
      {children}
    </Tag>
  )
}
