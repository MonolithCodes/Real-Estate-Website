import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightIcon } from './icons'

interface ArrowLinkProps {
  to: string
  children: ReactNode
  size?: 'md' | 'sm'
  className?: string
  'data-testid'?: string
}

export function ArrowLink({ to, children, size = 'md', className, ...rest }: ArrowLinkProps) {
  const cls = ['arrow-link', size === 'sm' ? 'arrow-link--sm' : '', className].filter(Boolean).join(' ')
  return (
    <Link to={to} className={cls} data-testid={rest['data-testid']}>
      {children}
      <ArrowRightIcon size={size === 'sm' ? 14 : 16} className="arrow-link__icon" />
    </Link>
  )
}

/** Non-interactive variant for use inside an already-linked card (avoids nested anchors). */
export function ArrowLabel({ children, size = 'sm' }: { children: ReactNode; size?: 'md' | 'sm' }) {
  return (
    <span className={size === 'sm' ? 'arrow-link arrow-link--sm' : 'arrow-link'}>
      {children}
      <ArrowRightIcon size={size === 'sm' ? 14 : 16} className="arrow-link__icon" />
    </span>
  )
}
