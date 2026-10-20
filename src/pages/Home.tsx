import { DestinationGrid } from '../components/sections/DestinationGrid'
import { FinalCta } from '../components/sections/FinalCta'
import { Hero } from '../components/sections/Hero'
import { LandBanner } from '../components/sections/LandBanner'
import { PartnerLogos } from '../components/sections/PartnerLogos'
import { Pillars } from '../components/sections/Pillars'
import { PropertyGrid } from '../components/sections/PropertyGrid'
import { StatsStrip } from '../components/sections/StatsStrip'
import { Testimonials } from '../components/sections/Testimonials'
import { Ticker } from '../components/sections/Ticker'
import { Seo } from '../components/ui/Seo'
import { pillars } from '../data/content'
import { properties } from '../data/properties'
import { site } from '../data/site'

export function Home() {
  return (
    <>
      <Seo
        description="Curated Texas homes, land and investments across Austin, Dallas–Fort Worth and Houston. Advisory-led, with market intelligence and builder access for relocating and out-of-state buyers."
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'RealEstateAgent',
          name: site.brandName,
          description: site.description,
          areaServed: ['Austin, TX', 'Dallas–Fort Worth, TX', 'Houston, TX'],
          telephone: site.phone,
          email: site.email,
        }}
      />
      <Hero />
      <Ticker />
      <StatsStrip />
      <PropertyGrid properties={properties} link={{ to: '/opportunities', label: 'View all' }} />
      <DestinationGrid />
      <Pillars id="why-heading" eyebrow="Why Buyers Choose Us" title="Advisory first. Always." items={pillars} />
      <LandBanner />
      <PartnerLogos />
      <Testimonials />
      <FinalCta />
    </>
  )
}
