import { site } from '../../data/site'
import { whatsappUrl } from '../../lib/contact'
import { Button } from '../ui/Button'
import { Eyebrow } from '../ui/Eyebrow'
import { Reveal } from '../ui/Reveal'

interface FinalCtaProps {
  title?: string
  text?: string
}

export function FinalCta({
  title = 'Begin with a private conversation.',
  text = 'Speak directly with our advisory team about your plans: destinations, budget, timing and the lifestyle you want in Texas.',
}: FinalCtaProps) {
  return (
    <section className="section cta theme-dark grain" aria-labelledby="cta-heading" data-testid="home-final-cta">
      <div className="container cta__inner">
        <Reveal className="stack stack--center">
          <Eyebrow>Private Consultation</Eyebrow>
          <h2 id="cta-heading" className="t-h2-cta">
            {title}
          </h2>
          <p className="t-lead">{text}</p>
          <div className="cta__actions">
            <Button to="/private-consultation" data-testid="home-final-cta-consultation-button">
              Book a Private Consultation
            </Button>
            <Button
              href={whatsappUrl('Hello, I would like to book a private consultation.')}
              variant="outline"
              data-testid="home-final-cta-whatsapp-button"
            >
              WhatsApp {site.whatsappDisplay}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
