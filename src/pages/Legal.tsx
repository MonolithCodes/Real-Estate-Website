import { PageHero } from '../components/layout/PageHero'
import { Seo } from '../components/ui/Seo'
import { site } from '../data/site'

interface LegalDoc {
  title: string
  description: string
  sections: readonly { heading: string; text: string }[]
}

const docs = {
  'privacy-policy': {
    title: 'Privacy Policy',
    description: 'How we collect, use and protect your personal information.',
    sections: [
      { heading: 'Information we collect', text: 'We collect details you submit through forms (name, email, phone, preferences) and basic analytics data about how the site is used, such as pages visited and device type.' },
      { heading: 'How we use it', text: 'To respond to enquiries, provide advisory services, improve the website and, with your consent, send relevant updates. We do not use your information for automated decision-making.' },
      { heading: 'Sharing', text: 'We do not sell personal information. We share it only with service providers and professionals involved in your enquiry, such as title companies, lenders and attorneys, under confidentiality obligations.' },
      { heading: 'Retention and security', text: 'We keep enquiry records for as long as needed to serve you and meet legal obligations, and protect them with reasonable technical and organizational safeguards.' },
      { heading: 'Your choices', text: `You may request access, correction or deletion of your information, or opt out of marketing messages at any time by contacting us at ${site.email}.` },
      { heading: 'Contact', text: `Questions about this policy: ${site.email} or ${site.phone}.` },
    ],
  },
  'terms-of-use': {
    title: 'Terms of Use',
    description: 'The terms that apply when you use this website.',
    sections: [
      { heading: 'Use of the site', text: 'Content is provided for general information. You agree not to misuse the site, scrape it at scale or attempt to disrupt its operation.' },
      { heading: 'No professional advice', text: 'Nothing on this site is legal, tax, financial or investment advice. Consult licensed professionals before making decisions.' },
      { heading: 'Listings and pricing', text: 'Listings, availability and prices are provided by builders and sellers, are subject to change without notice and do not constitute an offer.' },
      { heading: 'Intellectual property', text: `Site content, branding and design are owned by ${site.brandName} or its licensors and may not be reproduced without written permission.` },
      { heading: 'Limitation of liability', text: 'To the extent permitted by law, we are not liable for losses arising from reliance on information on this site. Texas law governs these terms.' },
    ],
  },
  disclaimer: {
    title: 'Disclaimer',
    description: 'Important information about the content on this website.',
    sections: [
      { heading: 'General guidance only', text: site.disclaimer },
      { heading: 'Photography and renderings', text: 'Images and renderings are illustrative and may not depict the exact home, finishes or surroundings. Floor areas and lot sizes are approximate.' },
      { heading: 'Fair housing', text: site.equalHousing },
    ],
  },
  'cookie-policy': {
    title: 'Cookie Policy',
    description: 'How this website uses cookies and similar technologies.',
    sections: [
      { heading: 'What we use', text: 'Essential cookies keep the site working. With your consent we may use analytics cookies to understand how the site is used and to improve it.' },
      { heading: 'Managing cookies', text: 'You can change your browser settings to block or delete cookies. Some features may not work without essential cookies.' },
    ],
  },
  'texas-consumer-protection-notice': {
    title: 'Texas Consumer Protection Notice',
    description: 'Information about the Texas Real Estate Commission and how to file a complaint.',
    sections: [
      { heading: 'About TREC', text: 'The Texas Real Estate Commission (TREC) regulates real estate brokers and sales agents, real estate inspectors, home warranty companies, easement and right-of-way agents, and timeshare interest providers.' },
      { heading: 'Check a license', text: 'You can find more information and check the status of a license holder at www.trec.texas.gov.' },
      { heading: 'File a complaint', text: 'You can send a complaint against a license holder to TREC. A complaint form is available on the TREC website, or you can write to the Commission directly.' },
      { heading: 'Our brokerage', text: site.license },
    ],
  },
  'information-about-brokerage-services': {
    title: 'Information About Brokerage Services',
    description: 'An overview of the roles a real estate broker can play in a Texas transaction.',
    sections: [
      { heading: 'Why you are seeing this', text: 'Texas law requires real estate license holders to give clients information about the types of services a broker can provide. Your advisor will also give you the official TREC form before any agreement is signed.' },
      { heading: 'Working with a buyer’s agent', text: 'A broker who represents a buyer owes the buyer duties of loyalty, confidentiality, disclosure, accounting and reasonable care, and must act in the buyer’s best interests.' },
      { heading: 'Working with a seller’s agent', text: 'A broker who represents a seller owes the seller the same fiduciary duties and must treat all prospective buyers honestly and fairly.' },
      { heading: 'Written agreements', text: 'A broker may only represent you under a written agreement. Please read any agreement carefully and ask questions before signing.' },
      { heading: 'Our brokerage', text: site.license },
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
          {d.sections.map((s) => (
            <section key={s.heading} className="stack">
              <h2>{s.heading}</h2>
              <p>{s.text}</p>
            </section>
          ))}
          <p className="t-legal">Last updated October 2026.</p>
        </div>
      </section>
    </>
  )
}
