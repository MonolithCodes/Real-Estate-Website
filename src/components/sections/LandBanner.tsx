import { Button } from '../ui/Button'
import { Eyebrow } from '../ui/Eyebrow'
import { Reveal } from '../ui/Reveal'

export function LandBanner() {
  return (
    <section className="section" aria-labelledby="land-heading" data-testid="land-jv-teaser">
      <div className="container split">
        <Reveal className="split__text">
          <Eyebrow>Land, Development &amp; JV</Eyebrow>
          <h2 id="land-heading" className="t-h2">
            Beyond the home, into the land itself
          </h2>
          <p className="t-lead">
            For investors, builders and family offices, we open the door to Hill Country acreage, suburban
            development sites and structured joint-venture introductions across Texas.
          </p>
          <Button to="/land-development-jv" variant="outline" data-testid="land-jv-teaser-cta">
            Explore Land &amp; JV
          </Button>
        </Reveal>
        <Reveal className="split__media" delay={0.15}>
          <img
            src="/images/land-ranch.jpg"
            alt="Stone ranch house in a field of bluebonnets at sunset"
            width={1600}
            height={1068}
            loading="lazy"
            decoding="async"
          />
        </Reveal>
      </div>
    </section>
  )
}
