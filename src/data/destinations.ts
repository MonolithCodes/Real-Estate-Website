export interface District {
  name: string
  blurb: string
}

export interface Destination {
  slug: string
  title: string
  short: string
  kicker: string
  excerpt: string
  intro: string
  image: string
  imageAlt: string
  pillars: readonly { title: string; text: string }[]
  districts: readonly District[]
  facts: readonly { value: string; label: string }[]
  faqs: readonly { id: string; question: string; answer: string }[]
}

export const destinations: readonly Destination[] = [
  {
    slug: 'austin-hill-country',
    title: 'Austin & the Hill Country',
    short: 'Austin',
    kicker: 'Lakes, limestone hills & a creative edge',
    excerpt:
      'Austin pairs a fast-evolving downtown with Lake Austin, Lake Travis and the rolling Hill Country, for buyers who want culture, outdoors and room to breathe.',
    intro:
      'From walkable lakeside neighborhoods to ranch-style retreats in the hills, Austin and its surrounds offer some of the most varied lifestyle choices in Texas.',
    image: '/images/dest-austin.jpg',
    imageAlt: 'Austin skyline across Lady Bird Lake on a sunny day',
    pillars: [
      { title: 'Lifestyle range', text: 'Downtown condominiums, lakefront estates and Hill Country acreage within a short drive of each other.' },
      { title: 'Outdoor living', text: 'Greenbelts, lake access and year-round patio weather shape how homes are designed here.' },
      { title: 'Considered growth', text: 'A diverse local economy and steady relocation interest keep demand broad across price points.' },
    ],
    districts: [
      { name: 'Westlake', blurb: 'Hillside estates with skyline and canyon views, minutes from downtown.' },
      { name: 'Barton Creek', blurb: 'Golf, greenbelt access and resort-style gated living.' },
      { name: 'Lakeway', blurb: 'Lake Travis marinas, boating and relaxed waterfront communities.' },
      { name: 'Dripping Springs', blurb: 'Hill Country acreage, wineries and a slower rhythm.' },
    ],
    facts: [
      { value: '0%', label: 'Texas state income tax' },
      { value: 'Lake & hills', label: 'Outdoor lifestyle on your doorstep' },
      { value: 'Wide range', label: 'Condos to acreage estates' },
    ],
    faqs: [
      { id: 'a1', question: 'Which Austin areas suit families?', answer: 'Westlake, Lakeway and parts of the Hill Country are popular with families. We shortlist by school preferences, commute and lifestyle, then arrange tours.' },
      { id: 'a2', question: 'Can you help with waterfront due diligence?', answer: 'Yes. We coordinate surveys, lake-level considerations and specialist inspections with local professionals.' },
      { id: 'a3', question: 'Do you handle acreage and ranch purchases?', answer: 'Our Land, Development & JV team supports acreage searches, including water, access and mineral-rights questions with your attorney.' },
    ],
  },
  {
    slug: 'dallas-fort-worth',
    title: 'Dallas–Fort Worth',
    short: 'Dallas–Fort Worth',
    kicker: 'Corporate hub with polished neighborhoods',
    excerpt:
      'A major corporate and cultural center, DFW offers established enclaves, master-planned suburbs and a deep range of new construction.',
    intro:
      'Whether you want a tree-lined established neighborhood or a new gated community with every amenity, the Metroplex delivers choice and connectivity.',
    image: '/images/dest-dallas.jpg',
    imageAlt: 'Dallas towers lit by a dramatic sunset',
    pillars: [
      { title: 'Established enclaves', text: 'Historic neighborhoods with mature trees and architectural character close to the core.' },
      { title: 'New communities', text: 'Master-planned suburbs with schools, parks and retail designed in from day one.' },
      { title: 'Connectivity', text: 'Major airports and corridors make DFW a practical base for national and international travel.' },
    ],
    districts: [
      { name: 'Highland Park & University Park', blurb: 'Prestigious, walkable enclaves with traditional and modern estates.' },
      { name: 'Preston Hollow', blurb: 'Large lots and privacy, with contemporary rebuilds throughout.' },
      { name: 'Frisco & Plano', blurb: 'Family-focused communities with strong amenities and new builds.' },
      { name: 'Southlake', blurb: 'Gated estates, town-center living and a polished suburban feel.' },
    ],
    facts: [
      { value: '0%', label: 'Texas state income tax' },
      { value: 'Major hub', label: 'Corporate and airport connectivity' },
      { value: 'New builds', label: 'Wide selection of new communities' },
    ],
    faqs: [
      { id: 'd1', question: 'Is DFW better for relocation than Austin or Houston?', answer: 'It depends on your priorities. We compare commute, schools, lifestyle and budget across all three metros before recommending a shortlist.' },
      { id: 'd2', question: 'Can I buy new construction?', answer: 'Yes. We introduce selected builder communities and negotiate on your behalf, including upgrade packages and timelines.' },
      { id: 'd3', question: 'How do property taxes work?', answer: 'Texas relies on local property taxes rather than a state income tax. Rates vary by jurisdiction, so we model ownership costs for each shortlisted home.' },
    ],
  },
  {
    slug: 'houston',
    title: 'Houston & The Woodlands',
    short: 'Houston',
    kicker: 'Global city, leafy neighborhoods',
    excerpt:
      'Houston combines a world-class dining and medical scene with leafy inner-loop neighborhoods and the green, planned community of The Woodlands.',
    intro:
      'Houston rewards buyers who value variety: urban townhomes, historic bungalows, large estates and wooded retreats are all within reach.',
    image: '/images/dest-houston.jpg',
    imageAlt: 'Downtown Houston skyline above green parkland',
    pillars: [
      { title: 'Neighborhood variety', text: 'From walkable inner-loop areas to wooded suburban retreats, each district has a distinct character.' },
      { title: 'Medical & energy hubs', text: 'Major employers and institutions anchor steady demand across many neighborhoods.' },
      { title: 'Dining & culture', text: 'Museums, theater and one of the country’s most diverse food scenes.' },
    ],
    districts: [
      { name: 'River Oaks', blurb: 'Houston’s best-known luxury enclave with grand estates and mature landscaping.' },
      { name: 'Memorial', blurb: 'Large wooded lots and top-rated schools west of the core.' },
      { name: 'The Woodlands', blurb: 'A master-planned, forested community with trails and waterways.' },
      { name: 'Heights & Montrose', blurb: 'Character bungalows, new townhomes and a lively local scene.' },
    ],
    facts: [
      { value: '0%', label: 'Texas state income tax' },
      { value: 'Inner-loop to forest', label: 'Choice of settings' },
      { value: 'World-class', label: 'Medical and cultural institutions' },
    ],
    faqs: [
      { id: 'h1', question: 'How should I think about flood risk in Houston?', answer: 'It is a key part of our due diligence. We review flood maps, elevation certificates and insurance quotes for every shortlisted home.' },
      { id: 'h2', question: 'Is The Woodlands a good second-home option?', answer: 'It suits buyers who want a calm, green base with strong amenities. We can arrange a guided visit weekend.' },
      { id: 'h3', question: 'Do you cover investment condos and townhomes?', answer: 'Yes. We provide net-yield modelling and builder track-record reviews for investment purchases.' },
    ],
  },
]

export const destinationBySlug = (slug: string): Destination | undefined =>
  destinations.find((d) => d.slug === slug)
