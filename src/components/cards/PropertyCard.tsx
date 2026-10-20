import { Link } from 'react-router-dom'
import type { Property } from '../../data/properties'
import { ArrowLabel } from '../ui/ArrowLink'
import { MapPinIcon } from '../ui/icons'
import { Reveal } from '../ui/Reveal'
import { Tag } from '../ui/Tag'

interface PropertyCardProps {
  property: Property
  /** Position in the grid, used to stagger the reveal by column. */
  index?: number
  columns?: number
}

export function PropertyCard({ property: p, index = 0, columns = 3 }: PropertyCardProps) {
  return (
    <Reveal className="fill" delay={(index % columns) * 0.1}>
      <Link
        to={`/opportunities/${p.slug}`}
        className="card card-hover property-card"
        data-testid={`project-card-${p.slug}`}
      >
        <div className="property-card__media">
          <img className="card-img" src={p.image} alt={p.imageAlt} width={800} height={600} loading="lazy" decoding="async" />
          <Tag className="property-card__tag">{p.tag}</Tag>
        </div>
        <div className="property-card__body">
          <p className="property-card__location">
            <MapPinIcon size={13} />
            {p.location}
          </p>
          <h3 className="t-card-title property-card__title" data-testid="project-card-title">
            {p.title}
          </h3>
          <p className="property-card__descriptor">{p.descriptor}</p>
          <div className="property-card__foot">
            <span className="property-card__price" data-testid="project-card-price">
              {p.price}
            </span>
            <ArrowLabel>View Details</ArrowLabel>
          </div>
        </div>
      </Link>
    </Reveal>
  )
}
