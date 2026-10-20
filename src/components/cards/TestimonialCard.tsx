import type { Testimonial } from '../../data/content'
import { Reveal } from '../ui/Reveal'
import { Tag } from '../ui/Tag'

export function TestimonialCard({ t, index = 0 }: { t: Testimonial; index?: number }) {
  return (
    <Reveal className="fill" delay={index * 0.1}>
      <figure className="card quote">
        <span className="quote__mark" aria-hidden="true">
          “
        </span>
        <blockquote className="quote__text">{t.quote}</blockquote>
        <figcaption className="quote__meta">
          <span className="quote__name">{t.name}</span>
          <span className="quote__desc">{t.descriptor}</span>
          <span>
            <Tag variant="outline" className="tag--on-light">
              {t.buyerType}
            </Tag>
          </span>
        </figcaption>
      </figure>
    </Reveal>
  )
}
