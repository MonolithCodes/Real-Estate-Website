import { PageHero } from '../components/layout/PageHero'
import { FinalCta } from '../components/sections/FinalCta'
import { Pillars } from '../components/sections/Pillars'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeader } from '../components/ui/SectionHeader'
import { Seo } from '../components/ui/Seo'
import { team } from '../data/content'
import { site } from '../data/site'

const values = [
  { title: 'Clarity', text: 'Plain-English advice, candid pros and cons, and numbers you can check.' },
  { title: 'Discretion', text: 'Private conversations and confidential handling of your plans and details.' },
  { title: 'Local depth', text: 'On-the-ground knowledge of neighborhoods, builders and what really drives value.' },
] as const

export function About() {
  return (
    <>
      <Seo title="About" description={`About ${site.brandName}: a Texas property advisory focused on clarity, discretion and local depth.`} />
      <PageHero
        eyebrow="About"
        title="Founders & team"
        intro="A Texas advisory built around the people we serve."
        image={{ src: '/images/interior-glass.jpg', alt: 'Glass-walled living space opening onto a pool terrace' }}
      />

      <section className="section" aria-labelledby="story-heading">
        <div className="container split">
          <Reveal className="split__text">
            <Eyebrow>Our Story</Eyebrow>
            <h2 id="story-heading" className="t-h2">
              Advice first, transactions second
            </h2>
            <p className="t-lead">
              We started {site.brandName} after seeing how hard it is to buy well from out of state. Our approach pairs lifestyle
              understanding with disciplined analysis, so clients decide with confidence.
            </p>
            <p className="t-body">Founded in Austin in 2014 by Daniel Hartwell, the firm now advises clients across three Texas metros. We keep our client list deliberately small so every buyer gets a senior advisor’s full attention.</p>
          </Reveal>
          <Reveal className="split__media" delay={0.15}>
            <img src="/images/interior-living.jpg" alt="Bright, modern living room" width={1600} height={1088} loading="lazy" decoding="async" />
          </Reveal>
        </div>
      </section>

      <Pillars id="values-heading" eyebrow="Our Values" title="How we work" items={values} alt numbered />

      <section className="section" aria-labelledby="team-heading">
        <div className="container">
          <SectionHeader id="team-heading" eyebrow="Team" title="The people behind your search" />
          <div className="grid grid--3">
            {team.map((m, i) => (
              <Reveal key={m.role} className="fill" delay={i * 0.1}>
                <article className="card team-card">
                  <span className="team-card__avatar text-gold-gradient" aria-hidden="true">
                    {m.name.replace(/[[\]]/g, '').charAt(0)}
                  </span>
                  <h3 className="t-h3" translate="no">
                    {m.name}
                  </h3>
                  <p className="eyebrow">{m.role}</p>
                  <p className="t-body">{m.bio}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="t-legal mt-8">{site.license}</p>
        </div>
      </section>

      <FinalCta />
    </>
  )
}
