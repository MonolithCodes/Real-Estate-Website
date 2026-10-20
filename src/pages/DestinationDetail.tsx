import { useParams } from 'react-router-dom'
import { PageHero } from '../components/layout/PageHero'
import { FinalCta } from '../components/sections/FinalCta'
import { Pillars } from '../components/sections/Pillars'
import { PropertyGrid } from '../components/sections/PropertyGrid'
import { Accordion } from '../components/ui/Accordion'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeader } from '../components/ui/SectionHeader'
import { Seo } from '../components/ui/Seo'
import { destinationBySlug } from '../data/destinations'
import { properties } from '../data/properties'
import { NotFound } from './NotFound'

export function DestinationDetail() {
  const { slug = '' } = useParams()
  const d = destinationBySlug(slug)
  if (!d) return <NotFound />

  const featured = properties.filter((p) => p.destination === d.slug)

  return (
    <>
      <Seo title={d.title} description={d.excerpt} />
      <PageHero eyebrow={d.kicker} title={d.title} intro={d.excerpt} image={{ src: d.image, alt: d.imageAlt }} />

      <section className="section section--sm">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Destinations', to: '/destinations' }, { label: d.short }]} />
        </div>
      </section>

      <Pillars id="why-dest" eyebrow={`Why ${d.short}`} title={d.intro} items={d.pillars} numbered />

      <section className="section section--alt" aria-labelledby="districts-heading">
        <div className="container">
          <SectionHeader id="districts-heading" eyebrow="Neighborhoods" title="Where we focus our search" />
          <div className="grid grid--4">
            {d.districts.map((dist, i) => (
              <Reveal key={dist.name} className="fill" delay={(i % 4) * 0.1}>
                <article className="card district">
                  <h3 className="t-h3">{dist.name}</h3>
                  <p className="t-body">{dist.blurb}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--sm" aria-label="Market facts">
        <div className="container fact-band">
          {d.facts.map((f, i) => (
            <Reveal key={f.label} delay={i * 0.1}>
              <p className="fact-band__value">{f.value}</p>
              <p className="t-body">{f.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {featured.length ? (
        <PropertyGrid
          id="featured-heading"
          properties={featured}
          eyebrow="Featured Opportunities"
          title={`Selected homes in ${d.short}`}
          link={{ to: `/opportunities?destination=${d.slug}`, label: 'View all' }}
          alt
        />
      ) : null}

      <section className="section" aria-labelledby="faq-heading">
        <div className="container">
          <SectionHeader id="faq-heading" eyebrow="FAQ" title={`Questions about ${d.short}`} />
          <Reveal>
            <Accordion items={d.faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))} />
          </Reveal>
        </div>
      </section>

      <FinalCta />
    </>
  )
}
