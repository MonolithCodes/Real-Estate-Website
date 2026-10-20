import { ConsultationForm } from '../components/forms/ConsultationForm'
import { PageHero } from '../components/layout/PageHero'
import { Pillars } from '../components/sections/Pillars'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Reveal } from '../components/ui/Reveal'
import { Seo } from '../components/ui/Seo'
import { landTypes } from '../data/content'

export function LandJv() {
  return (
    <>
      <Seo title="Land, Development & JV" description="Texas acreage, development sites and joint-venture introductions for investors, builders and family offices." />
      <PageHero
        eyebrow="Land, Development & JV"
        title="Beyond the home, into the land itself"
        intro="Acreage, development sites and structured joint ventures across Texas, with disciplined due diligence."
        image={{ src: '/images/land-ranch.jpg', alt: 'Stone ranch house in a bluebonnet field at sunset' }}
      />
      <Pillars id="land-types" eyebrow="What We Cover" title="Three ways to invest in Texas land" items={landTypes} numbered />

      <section className="section section--alt" aria-labelledby="land-enquiry">
        <div className="container consult">
          <Reveal className="stack">
            <Eyebrow>Investor Enquiry</Eyebrow>
            <h2 id="land-enquiry" className="t-h2">
              Tell us what you are looking for
            </h2>
            <p className="t-lead">
              Share your goals and we will respond with a confidential, no-obligation view of relevant parcels and partners.
            </p>
          </Reveal>
          <ConsultationForm source="land-jv" />
        </div>
      </section>
    </>
  )
}
