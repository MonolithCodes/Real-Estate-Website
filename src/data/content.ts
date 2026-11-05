/**
 * SAMPLE CONTENT. Builders, testimonials, people and statistics are fictional placeholders.
 * Replace with real, verifiable content before launch.
 */
export interface Stat {
  value: string
  label: string
}

export interface Pillar {
  title: string
  text: string
}

export interface Testimonial {
  quote: string
  name: string
  descriptor: string
  buyerType: string
}

export interface Builder {
  slug: string
  name: string
  summary: string
  focus: string
  stats: readonly Stat[]
}

export interface Article {
  slug: string
  title: string
  category: string
  excerpt: string
  date: string
  readTime: string
  image: string
  imageAlt: string
  body: readonly { heading?: string; text: string }[]
}

export interface TeamMember {
  name: string
  role: string
  bio: string
}

export const stats: readonly Stat[] = [
  { value: '0%', label: 'Texas state personal income tax' },
  { value: '30M+', label: 'Residents across a fast-growing state' },
  { value: '2nd', label: 'Largest state economy in the U.S.' },
  { value: '1 day', label: 'Typical response from our advisory team' },
]

export const pillars: readonly Pillar[] = [
  {
    title: 'Lifestyle-led shortlisting',
    text: 'We start with the life you want to live: school runs, lake weekends, a base between two cities. Then we match neighborhoods and homes to it.',
  },
  {
    title: 'Market intelligence',
    text: 'Net-yield modelling, builder track records, flood and tax reviews and neighborhood-level evidence underpin every recommendation.',
  },
  {
    title: 'Builder & brokerage access',
    text: 'Launch allocations, off-market introductions and builder relationships across Austin, Dallas–Fort Worth and Houston.',
  },
]

export const tickerItems: readonly string[] = [
  'Westlake',
  'Highland Park',
  'River Oaks',
  'Lakeway',
  'The Woodlands',
  'Preston Hollow',
  'Barton Creek',
  'Southlake',
  'No state income tax',
  'Hill Country acreage',
  'Lake Travis',
  'Houston Heights',
  'Frisco',
  'Off-market introductions',
]

/** Fictional builders used as sample data. */
export const builders: readonly Builder[] = [
  {
    slug: 'cedar-ridge-builders',
    name: 'Cedar Ridge Builders',
    summary: 'Custom contemporary estates across Austin and the Hill Country.',
    focus: 'Custom estates',
    stats: [
      { value: '120+', label: 'Homes delivered' },
      { value: '15 yrs', label: 'In business' },
    ],
  },
  {
    slug: 'brazos-development-group',
    name: 'Brazos Development Group',
    summary: 'Urban residences and estate homes in Dallas and Houston.',
    focus: 'Urban & estate',
    stats: [
      { value: '60+', label: 'Projects' },
      { value: '2', label: 'Metro markets' },
    ],
  },
  {
    slug: 'bluebonnet-homes',
    name: 'Bluebonnet Homes',
    summary: 'Family-focused gated communities and new launches.',
    focus: 'Gated communities',
    stats: [
      { value: '40+', label: 'Communities' },
      { value: '3', label: 'Metro markets' },
    ],
  },
  {
    slug: 'pecan-street-partners',
    name: 'Pecan Street Partners',
    summary: 'Waterfront, townhome and Hill Country retreat projects.',
    focus: 'Waterfront & townhomes',
    stats: [
      { value: '35+', label: 'Projects' },
      { value: '10 yrs', label: 'In business' },
    ],
  },
]

export const partnerNames: readonly string[] = builders.map((b) => b.name)

export const testimonials: readonly Testimonial[] = [
  {
    quote:
      'We were relocating across the country and had one long weekend to choose. Our advisor had already narrowed it to three homes that fit how we actually live.',
    name: 'The R. Family',
    descriptor: 'Relocating from California',
    buyerType: 'Relocation Buyer',
  },
  {
    quote:
      'Buying from London felt daunting until the whole process was laid out step by step, from inspections to closing, with no surprises.',
    name: 'The K. Family',
    descriptor: 'London-based family',
    buyerType: 'Second-Home Buyer',
  },
  {
    quote:
      'We came for one condo and left with a clear view of three markets and a portfolio plan. That is a different level of advice.',
    name: 'Chicago Investor Group',
    descriptor: 'Private investment group',
    buyerType: 'Investor',
  },
]

export const advisorySteps: readonly Pillar[] = [
  { title: 'Discovery call', text: 'A private conversation about lifestyle, budget, timing and priorities.' },
  { title: 'Curated shortlist', text: 'A short list of homes and neighborhoods with candid pros, cons and numbers.' },
  { title: 'Tours & due diligence', text: 'Guided tours in person or by video, plus inspection, survey, flood and tax reviews.' },
  { title: 'Negotiation & closing', text: 'Offer strategy, contract coordination with your attorney and title company, and a smooth closing.' },
]

export const landTypes: readonly Pillar[] = [
  { title: 'Acreage & ranch land', text: 'Hill Country and rural acreage searches, including water, access and mineral-rights questions for your attorney.' },
  { title: 'Development sites', text: 'Infill and suburban parcels with entitlement, utilities and absorption analysis.' },
  { title: 'Joint ventures', text: 'Structured introductions between landowners, builders and capital partners.' },
]

