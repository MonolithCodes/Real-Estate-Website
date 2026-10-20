/**
 * SAMPLE DATA. Project names, builders and prices are fictional placeholders for development.
 * Replace with real listings before launch. Prices are strings so "Price on Request" is first-class.
 */
export type PropertyStatus = 'new-launch' | 'ready' | 'off-plan'
export type PropertyCategory = 'Estate' | 'Condominium' | 'Townhome' | 'Community' | 'Waterfront' | 'Retreat'

export interface Property {
  slug: string
  title: string
  tag: string
  category: PropertyCategory
  status: PropertyStatus
  destination: 'austin-hill-country' | 'dallas-fort-worth' | 'houston'
  location: string
  descriptor: string
  price: string
  builder: string
  image: string
  imageAlt: string
  specs: { beds: string; baths: string; size: string; lot: string }
  highlights: readonly string[]
  description: string
}

export const statusLabels: Record<PropertyStatus, string> = {
  'new-launch': 'New Launch',
  ready: 'Move-in Ready',
  'off-plan': 'Pre-Construction',
}

const sharedGallery = ['/images/interior-living.jpg', '/images/interior-kitchen.jpg', '/images/interior-glass.jpg'] as const

const base: readonly Property[] = [
  {
    slug: 'westlake-ridge-residence',
    title: 'Westlake Ridge Residence',
    tag: 'Modern Estate',
    category: 'Estate',
    status: 'ready',
    destination: 'austin-hill-country',
    location: 'Westlake, Austin',
    descriptor: 'Hillside contemporary estate with resort pool',
    price: 'From $4.2m · builder-published',
    builder: 'Cedar Ridge Builders',
    image: '/images/home-01.jpg',
    imageAlt: 'Modern white residence with a long reflecting pool',
    specs: { beds: '5', baths: '6.5', size: '6,200 sq ft', lot: '1.1 acres' },
    highlights: ['Skyline and canyon views', 'Resort-style pool and outdoor kitchen', 'Smart-home and security systems', 'Four-car garage'],
    description:
      'A statement contemporary home set on the ridge, with floor-to-ceiling glass opening onto terraces and a long reflecting pool. Interiors are finished in warm timber and stone, with a chef’s kitchen and a separate guest wing.',
  },
  {
    slug: 'barton-creek-pool-villa',
    title: 'Barton Creek Pool Villa',
    tag: 'Resort Living',
    category: 'Estate',
    status: 'ready',
    destination: 'austin-hill-country',
    location: 'Barton Creek, Austin',
    descriptor: 'Gated villa near greenbelt trails and golf',
    price: 'Price on Request',
    builder: 'Cedar Ridge Builders',
    image: '/images/home-02.jpg',
    imageAlt: 'White modern villa with a turquoise swimming pool',
    specs: { beds: '4', baths: '4.5', size: '4,100 sq ft', lot: '0.6 acres' },
    highlights: ['Gated community with golf access', 'Rooftop terrace', 'Water feature pool', 'Minutes from greenbelt trails'],
    description:
      'Crisp architectural lines, a rooftop terrace and a sculptural pool define this villa. Open-plan living flows to shaded loggias designed for Texas evenings.',
  },
  {
    slug: 'lake-austin-modern',
    title: 'Lake Austin Modern',
    tag: 'Waterfront',
    category: 'Waterfront',
    status: 'new-launch',
    destination: 'austin-hill-country',
    location: 'Lake Austin',
    descriptor: 'Architect-designed home with lawn and lake access',
    price: 'From $3.6m · builder-published',
    builder: 'Pecan Street Partners',
    image: '/images/home-03.jpg',
    imageAlt: 'Modern home at dusk with a glowing living area and lawn',
    specs: { beds: '4', baths: '4', size: '3,800 sq ft', lot: '0.8 acres' },
    highlights: ['Lake access and dock potential', 'Indoor-outdoor living wall', 'Mature live oaks', 'Detached studio'],
    description:
      'Designed around a canopy of mature trees, this home blurs the line between inside and out. A glazed living pavilion opens fully to the lawn.',
  },
  {
    slug: 'lakeway-terrace-homes',
    title: 'Lakeway Terrace Homes',
    tag: 'New Launch',
    category: 'Community',
    status: 'off-plan',
    destination: 'austin-hill-country',
    location: 'Lakeway, Austin',
    descriptor: 'Contemporary lake-view residences with private pools',
    price: 'From $1.9m · builder-published',
    builder: 'Bluebonnet Homes',
    image: '/images/home-04.jpg',
    imageAlt: 'Contemporary home with an infinity pool overlooking greenery',
    specs: { beds: '3–5', baths: '3.5–5', size: '2,900–4,400 sq ft', lot: 'Varies' },
    highlights: ['Lake Travis views', 'Private infinity pools on select plans', 'Community marina access', 'Estimated completion: 2027'],
    description:
      'A boutique collection of contemporary homes stepping down toward Lake Travis. Choose from several floor plans with optional pools, outdoor kitchens and rooftop decks.',
  },
  {
    slug: 'preston-hollow-modern',
    title: 'Preston Hollow Modern',
    tag: 'Contemporary',
    category: 'Estate',
    status: 'ready',
    destination: 'dallas-fort-worth',
    location: 'Preston Hollow, Dallas',
    descriptor: 'Private contemporary home on a large wooded lot',
    price: 'Price on Request',
    builder: 'Brazos Development Group',
    image: '/images/home-05.jpg',
    imageAlt: 'Contemporary home with timber cladding and a landscaped front yard',
    specs: { beds: '5', baths: '5.5', size: '5,300 sq ft', lot: '0.9 acres' },
    highlights: ['Gated driveway', 'Timber and stone facade', 'Media room and wine cellar', 'Pool and cabana'],
    description:
      'Set back behind mature trees, this rebuilt Preston Hollow residence pairs a restrained facade with generous, light-filled interiors and a private backyard retreat.',
  },
  {
    slug: 'hacienda-at-highland-park',
    title: 'Hacienda at Highland Park',
    tag: 'Courtyard Estate',
    category: 'Estate',
    status: 'ready',
    destination: 'dallas-fort-worth',
    location: 'Highland Park, Dallas',
    descriptor: 'Mediterranean courtyard home with a lantern-lit pool',
    price: 'Price on Request',
    builder: 'Brazos Development Group',
    image: '/images/home-06.jpg',
    imageAlt: 'Mediterranean courtyard home with a lit pool at night',
    specs: { beds: '6', baths: '7', size: '7,000 sq ft', lot: '1.3 acres' },
    highlights: ['Arched loggias and courtyard', 'Guest casita', 'Lantern-lit pool terrace', 'Walkable to Highland Park Village'],
    description:
      'A rare courtyard estate in the heart of Highland Park, designed for entertaining. Archways, clay tile and terraces frame an evening-lit pool.',
  },
  {
    slug: 'southlake-farmhouse',
    title: 'Southlake Farmhouse',
    tag: 'Farmhouse',
    category: 'Estate',
    status: 'new-launch',
    destination: 'dallas-fort-worth',
    location: 'Southlake, DFW',
    descriptor: 'Wraparound-porch family home on a generous lawn',
    price: 'From $2.4m · builder-published',
    builder: 'Bluebonnet Homes',
    image: '/images/home-07.jpg',
    imageAlt: 'White farmhouse with a wraparound porch and green lawn',
    specs: { beds: '5', baths: '5', size: '4,600 sq ft', lot: '0.7 acres' },
    highlights: ['Wraparound covered porch', 'Mudroom and scullery kitchen', 'Top-rated school district', 'Gated neighborhood'],
    description:
      'Classic farmhouse character with modern comfort. Deep porches, a scullery kitchen and a flexible upstairs suite make this home ideal for family life.',
  },
  {
    slug: 'dripping-springs-stone-ranch',
    title: 'Dripping Springs Stone Ranch',
    tag: 'Hill Country Retreat',
    category: 'Retreat',
    status: 'ready',
    destination: 'austin-hill-country',
    location: 'Dripping Springs',
    descriptor: 'Limestone ranch home on rolling acreage',
    price: 'From $1.2m · builder-published',
    builder: 'Pecan Street Partners',
    image: '/images/home-08.jpg',
    imageAlt: 'Stone ranch-style home with a deep porch and mature trees',
    specs: { beds: '4', baths: '3.5', size: '3,200 sq ft', lot: '5 acres' },
    highlights: ['Native limestone construction', 'Five acres with oak groves', 'Covered outdoor living', 'Close to wineries and trails'],
    description:
      'A quiet Hill Country base built from native stone, with wide porches and acreage for horses, gardens or simply space.',
  },
  {
    slug: 'woodlands-lakeside-retreat',
    title: 'Woodlands Lakeside Retreat',
    tag: 'Wooded Retreat',
    category: 'Retreat',
    status: 'ready',
    destination: 'houston',
    location: 'The Woodlands, Houston',
    descriptor: 'Gabled home among pines with a glowing great room',
    price: 'From $1.6m · builder-published',
    builder: 'Cedar Ridge Builders',
    image: '/images/home-09.jpg',
    imageAlt: 'Gabled timber and glass home lit up at dusk among trees',
    specs: { beds: '4', baths: '4', size: '3,600 sq ft', lot: '0.5 acres' },
    highlights: ['Wooded lot with waterway access', 'Vaulted great room', 'Trail network nearby', 'Screened porch'],
    description:
      'Set among tall pines, this home combines a vaulted glass great room with warm timber detailing and quiet, private outdoor space.',
  },
  {
    slug: 'museum-district-residences',
    title: 'Museum District Residences',
    tag: 'Condominium',
    category: 'Condominium',
    status: 'off-plan',
    destination: 'houston',
    location: 'Museum District, Houston',
    descriptor: 'Boutique mid-rise near parks, museums and dining',
    price: 'From $850k · builder-published',
    builder: 'Brazos Development Group',
    image: '/images/home-10.jpg',
    imageAlt: 'Contemporary mid-rise residential building facade against a blue sky',
    specs: { beds: '1–3', baths: '1.5–3.5', size: '980–2,400 sq ft', lot: 'n/a' },
    highlights: ['Walkable to museums and Hermann Park', 'Concierge and secure parking', 'Rooftop terrace and pool', 'Estimated completion: 2027'],
    description:
      'A boutique residential tower in one of Houston’s most walkable districts, with amenities designed for lock-up-and-leave living.',
  },
  {
    slug: 'frisco-estates-collection',
    title: 'Frisco Estates Collection',
    tag: 'Gated Community',
    category: 'Community',
    status: 'new-launch',
    destination: 'dallas-fort-worth',
    location: 'Frisco, DFW',
    descriptor: 'Brick-and-stone family estates in a gated enclave',
    price: 'From $1.4m · builder-published',
    builder: 'Bluebonnet Homes',
    image: '/images/home-11.jpg',
    imageAlt: 'Brick and stone family home with a three-car garage on a quiet street',
    specs: { beds: '4–6', baths: '4–6', size: '3,400–5,200 sq ft', lot: '0.3–0.6 acres' },
    highlights: ['Gated entry and community park', 'Three-car garages', 'Zoned to highly rated schools', 'Customizable floor plans'],
    description:
      'A gated enclave of traditional brick-and-stone homes with generous lots, three-car garages and a community park.',
  },
  {
    slug: 'heights-townhomes',
    title: 'Heights Townhomes',
    tag: 'Townhome',
    category: 'Townhome',
    status: 'new-launch',
    destination: 'houston',
    location: 'Houston Heights',
    descriptor: 'Modern townhomes with private entries and garages',
    price: 'From $720k · builder-published',
    builder: 'Pecan Street Partners',
    image: '/images/home-12.jpg',
    imageAlt: 'Modern townhome with warm entry lighting at sunset',
    specs: { beds: '3', baths: '3.5', size: '2,200 sq ft', lot: 'n/a' },
    highlights: ['Private entry and two-car garage', 'Rooftop deck', 'Walkable to Heights dining', 'Energy-efficient construction'],
    description:
      'A low-maintenance modern townhome in one of Houston’s most popular neighborhoods, with a rooftop deck and walkable local dining.',
  },
]

export interface PropertyWithGallery extends Property {
  gallery: readonly string[]
}

export const properties: readonly PropertyWithGallery[] = base.map((p) => ({
  ...p,
  gallery: [p.image, ...sharedGallery],
}))

export const propertyBySlug = (slug: string): PropertyWithGallery | undefined =>
  properties.find((p) => p.slug === slug)
