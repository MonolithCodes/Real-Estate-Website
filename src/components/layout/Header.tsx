import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { NavLink, useLocation, useMatches } from 'react-router-dom'
import { ctaNav, primaryNav } from '../../data/nav'
import { useScrolled } from '../../hooks/useScrolled'
import { startScroll, stopScroll } from '../../lib/lenis'
import { isLightHeroRoute } from '../../lib/routeHandle'
import { Button } from '../ui/Button'
import { CloseIcon, MenuIcon } from '../ui/icons'
import { MobileMenu } from './MobileMenu'
import { SiteLogo } from './SiteLogo'

const MENU_ID = 'mobile-menu'
const slug = (label: string) => label.toLowerCase().replace(/\s+/g, '-')

export function Header() {
  const scrolled = useScrolled(40)
  const { pathname } = useLocation()
  // Routes whose hero is light (the home 3D story) keep the solid header from the top.
  const lightHero = isLightHeroRoute(useMatches())

  // The menu is "open" only for the route it was opened on, so navigating closes it without an effect.
  const [openedOn, setOpenedOn] = useState<string | null>(null)
  const open = openedOn === pathname

  useEffect(() => {
    if (!open) return
    document.documentElement.classList.add('menu-open')
    stopScroll()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenedOn(null)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.documentElement.classList.remove('menu-open')
      startScroll()
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  // The menu is a sibling of <header>, not a child: the solid header's backdrop-filter would
  // otherwise become the containing block for the menu's `position: fixed` and collapse it.
  return (
    <>
      <header className={scrolled || open || lightHero ? 'header header--solid' : 'header theme-dark'} data-testid="site-header">
        <div className="container header__inner">
          <SiteLogo />

          <nav className="header__nav" aria-label="Primary">
            {primaryNav.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className="nav-link"
                data-testid={`nav-link-${slug(link.label)}`}
              >
                {link.label}
              </NavLink>
            ))}
            <Button to={ctaNav.to} size="sm" data-testid="nav-cta-private-consultation">
              {ctaNav.label}
            </Button>
          </nav>

          <button
            type="button"
            className="header__toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls={MENU_ID}
            data-testid="mobile-menu-toggle"
            onClick={() => setOpenedOn(open ? null : pathname)}
          >
            {open ? <CloseIcon size={26} /> : <MenuIcon size={26} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open ? <MobileMenu id={MENU_ID} onNavigate={() => setOpenedOn(null)} /> : null}
      </AnimatePresence>
    </>
  )
}
