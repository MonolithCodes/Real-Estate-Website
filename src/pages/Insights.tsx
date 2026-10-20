import { Link } from 'react-router-dom'
import { ArticleCard } from '../components/cards/ArticleCard'
import { PageHero } from '../components/layout/PageHero'
import { FinalCta } from '../components/sections/FinalCta'
import { Button } from '../components/ui/Button'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Reveal } from '../components/ui/Reveal'
import { Seo } from '../components/ui/Seo'
import { articles } from '../data/content'
import { formatDate } from '../lib/format'

export function Insights() {
  const [featured, ...rest] = articles

  return (
    <>
      <Seo title="Insights" description="Guides and market notes for buying property in Texas, from relocation checklists to acreage due diligence." />
      <PageHero
        short
        eyebrow="Insights"
        title="Guides & insights"
        intro="Plain-English guidance for buying and owning property in Texas."
        image={{ src: '/images/interior-kitchen.jpg', alt: 'Bright luxury kitchen with a marble island' }}
      />

      <section className="section" aria-labelledby="featured-article">
        <div className="container split">
          <Reveal className="split__text">
            <Eyebrow>
              Featured · {featured.category} · {featured.readTime}
            </Eyebrow>
            <h2 id="featured-article" className="t-h2">
              {featured.title}
            </h2>
            <p className="t-lead">{featured.excerpt}</p>
            <p className="t-legal">{formatDate(featured.date)}</p>
            <Button to={`/insights/${featured.slug}`} variant="outline">
              Read Article
            </Button>
          </Reveal>
          <Reveal className="split__media" delay={0.15}>
            <Link to={`/insights/${featured.slug}`} aria-label={featured.title}>
              <img src={featured.image} alt={featured.imageAlt} width={1600} height={1000} loading="lazy" decoding="async" />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="section section--alt" aria-label="More articles">
        <div className="container">
          <div className="grid grid--3">
            {rest.map((a, i) => (
              <ArticleCard key={a.slug} article={a} index={i} />
            ))}
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  )
}
