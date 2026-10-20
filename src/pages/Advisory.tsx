import { PageHero } from '../components/layout/PageHero'
import { FinalCta } from '../components/sections/FinalCta'
import { Pillars } from '../components/sections/Pillars'
import { Accordion } from '../components/ui/Accordion'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeader } from '../components/ui/SectionHeader'
import { Seo } from '../components/ui/Seo'
import { advisorySteps, pillars } from '../data/content'

const faqs = [
  { id: 'f1', question: 'Who do you work with?', answer: 'Relocating families, out-of-state and international second-home buyers, and investors looking at Texas residential and land opportunities.' },
  { id: 'f2', question: 'How are you compensated?', answer: 'Compensation arrangements are explained in writing before you commit to anything. Please see the Information About Brokerage Services notice.' },
  { id: 'f3', question: 'Can you advise on legal and tax matters?', answer: 'No. We coordinate with your attorney, title company and tax professional, and we will gladly recommend local specialists.' },
  { id: 'f4', question: 'Do I need to visit Texas to buy?', answer: 'Not necessarily. We arrange live video tours and local representation, though we recommend visiting before you finalize.' },
] as const

export function Advisory() {
  return (
    <>
      <Seo title="Advisory" description="Lifestyle-led, evidence-backed property advisory for Texas buyers: discovery, shortlist, due diligence and closing." />
      <PageHero
        eyebrow="Advisory"
        title="Advisory first. Always."
        intro="We start with the life you want to live, then match it to the right neighborhood, home and numbers."
        image={{ src: '/images/interior-living.jpg', alt: 'Bright modern living room with large windows' }}
      />

      <section className="section" aria-labelledby="process-heading">
        <div className="container">
          <SectionHeader id="process-heading" eyebrow="How We Work" title="From first call to closing day" />
          <ol className="steps">
            {advisorySteps.map((s, i) => (
              <li key={s.title} className="step">
                <Reveal delay={i * 0.1} className="stack">
                  <h3 className="t-h3">{s.title}</h3>
                  <p className="t-body">{s.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Pillars id="services-heading" eyebrow="What You Get" title="Three pillars of our advice" items={pillars} alt numbered />

      <section className="section" aria-labelledby="faq-heading">
        <div className="container">
          <SectionHeader id="faq-heading" eyebrow="FAQ" title="Common questions" />
          <Reveal>
            <Accordion items={faqs} />
          </Reveal>
        </div>
      </section>

      <FinalCta />
    </>
  )
}
