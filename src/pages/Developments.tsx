import { Link } from 'react-router-dom'
import { PageHero } from '../components/layout/PageHero'
import { FinalCta } from '../components/sections/FinalCta'
import { ArrowLabel } from '../components/ui/ArrowLink'
import { Reveal } from '../components/ui/Reveal'
import { Seo } from '../components/ui/Seo'
import { builders } from '../data/content'

export function Developments() {
  return (
    <>
      <Seo title="Selected Developments" description="Builders and developers we work with across Austin, Dallas–Fort Worth and Houston." />
      <PageHero
        eyebrow="Developments"
        title="Selected developments"
        intro="The builders and communities we know well, reviewed for track record, quality and value."
        image={{ src: '/images/estate-brick.jpg', alt: 'Brick and stone family estate with landscaped lawn' }}
        short
      />
      <section className="section" aria-label="Builders">
        <div className="container">
          <div className="grid grid--2">
            {builders.map((b, i) => (
              <Reveal key={b.slug} className="fill" delay={(i % 2) * 0.1}>
                <Link to={`/developments/${b.slug}`} className="card card-hover builder-card" data-testid={`builder-card-${b.slug}`}>
                  <p className="eyebrow">{b.focus}</p>
                  <h2 className="t-h3-lg" translate="no">
                    {b.name}
                  </h2>
                  <p className="t-body">{b.summary}</p>
                  <div className="builder-card__stats">
                    {b.stats.map((s) => (
                      <div key={s.label}>
                        <p className="t-h3">{s.value}</p>
                        <p className="t-label">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <ArrowLabel size="md">View Developer</ArrowLabel>
                </Link>
              </Reveal>
            ))}
          </div>
          <p className="t-legal mt-8">Sample builders for demonstration. Replace with verified partners.</p>
        </div>
      </section>
      <FinalCta />
    </>
  )
}
