import { site } from '../data/site'

export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${site.whatsappNumber}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export const telUrl = `tel:${site.phoneHref}`
export const mailUrl = `mailto:${site.email}`
