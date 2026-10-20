import type { ReactNode } from 'react'
import { m } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { EASE_LUX, REVEAL_DISTANCE, REVEAL_DURATION, REVEAL_MARGIN } from '../../lib/motion'

interface RevealProps {
  children: ReactNode
  y?: number
  delay?: number
  once?: boolean
  className?: string
}

/** Scroll reveal: fade + rise once as the element enters the viewport (design.md §9.4). */
export function Reveal({ children, y = REVEAL_DISTANCE, delay = 0, once = true, className }: RevealProps) {
  const reduced = useReducedMotion()

  if (reduced) return <div className={className}>{children}</div>

  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: REVEAL_MARGIN }}
      transition={{ duration: REVEAL_DURATION, delay, ease: EASE_LUX }}
    >
      {children}
    </m.div>
  )
}
