import type { ReactNode } from 'react'
import { ArrowLink } from './ArrowLink'
import { Eyebrow } from './Eyebrow'
import { Reveal } from './Reveal'

interface SectionHeaderProps {
  eyebrow: string
  title: ReactNode
  link?: { to: string; label: string }
  align?: 'start' | 'center'
  id?: string
  children?: ReactNode
}

export function SectionHeader({ eyebrow, title, link, align = 'start', id, children }: SectionHeaderProps) {
  const cls = align === 'center' ? 'section-header section-header--center' : 'section-header'

  return (
    <div className={cls}>
      <div className={link ? 'section-header__row' : 'section-header__intro'}>
        <Reveal className="section-header__intro">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 id={id} className="t-h2">
            {title}
          </h2>
        </Reveal>
        {link ? (
          <Reveal delay={0.1}>
            <ArrowLink to={link.to}>{link.label}</ArrowLink>
          </Reveal>
        ) : null}
      </div>
      {children}
    </div>
  )
}
