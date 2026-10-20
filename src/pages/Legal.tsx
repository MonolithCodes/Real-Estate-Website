import { PageHero } from '../components/layout/PageHero'
import { Seo } from '../components/ui/Seo'
import { site } from '../data/site'

interface LegalDoc {
  title: string
  description: string
  sections: readonly { heading: string; text: string }[]
}

const REVIEW = 'Template text for development. Have a Texas-licensed attorney review and complete this page before launch.'

const docs = {
  'privacy-policy': {
    title: 'Privacy Policy',
    description: 'How we collect, use and protect your personal information.',
    sections: [
      { heading: 'Information we collect', text: 'We collect details you submit through forms (name, email, phone, preferences) and basic analytics data about how the site is used.' },
      { heading: 'How we use it', text: 'To respond to enquiries, provide advisory services, improve the website and, with your consent, send relevant updates.' },
      { heading: 'Sharing', text: 'We do not sell personal information. We share it only with service providers and professionals involved in your enquiry, under confidentiality obligations.' },
      { heading: 'Your choices', text: 'You may request access, correction or deletion of your information, or opt out of marketing, by contacting us at the email address below.' },
      { heading: 'Contact', text: `Questions about this policy: ${site.email}.` },
    ],
  },
  'terms-of-use': {
    title: 'Terms of Use',
    description: 'The terms that apply when you use this website.',
    sections: [
      { heading: 'Use of the site', text: 'Content is provided for general information. You agree not to misuse the site or attempt to disrupt its operation.' },
      { heading: 'No professional advice', text: 'Nothing on this site is legal, tax, financial or investment advice. Consult licensed professionals before making decisions.' },
      { heading: 'Listings and pricing', text: 'Listings, availability and prices are subject to change without notice and are not an offer.' },
      { heading: 'Intellectual property', text: 'Site content, branding and design are owned by us or our licensors and may not be reproduced without permission.' },
    ],
  },
  disclaimer: {
    title: 'Disclaimer',
    description: 'Important information about the content on this website.',
    sections: [
      { heading: 'General guidance only', text: site.disclaimer },
      { heading: 'Sample content', text: 'Project names, builders, testimonials and statistics shown during development are illustrative placeholders.' },
      { heading: 'Fair housing', text: site.equalHousing },
    ],
  },
  'cookie-policy': {
    title: 'Cookie Policy',
    description: 'How this website uses cookies and similar technologies.',
    sections: [
      { heading: 'What we use', text: 'Essential cookies keep the site working. With your consent we may use analytics cookies to understand how the site is used.' },
      { heading: 'Managing cookies', text: 'You can change your browser settings to block or delete cookies. Some features may not work without essential cookies.' },
    ],
  },
  'texas-consumer-protection-notice': {
    title: 'Texas Consumer Protection Notice',
    description: 'The Texas Real Estate Commission consumer protection notice.',
    sections: [
      { heading: 'Notice', text: 'Insert the current Texas Real Estate Commission (TREC) Consumer Protection Notice here, exactly as published by TREC at www.trec.texas.gov.' },
      { heading: 'Brokerage', text: site.license },
    ],
  },
  'information-about-brokerage-services': {
    title: 'Information About Brokerage Services',
    description: 'The TREC Information About Brokerage Services notice.',
    sections: [
      { heading: 'Notice', text: 'Insert the current TREC Information About Brokerage Services (IABS) form here, exactly as published by TREC at www.trec.texas.gov, along with the broker’s details.' },
      { heading: 'Brokerage', text: site.license },
    ],
  },
} as const satisfies Record<string, LegalDoc>

export type LegalSlug = keyof typeof docs

export function LegalPage({ slug }: { slug: LegalSlug }) {
  const d: LegalDoc = docs[slug]
  return (
    <>
      <Seo title={d.title} description={d.description} />
      <PageHero short eyebrow="Legal" title={d.title} intro={d.description} />
      <section className="section">
        <div className="container legal">
          <p className="notice">{REVIEW}</p>
          {d.sections.map((s) => (
            <section key={s.heading} className="stack">
              <h2>{s.heading}</h2>
              <p>{s.text}</p>
            </section>
          ))}
        </div>
      </section>
    </>
  )
}
