import { testimonials } from '../../data/content'
import { TestimonialCard } from '../cards/TestimonialCard'
import { SectionHeader } from '../ui/SectionHeader'

interface TestimonialsProps {
  alt?: boolean
  link?: boolean
}

export function Testimonials({ alt = true, link = true }: TestimonialsProps) {
  return (
    <section className={alt ? 'section section--alt' : 'section'} aria-labelledby="stories-heading" data-testid="home-testimonials-section">
      <div className="container">
        <SectionHeader
          id="stories-heading"
          eyebrow="Client Stories"
          title="Trusted across state lines and continents"
          link={link ? { to: '/client-stories', label: 'All client stories' } : undefined}
        />
        <div className="grid grid--3">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} t={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
