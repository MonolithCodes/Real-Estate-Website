import { site } from '../../data/site'

interface SeoProps {
  title?: string
  description?: string
  jsonLd?: Record<string, unknown>
}

const DEFAULT_DESCRIPTION =
  'Private, advisory-led property guidance across Austin, Dallas–Fort Worth and Houston, Texas.'

/** Per-page title, description and optional JSON-LD. React 19 hoists these into <head>. */
export function Seo({ title, description = DEFAULT_DESCRIPTION, jsonLd }: SeoProps) {
  const full = title ? `${title} | ${site.brandName}` : `${site.brandName} — Texas Luxury Property Advisory`
  return (
    <>
      <title>{full}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {jsonLd ? <script type="application/ld+json">{JSON.stringify(jsonLd)}</script> : null}
    </>
  )
}
