import { ConsultationForm } from '../components/forms/ConsultationForm'
import { PageHero } from '../components/layout/PageHero'
import { Button } from '../components/ui/Button'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Reveal } from '../components/ui/Reveal'
import { Seo } from '../components/ui/Seo'
import { site } from '../data/site'
import { mailUrl, telUrl, whatsappUrl } from '../lib/contact'

const next = [
  'We reply within one business day to schedule a call or video meeting.',
  'We learn about your goals, budget, timeline and must-haves.',
  'You receive a curated shortlist with candid pros, cons and numbers.',
] as const

export function Consultation() {
  return (
    <>
      <Seo title="Private Consultation" description="Book a private, no-obligation consultation with our Texas property advisory team." />
      <PageHero
        short
        eyebrow="Private Consultation"
        title="Begin with a private conversation."
        intro="Tell us a little about your plans and we will take it from there."
        image={{ src: '/images/hero.jpg', alt: 'Contemporary Texas home with a swimming pool' }}
      />

      <section className="section" aria-labelledby="next-heading">
        <div className="container consult">
          <Reveal className="stack">
            <Eyebrow>What Happens Next</Eyebrow>
            <h2 id="next-heading" className="t-h2">
              Simple, private and without obligation
            </h2>
            <ul className="checklist">
              {next.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            <p className="t-body">Your information is kept confidential and never shared without your consent.</p>
            <div className="row">
              <Button href={whatsappUrl('Hello, I would like to book a private consultation.')} variant="outline">
                WhatsApp {site.whatsappDisplay}
              </Button>
              <Button href={telUrl} variant="ghost">
                Call {site.phone}
              </Button>
            </div>
            <p className="t-body">
              Or email{' '}
              <a className="btn btn--link" href={mailUrl}>
                {site.email}
              </a>
            </p>
          </Reveal>
          <ConsultationForm />
        </div>
      </section>
    </>
  )
}
