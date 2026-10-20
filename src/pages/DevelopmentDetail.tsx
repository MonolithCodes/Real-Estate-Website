import { useParams } from 'react-router-dom'
import { PageHero } from '../components/layout/PageHero'
import { FinalCta } from '../components/sections/FinalCta'
import { PropertyGrid } from '../components/sections/PropertyGrid'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { Reveal } from '../components/ui/Reveal'
import { Seo } from '../components/ui/Seo'
import { builderBySlug } from '../data/content'
import { properties } from '../data/properties'
import { NotFound } from './NotFound'

export function DevelopmentDetail() {
  const { slug = '' } = useParams()
  const b = builderBySlug(slug)
  if (!b) return <NotFound />

  const projects = properties.filter((p) => p.builder === b.name)

  return (
    <>
      <Seo title={b.name} description={b.summary} />
      <PageHero
        short
        eyebrow={b.focus}
        title={b.name}
        intro={b.summary}
        image={{ src: projects[0]?.image ?? '/images/hero.jpg', alt: projects[0]?.imageAlt ?? 'Texas residence' }}
      />
      <section className="section section--sm">
        <div className="container stack">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Developments', to: '/developments' }, { label: b.name }]} />
          <Reveal>
            <div className="fact-band">
              {b.stats.map((s) => (
                <div key={s.label}>
                  <p className="fact-band__value">{s.value}</p>
                  <p className="t-body">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
      {projects.length ? (
        <PropertyGrid id="builder-projects" properties={projects} eyebrow="Current Projects" title={`Opportunities by ${b.name}`} alt />
      ) : null}
      <FinalCta />
    </>
  )
}
