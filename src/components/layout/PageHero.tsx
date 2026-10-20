import type { ReactNode } from 'react'
import { m } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { EASE_LUX } from '../../lib/motion'
import { Eyebrow } from '../ui/Eyebrow'

interface PageHeroProps {
  eyebrow: string
  title: ReactNode
  intro?: string
  image?: { src: string; alt: string }
  short?: boolean
  /** `md` for long titles such as article headlines. */
  size?: 'lg' | 'md'
  children?: ReactNode
}

/** Inner-page hero (design.md §6.3): image settles from scale 1.12, text rises in after 0.5s. */
export function PageHero({ eyebrow, title, intro, image, short, size = 'lg', children }: PageHeroProps) {
  const reduced = useReducedMotion()
  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: EASE_LUX },
        }

  return (
    <section className={short ? 'page-hero page-hero--short theme-dark grain' : 'page-hero theme-dark grain'}>
      <div className="page-hero__media" aria-hidden={image ? undefined : true}>
        {image ? (
          <m.img
            src={image.src}
            alt={image.alt}
            width={1920}
            height={1080}
            fetchPriority="high"
            initial={reduced ? false : { scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.2, ease: EASE_LUX }}
          />
        ) : null}
        <div className="page-hero__shade" />
      </div>
      <div className="container page-hero__content">
        <m.div {...rise(0.5)}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </m.div>
        <m.h1 className={size === 'md' ? 't-hero t-hero--md' : 't-hero'} {...rise(0.55)}>
          {title}
        </m.h1>
        {intro ? (
          <m.p className="t-lead" {...rise(0.65)}>
            {intro}
          </m.p>
        ) : null}
        {children ? <m.div {...rise(0.8)}>{children}</m.div> : null}
      </div>
    </section>
  )
}
