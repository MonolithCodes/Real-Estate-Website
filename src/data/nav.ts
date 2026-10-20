export interface NavItem {
  label: string
  to: string
}

export interface FooterColumn {
  title: string
  links: readonly NavItem[]
}

export const primaryNav: readonly NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Destinations', to: '/destinations' },
  { label: 'Opportunities', to: '/opportunities' },
  { label: 'Developments', to: '/developments' },
  { label: 'Advisory', to: '/advisory' },
  { label: 'Insights', to: '/insights' },
  { label: 'About', to: '/about' },
]

export const ctaNav: NavItem = { label: 'Private Consultation', to: '/private-consultation' }

export const footerColumns: readonly FooterColumn[] = [
  {
    title: 'Explore',
    links: [
      { label: 'Destinations', to: '/destinations' },
      { label: 'Current Opportunities', to: '/opportunities' },
      { label: 'Selected Developments', to: '/developments' },
      { label: 'Lifestyle & Investment Guidance', to: '/advisory' },
      { label: 'Insights', to: '/insights' },
    ],
  },
  {
    title: 'Destinations',
    links: [
      { label: 'Austin & the Hill Country', to: '/destinations/austin-hill-country' },
      { label: 'Dallas–Fort Worth', to: '/destinations/dallas-fort-worth' },
      { label: 'Houston & The Woodlands', to: '/destinations/houston' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Client Stories', to: '/client-stories' },
      { label: 'Founders & Team', to: '/about' },
      { label: 'Contact', to: '/private-consultation' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Terms of Use', to: '/terms-of-use' },
      { label: 'Disclaimer', to: '/disclaimer' },
      { label: 'Cookie Policy', to: '/cookie-policy' },
      { label: 'Texas Consumer Protection Notice', to: '/texas-consumer-protection-notice' },
      { label: 'Information About Brokerage Services', to: '/information-about-brokerage-services' },
      { label: 'Sitemap', to: '/sitemap' },
    ],
  },
]
