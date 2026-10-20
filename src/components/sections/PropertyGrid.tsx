import type { Property } from '../../data/properties'
import { PropertyCard } from '../cards/PropertyCard'
import { SectionHeader } from '../ui/SectionHeader'

interface PropertyGridProps {
  properties: readonly Property[]
  eyebrow?: string
  title?: string
  link?: { to: string; label: string }
  alt?: boolean
  id?: string
}

export function PropertyGrid({
  properties,
  eyebrow = 'Curated Opportunities',
  title = 'This month’s selection, chosen for lifestyle and long-term value',
  link,
  alt,
  id = 'opportunities-heading',
}: PropertyGridProps) {
  return (
    <section
      className={alt ? 'section section--alt' : 'section'}
      aria-labelledby={id}
      data-testid="curated-opportunities-section"
    >
      <div className="container">
        <SectionHeader id={id} eyebrow={eyebrow} title={title} link={link} />
        <div className="grid grid--3">
          {properties.map((p, i) => (
            <PropertyCard key={p.slug} property={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
