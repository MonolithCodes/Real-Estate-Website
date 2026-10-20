import type { ReactNode } from 'react'

interface TagProps {
  children: ReactNode
  variant?: 'gold' | 'outline'
  className?: string
}

export function Tag({ children, variant = 'gold', className }: TagProps) {
  const cls = ['tag', variant === 'outline' ? 'tag--outline' : '', className].filter(Boolean).join(' ')
  return <span className={cls}>{children}</span>
}
