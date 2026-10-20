import { m } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { EASE_LUX } from '../../lib/motion'
import { site } from '../../data/site'
import { Button } from '../ui/Button'
import { Eyebrow } from '../ui/Eyebrow'

/** Home hero with the staged intro from design.md §9.3. */
export function Hero() {
  const reduced = useReducedMotion()

  const fade = (delay: number, y: number, duration = 0.9) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y },
          animate: { opacity: 1, y: 0 },
          transition: { duration, delay, ease: EASE_LUX },
        }

  const line = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { y: '110%' },
          animate: { y: '0%' },
          transition: { duration: 0.9, delay, ease: EASE_LUX },
        }

  return (
    <section className="hero theme-dark grain" data-testid="home-hero" aria-labelledby="hero-title">
      <div className="hero__media">
        <m.img
          src="/images/hero.jpg"
          alt="Contemporary Texas home with a swimming pool and lounge terrace"
          width={2400}
          height={1601}
          fetchPriority="high"
          initial={reduced ? false : { scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.6, ease: EASE_LUX }}
        />
        <div className="hero__shade" />
      </div>

      <div className="container hero__content">
        <m.div {...fade(0.15, 16, 0.7)}>
          <Eyebrow>
            {site.brandName} · Austin · Dallas–Fort Worth · Houston
          </Eyebrow>
        </m.div>

        <h1 id="hero-title" className="t-hero hero__title">
          <span className="mask-line">
            <m.span style={{ display: 'block' }} {...line(0.25)}>
              Live the Texas lifestyle.
            </m.span>
          </span>
          <span className="mask-line">
            <m.span className="text-gold-gradient hero__accent" style={{ display: 'block' }} {...line(0.45)}>
              Own the address.
            </m.span>
          </span>
        </h1>

        <m.p className="t-tagline" {...fade(0.85, 18)}>
          Texas Property Advisory for Relocating &amp; Out-of-State Buyers
        </m.p>

        <m.p className="t-lead hero__lead" {...fade(1, 22)}>
          Curated Texas homes, land and investments, chosen for lifestyle and long-term value, with the
          market intelligence and builder access to buy with confidence.
        </m.p>

        <m.div className="hero__ctas" {...fade(1.1, 22)}>
          <Button to="/opportunities" data-testid="hero-cta-opportunities">
            Explore Curated Opportunities
          </Button>
          <Button to="/private-consultation" variant="ghost" data-testid="hero-cta-consultation">
            Private Consultation
          </Button>
        </m.div>

        <m.p className="hero__helper" {...(reduced ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.9, delay: 1.35 } })}>
          Relocating to Texas?{' '}
          <Button to="/insights/buying-property-in-texas" variant="link">
            Read our step-by-step buying guide
          </Button>
        </m.p>
      </div>
    </section>
  )
}
