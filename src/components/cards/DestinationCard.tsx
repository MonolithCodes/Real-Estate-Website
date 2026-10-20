import { Link } from 'react-router-dom'
import type { Destination } from '../../data/destinations'
import { ArrowLabel } from '../ui/ArrowLink'
import { Reveal } from '../ui/Reveal'

interface DestinationCardProps {
  destination: Destination
  index?: number
}

export function DestinationCard({ destination: d, index = 0 }: DestinationCardProps) {
  return (
    <Reveal delay={index * 0.1}>
      <Link
        to={`/destinations/${d.slug}`}
        className="dest-card card-hover theme-dark"
        data-testid={`destination-card-${d.slug}`}
      >
        <img className="dest-card__img card-img" src={d.image} alt={d.imageAlt} width={800} height={1000} loading="lazy" decoding="async" />
        <div className="dest-card__shade" />
        <div className="dest-card__content">
          <p className="dest-card__kicker">{d.kicker}</p>
          <h3 className="t-h3-lg">{d.title}</h3>
          <p className="dest-card__text">{d.excerpt}</p>
          <ArrowLabel size="md">Discover</ArrowLabel>
        </div>
      </Link>
    </Reveal>
  )
}
