import { destinations } from '../../data/destinations'
import { DestinationCard } from '../cards/DestinationCard'
import { SectionHeader } from '../ui/SectionHeader'

export function DestinationGrid() {
  return (
    <section className="section section--alt" aria-labelledby="destinations-heading" data-testid="lifestyle-destinations-section">
      <div className="container">
        <SectionHeader
          id="destinations-heading"
          eyebrow="Lifestyle Destinations"
          title="Three metros. Three rhythms of life."
          link={{ to: '/destinations', label: 'All destinations' }}
        />
        <div className="grid grid--3">
          {destinations.map((d, i) => (
            <DestinationCard key={d.slug} destination={d} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
