import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { EnquiryCard } from '../components/forms/EnquiryCard'
import { PageHero } from '../components/layout/PageHero'
import { FinalCta } from '../components/sections/FinalCta'
import { PropertyGrid } from '../components/sections/PropertyGrid'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { Lightbox } from '../components/ui/Lightbox'
import { Reveal } from '../components/ui/Reveal'
import { Seo } from '../components/ui/Seo'
import { Tag } from '../components/ui/Tag'
import { destinationBySlug } from '../data/destinations'
import { properties, propertyBySlug, statusLabels } from '../data/properties'
import { NotFound } from './NotFound'

export function ProjectDetail() {
  const { slug = '' } = useParams()
  const p = propertyBySlug(slug)
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)

  if (!p) return <NotFound />

  const dest = destinationBySlug(p.destination)
  const similar = properties.filter((x) => x.destination === p.destination && x.slug !== p.slug).slice(0, 3)
  const isRequest = p.price === 'Price on Request'

  return (
    <>
      <Seo
        title={p.title}
        description={`${p.title} in ${p.location}: ${p.descriptor}. ${p.price}.`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Residence',
          name: p.title,
          description: p.descriptor,
          address: { '@type': 'PostalAddress', addressLocality: p.location, addressRegion: 'TX', addressCountry: 'US' },
          image: p.gallery,
        }}
      />
      <PageHero short eyebrow={p.location} title={p.title} intro={p.descriptor} image={{ src: p.image, alt: p.imageAlt }} />

      <section className="section section--sm">
        <div className="container detail">
          <div className="detail__main">
            <Breadcrumbs
              items={[
                { label: 'Home', to: '/' },
                { label: 'Opportunities', to: '/opportunities' },
                { label: p.title },
              ]}
            />

            <div className="detail__title-block">
              <div className="row">
                <Tag>{p.tag}</Tag>
                <Tag variant="outline" className="tag--on-light">
                  {statusLabels[p.status]}
                </Tag>
              </div>
              <p className="detail__price" data-testid="project-price">
                {isRequest ? p.price : p.price.split(' · ')[0]}
              </p>
              {!isRequest ? <p className="t-legal">{p.price.split(' · ')[1]}. Subject to change.</p> : null}
            </div>

            <div className="gallery" aria-label="Photo gallery">
              <button type="button" className="gallery__main" onClick={() => setOpen(true)} aria-label="Open photo gallery">
                <img src={p.gallery[active]} alt={`${p.imageAlt} — photo ${active + 1}`} width={1600} height={1000} />
              </button>
              <div className="gallery__thumbs">
                {p.gallery.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    className="gallery__thumb"
                    aria-current={i === active}
                    aria-label={`Show photo ${i + 1}`}
                    onClick={() => setActive(i)}
                  >
                    <img src={src} alt="" width={400} height={300} loading="lazy" />
                  </button>
                ))}
              </div>
            </div>

            <Reveal>
              <div className="spec-strip">
                {Object.entries({ Bedrooms: p.specs.beds, Bathrooms: p.specs.baths, 'Living area': p.specs.size, Lot: p.specs.lot }).map(([k, v]) => (
                  <div key={k}>
                    <p className="spec-strip__value">{v}</p>
                    <p className="t-label">{k}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal className="stack">
              <h2 className="t-h2">Overview</h2>
              <p className="t-lead">{p.description}</p>
            </Reveal>

            <Reveal className="stack">
              <h2 className="t-h3-lg">Highlights</h2>
              <ul className="checklist">
                {p.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="stack">
              <h2 className="t-h3-lg">Key facts</h2>
              <table className="facts">
                <tbody>
                  <tr>
                    <th scope="row">Builder</th>
                    <td translate="no">{p.builder}</td>
                  </tr>
                  <tr>
                    <th scope="row">Location</th>
                    <td>{p.location}</td>
                  </tr>
                  <tr>
                    <th scope="row">Destination</th>
                    <td>{dest?.title}</td>
                  </tr>
                  <tr>
                    <th scope="row">Status</th>
                    <td>{statusLabels[p.status]}</td>
                  </tr>
                  <tr>
                    <th scope="row">Price</th>
                    <td className="facts__key">{p.price}</td>
                  </tr>
                </tbody>
              </table>
              <p className="t-legal">Details, availability and pricing are subject to change without notice.</p>
            </Reveal>
          </div>

          <aside className="detail__aside" aria-label="Enquire about this property">
            <EnquiryCard key={p.slug} projectTitle={p.title} price={p.price} slug={p.slug} />
          </aside>
        </div>
      </section>

      {similar.length ? (
        <PropertyGrid
          id="similar-heading"
          properties={similar}
          eyebrow="Similar Opportunities"
          title="You may also like"
          link={{ to: '/opportunities', label: 'View all' }}
          alt
        />
      ) : null}

      <FinalCta />

      {open ? <Lightbox images={p.gallery} index={active} alt={p.imageAlt} onClose={() => setOpen(false)} onChange={setActive} /> : null}
    </>
  )
}
