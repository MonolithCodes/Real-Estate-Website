import { PageHero } from '../components/layout/PageHero'
import { FinalCta } from '../components/sections/FinalCta'
import { StatsStrip } from '../components/sections/StatsStrip'
import { Testimonials } from '../components/sections/Testimonials'
import { Seo } from '../components/ui/Seo'

export function ClientStories() {
  return (
    <>
      <Seo title="Client Stories" description="How relocating, second-home and investor clients found the right Texas property with our advisory team." />
      <PageHero
        short
        eyebrow="Client Stories"
        title="Trusted across state lines and continents"
        intro="Client names are abbreviated to protect their privacy."
        image={{ src: '/images/home-07.jpg', alt: 'White farmhouse with a wraparound porch' }}
      />
      <Testimonials alt={false} link={false} />
      <StatsStrip />
      <FinalCta />
    </>
  )
}
