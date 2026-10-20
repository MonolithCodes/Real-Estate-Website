import { PageHero } from '../components/layout/PageHero'
import { FinalCta } from '../components/sections/FinalCta'
import { Button } from '../components/ui/Button'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeader } from '../components/ui/SectionHeader'
import { Seo } from '../components/ui/Seo'
import { destinations } from '../data/destinations'

const compareRows = [
  { label: 'Known for', values: ['Lakes, limestone hills, creative economy', 'Corporate hub, polished enclaves', 'Medical, energy, dining and culture'] },
  { label: 'Typical homes', values: ['Lake estates, Hill Country acreage, downtown condos', 'Established estates, new gated communities', 'Inner-loop townhomes, wooded retreats, condos'] },
  { label: 'Best for', values: ['Outdoor-minded buyers and second homes', 'Relocating families and new construction', 'Variety, urban living and investment condos'] },
] as const

export function Destinations() {
  return (
    <>
      <Seo
        title="Texas Destinations"
        description="Compare Austin and the Hill Country, Dallas–Fort Worth, and Houston with The Woodlands. Neighborhoods, lifestyle and property types explained."
      />
      <PageHero
        eyebrow="Destinations"
        title="Three metros. Three rhythms of life."
        intro="Texas offers very different ways to live. Explore the markets we advise on and find the one that fits."
        image={{ src: '/images/hill-country.jpg', alt: 'Rolling Texas Hill Country landscape under a pale sky' }}
      />

      {destinations.map((d, i) => (
        <section key={d.slug} className={i % 2 ? 'section section--alt' : 'section'} aria-labelledby={`dest-${d.slug}`}>
          <div className={i % 2 ? 'container split split--reverse' : 'container split'}>
            <Reveal className="split__text">
              <Eyebrow>{d.kicker}</Eyebrow>
              <h2 id={`dest-${d.slug}`} className="t-h2">
                {d.title}
              </h2>
              <p className="t-lead">{d.intro}</p>
              <Button to={`/destinations/${d.slug}`} variant="outline">
                Discover {d.short}
              </Button>
            </Reveal>
            <Reveal className="split__media" delay={0.15}>
              <img src={d.image} alt={d.imageAlt} width={1600} height={1000} loading="lazy" decoding="async" />
            </Reveal>
          </div>
        </section>
      ))}

      <section className="section" aria-labelledby="compare-heading">
        <div className="container">
          <SectionHeader id="compare-heading" eyebrow="At a Glance" title="Which market suits you?" />
          <Reveal>
            <div className="table-wrap">
              <table className="facts compare">
                <caption className="visually-hidden">Comparison of Texas destinations</caption>
                <thead>
                  <tr>
                    <td />
                    {destinations.map((d) => (
                      <th key={d.slug} scope="col">
                        {d.short}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map((r) => (
                    <tr key={r.label}>
                      <th scope="row">{r.label}</th>
                      {r.values.map((v) => (
                        <td key={v}>{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      <FinalCta />
    </>
  )
}