export const team: readonly TeamMember[] = [
  { name: 'Daniel Hartwell', role: 'Founder & Managing Broker', bio: 'Leads advisory strategy and client relationships. Twelve years guiding relocation and second-home buyers across Texas. TREC license #0654321.' },
  { name: 'Megan Reyes', role: 'Senior Advisor, Austin & Hill Country', bio: 'Specializes in lakefront, estate and acreage purchases. Austin native with deep Westlake and Lakeway relationships.' },
  { name: 'Ryan Callahan', role: 'Senior Advisor, Dallas–Fort Worth & Houston', bio: 'Specializes in relocation and new-construction purchases, with a background in builder-side sales.' },
]

export const articles: readonly Article[] = [
  {
    slug: 'buying-property-in-texas',
    title: 'Buying Property in Texas: A Step-by-Step Guide for Out-of-State Buyers',
    category: 'Buying Guide',
    excerpt: 'From option periods to title companies, here is how a Texas purchase typically works.',
    date: '2026-09-12',
    readTime: '8 min read',
    image: '/images/hero.jpg',
    imageAlt: 'Modern Texas home with a swimming pool',
    body: [
      { text: 'Texas purchases follow a clear process, but a few steps differ from other states. This overview is general guidance only; always speak with a licensed attorney and your advisor.' },
      { heading: '1. Define your search', text: 'Start with lifestyle priorities, budget and timeline. This determines which metro, neighborhood and property type to explore.' },
      { heading: '2. Make an offer and sign a contract', text: 'Most residential contracts use standard forms promulgated by the Texas Real Estate Commission. Your offer typically includes the price, earnest money and an option period.' },
      { heading: '3. Use the option period well', text: 'The option period is a negotiated window in which you can have the property inspected and decide whether to proceed. Plan inspections, surveys and insurance quotes in this window.' },
      { heading: '4. Title and closing', text: 'A title company or attorney handles the title search, escrow and closing documents. Review the survey and title commitment carefully before closing.' },
      { heading: '5. After closing', text: 'Set up utilities, consider homestead filings if the property will be your primary residence, and keep records for tax purposes.' },
    ],
  },
  {
    slug: 'texas-property-taxes-explained',
    title: 'Texas Property Taxes Explained',
    category: 'Ownership',
    excerpt: 'Texas has no state personal income tax, but local property taxes matter. Here is how to model them.',
    date: '2026-08-02',
    readTime: '6 min read',
    image: '/images/estate-brick.jpg',
    imageAlt: 'Brick and stone family estate',
    body: [
      { text: 'Texas does not levy a state personal income tax, but property is taxed locally by counties, cities, school districts and special districts. This article is general information, not tax advice.' },
      { heading: 'Rates vary by location', text: 'Two homes at the same price can carry very different tax bills depending on the taxing units that apply. We model the full cost of ownership for every shortlisted property.' },
      { heading: 'Appraisals and protests', text: 'Appraisal districts value property annually and owners can protest. Speak with a tax professional about strategy for your situation.' },
      { heading: 'Exemptions', text: 'Primary residences may qualify for a homestead exemption. Eligibility rules apply, so confirm the details with the appraisal district or a professional.' },
    ],
  },
  {
    slug: 'austin-dallas-houston-compared',
    title: 'Austin vs. Dallas vs. Houston: Choosing Your Texas Market',
    category: 'Destinations',
    excerpt: 'Three metros, three rhythms of life. How to decide which fits you.',
    date: '2026-07-18',
    readTime: '7 min read',
    image: '/images/dest-austin.jpg',
    imageAlt: 'Austin skyline across Lady Bird Lake',
    body: [
      { text: 'Texas’s three largest metros each offer a distinct lifestyle. The right choice depends on your priorities for work, schools, outdoors and community.' },
      { heading: 'Austin & the Hill Country', text: 'Lakes, limestone hills and a creative edge. Ideal for outdoor-minded buyers and those who want lake or acreage living.' },
      { heading: 'Dallas–Fort Worth', text: 'A corporate and travel hub with polished neighborhoods and a deep new-construction market.' },
      { heading: 'Houston & The Woodlands', text: 'Leafy inner-loop neighborhoods, world-class medical and cultural institutions and wooded suburban retreats.' },
    ],
  },
  {
    slug: 'hill-country-acreage-checklist',
    title: 'Hill Country Acreage: A Buyer’s Checklist',
    category: 'Land',
    excerpt: 'Water, access, easements and more: what to check before buying rural land.',
    date: '2026-06-05',
    readTime: '5 min read',
    image: '/images/land-ranch.jpg',
    imageAlt: 'Stone ranch house in a field of bluebonnets',
    body: [
      { text: 'Acreage purchases involve questions that do not arise with city lots. Use this checklist as a starting point and consult your attorney.' },
      { heading: 'Water', text: 'Confirm whether the property uses a well or a water utility, and review well records and any applicable groundwater rules.' },
      { heading: 'Access and easements', text: 'Check legal access, shared roads and recorded easements via the survey and title commitment.' },
      { heading: 'Mineral rights', text: 'Texas mineral rights can be severed from surface ownership. Ask your attorney to review what conveys with the land.' },
      { heading: 'Wildfire and drainage', text: 'Review vegetation, slope and drainage patterns, and obtain insurance quotes early.' },
    ],
  },
]

export const articleBySlug = (slug: string): Article | undefined => articles.find((a) => a.slug === slug)
export const builderBySlug = (slug: string): Builder | undefined => builders.find((b) => b.slug === slug)
