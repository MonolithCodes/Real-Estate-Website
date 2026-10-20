import { m, useScroll } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { ArticleCard } from '../components/cards/ArticleCard'
import { PageHero } from '../components/layout/PageHero'
import { FinalCta } from '../components/sections/FinalCta'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { Button } from '../components/ui/Button'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeader } from '../components/ui/SectionHeader'
import { Seo } from '../components/ui/Seo'
import { articleBySlug, articles } from '../data/content'
import { site } from '../data/site'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { formatDate } from '../lib/format'
import { NotFound } from './NotFound'

function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  const reduced = useReducedMotion()
  if (reduced) return null
  return <m.div className="progress-bar" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
}

export function Article() {
  const { slug = '' } = useParams()
  const a = articleBySlug(slug)
  if (!a) return <NotFound />

  const related = articles.filter((x) => x.slug !== a.slug).slice(0, 3)

  return (
    <>
      <Seo
        title={a.title}
        description={a.excerpt}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: a.title,
          datePublished: a.date,
          author: { '@type': 'Organization', name: site.brandName },
        }}
      />
      <ReadingProgress />
      <PageHero
        short
        size="md"
        eyebrow={`${a.category} · ${a.readTime}`}
        title={a.title}
        intro={`Published ${formatDate(a.date)}`}
        image={{ src: a.image, alt: a.imageAlt }}
      />

      <article className="section section--sm">
        <div className="container stack">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Insights', to: '/insights' }, { label: a.category }]} />
          <div className="prose">
            {a.body.map((b, i) => (
              <Reveal key={b.heading ?? i} className="stack">
                {b.heading ? <h2>{b.heading}</h2> : null}
                <p>{b.text}</p>
              </Reveal>
            ))}
            <p className="notice">
              This article is general information only and not legal, tax or financial advice. Please consult a licensed professional.
            </p>
            <Reveal className="stack">
              <h2>Talk it through with an advisor</h2>
              <p>We are happy to walk you through the process for your situation.</p>
              <Button to="/private-consultation">Book a Private Consultation</Button>
            </Reveal>
          </div>
        </div>
      </article>

      <section className="section section--alt" aria-labelledby="related-heading">
        <div className="container">
          <SectionHeader id="related-heading" eyebrow="Keep Reading" title="Related articles" />
          <div className="grid grid--3">
            {related.map((r, i) => (
              <ArticleCard key={r.slug} article={r} index={i} />
            ))}
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  )
}
