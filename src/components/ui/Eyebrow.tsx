import type { ReactNode } from 'react'

interface EyebrowProps {
  children: ReactNode
  className?: string
}

export function Eyebrow({ children, className }: EyebrowProps) {
  return <p className={className ? `eyebrow ${className}` : 'eyebrow'}>{children}</p>
}
