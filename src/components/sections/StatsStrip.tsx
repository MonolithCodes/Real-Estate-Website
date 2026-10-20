import { stats } from '../../data/content'
import { Reveal } from '../ui/Reveal'

export function StatsStrip() {
  return (
    <section className="section section--sm section--bordered-b" aria-label="Texas at a glance" data-testid="stats-section">
      <div className="container">
        <dl className="stats">
          {stats.map((s, i) => (
            <Reveal key={s.label} className="stat" delay={i * 0.1}>
              <dt className="stat__label">{s.label}</dt>
              <dd className="t-stat" style={{ margin: 0 }}>
                {s.value}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}
