import { partnerNames } from '../../data/content'
import { Reveal } from '../ui/Reveal'

export function PartnerLogos() {
  return (
    <section className="section section--md section--bordered-y" aria-labelledby="partners-heading" data-testid="developer-partners-section">
      <div className="container">
        <Reveal>
          <h2 id="partners-heading" className="eyebrow" style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            Builder Relationships
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <ul className="partners">
            {partnerNames.map((n) => (
              <li key={n} className="partner" translate="no">
                {n}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
