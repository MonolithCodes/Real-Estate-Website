import { Link } from 'react-router-dom'
import type { Article } from '../../data/content'
import { formatDate } from '../../lib/format'
import { ArrowLabel } from '../ui/ArrowLink'
import { Reveal } from '../ui/Reveal'

export function ArticleCard({ article: a, index = 0 }: { article: Article; index?: number }) {
  return (
    <Reveal className="fill" delay={(index % 3) * 0.1}>
      <Link to={`/insights/${a.slug}`} className="card card-hover property-card" data-testid={`article-card-${a.slug}`}>
        <div className="article-card__media">
          <img className="card-img" src={a.image} alt={a.imageAlt} width={800} height={450} loading="lazy" decoding="async" />
        </div>
        <div className="article-card__body">
          <p className="article-card__meta">
            {a.category} · {formatDate(a.date)} · {a.readTime}
          </p>
          <h3 className="t-card-title property-card__title">{a.title}</h3>
          <p className="property-card__descriptor">{a.excerpt}</p>
          <ArrowLabel>Read Article</ArrowLabel>
        </div>
      </Link>
    </Reveal>
  )
}
