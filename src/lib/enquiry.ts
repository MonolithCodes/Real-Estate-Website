export interface EnquiryValues {
  name: string
  email: string
  phone: string
  message: string
  destination: string
  budget: string
  timeline: string
  buyerType: string
  consent: boolean
  /** Honeypot: real users never fill this. */
  website: string
  source: string
}

export type EnquiryErrors = Partial<Record<keyof EnquiryValues, string>>

export const emptyEnquiry = (source: string): EnquiryValues => ({
  name: '',
  email: '',
  phone: '',
  message: '',
  destination: '',
  budget: '',
  timeline: '',
  buyerType: '',
  consent: false,
  website: '',
  source,
})

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE = /^[+()\d\s.-]{7,20}$/

export function validateContact(v: EnquiryValues): EnquiryErrors {
  const e: EnquiryErrors = {}
  if (v.name.trim().length < 2) e.name = 'Please enter your full name.'
  if (!EMAIL.test(v.email.trim())) e.email = 'Enter a valid email address, e.g. jane@example.com.'
  if (v.phone.trim() && !PHONE.test(v.phone.trim())) e.phone = 'Enter a valid phone number, e.g. +1 512 555 0123.'
  if (!v.consent) e.consent = 'Please confirm you agree to be contacted.'
  return e
}

export function validateIntent(v: EnquiryValues): EnquiryErrors {
  const e: EnquiryErrors = {}
  if (!v.buyerType) e.buyerType = 'Select what best describes you.'
  if (!v.destination) e.destination = 'Select a destination.'
  if (!v.budget) e.budget = 'Select an approximate budget.'
  return e
}

/**
 * Placeholder submit. No backend is connected yet: replace the body with a POST to your
 * form endpoint / CRM. Honeypot hits are silently dropped.
 */
export async function submitEnquiry(v: EnquiryValues): Promise<{ ok: boolean }> {
  if (v.website) return { ok: true }
  await new Promise((r) => setTimeout(r, 700))
  return { ok: true }
}

export const destinationOptions = [
  { value: 'austin-hill-country', label: 'Austin & the Hill Country' },
  { value: 'dallas-fort-worth', label: 'Dallas–Fort Worth' },
  { value: 'houston', label: 'Houston & The Woodlands' },
  { value: 'undecided', label: 'Not sure yet' },
] as const

export const budgetOptions = [
  { value: 'u750', label: 'Under $750k' },
  { value: '750-1500', label: '$750k – $1.5m' },
  { value: '1500-3000', label: '$1.5m – $3m' },
  { value: '3000-6000', label: '$3m – $6m' },
  { value: '6000+', label: '$6m +' },
] as const

export const timelineOptions = [
  { value: '3m', label: 'Within 3 months' },
  { value: '3-6m', label: '3–6 months' },
  { value: '6-12m', label: '6–12 months' },
  { value: 'exploring', label: 'Just exploring' },
] as const

export const buyerTypeOptions = [
  { value: 'relocating', label: 'Relocating to Texas' },
  { value: 'second-home', label: 'Second home' },
  { value: 'investment', label: 'Investment property' },
  { value: 'land-jv', label: 'Land / joint venture' },
] as const
