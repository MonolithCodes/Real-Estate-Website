import { m } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { ctaNav, primaryNav } from '../../data/nav'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { EASE_LUX } from '../../lib/motion'
import { Button } from '../ui/Button'

interface MobileMenuProps {
  id: string
  onNavigate: () => void
}

const slug = (label: string) => label.toLowerCase().replace(/\s+/g, '-')

export function MobileMenu({ id, onNavigate }: MobileMenuProps) {
  const reduced = useReducedMotion()

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration: 0.3, staggerChildren: reduced ? 0 : 0.06, delayChildren: 0.05 },
    },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  }
  const item = {
    hidden: { opacity: 0, y: reduced ? 0 : 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_LUX } },
  }

  return (
    <m.div
      id={id}
      className="mobile-menu"
      data-testid="mobile-menu"
      variants={container}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      <nav className="mobile-menu__nav" aria-label="Mobile">
        {primaryNav.map((link) => (
          <m.div key={link.to} variants={item}>
            <NavLink
              to={link.to}
              end={link.to === '/'}
              className="mobile-menu__link"
              data-testid={`mobile-${slug(link.label)}`}
              onClick={onNavigate}
            >
              {link.label}
            </NavLink>
          </m.div>
        ))}
        <m.div variants={item} className="mobile-menu__cta">
          <Button to={ctaNav.to} onClick={onNavigate} data-testid="mobile-nav-cta-private-consultation">
            {ctaNav.label}
          </Button>
        </m.div>
      </nav>
    </m.div>
  )
}
