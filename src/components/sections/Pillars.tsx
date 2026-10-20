import type { Pillar } from '../../data/content'
import { Reveal } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'

interface PillarsProps {
  items: readonly Pillar[]
  eyebrow: string
  title: string
  id: string
  alt?: boolean
  numbered?: boolean
}

export function Pillars({ items, eyebrow, title, id, alt, numbered }: PillarsProps) {
  return (
    <section className={alt ? 'section section--alt' : 'section'} aria-labelledby={id}>
      <div className="container">
        <SectionHeader id={id} eyebrow={eyebrow} title={title} />
        <div className="grid grid--3">
          {items.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.12}>
              <article className="pillar">
                {numbered ? <span className="pillar__num">{String(i + 1).padStart(2, '0')}</span> : null}
                <h3 className="t-h3">{p.title}</h3>
                <p className="t-body">{p.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
