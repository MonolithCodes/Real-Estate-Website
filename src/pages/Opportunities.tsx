import { useSearchParams } from 'react-router-dom'
import { PropertyCard } from '../components/cards/PropertyCard'
import { FiltersBar } from '../components/forms/FiltersBar'
import type { Filters } from '../components/forms/FiltersBar'
import { PageHero } from '../components/layout/PageHero'
import { FinalCta } from '../components/sections/FinalCta'
import { Button } from '../components/ui/Button'
import { Seo } from '../components/ui/Seo'
import { properties } from '../data/properties'

const KEYS = ['destination', 'category', 'status'] as const

export function Opportunities() {
  const [params, setParams] = useSearchParams()

  const filters: Filters = {
    destination: params.get('destination') ?? '',
    category: params.get('category') ?? '',
    status: params.get('status') ?? '',
  }

  const results = properties.filter(
    (p) =>
      (!filters.destination || p.destination === filters.destination) &&
      (!filters.category || p.category === filters.category) &&
      (!filters.status || p.status === filters.status),
  )

  const onChange = (key: keyof Filters, next: string) => {
    const p = new URLSearchParams(params)
    if (next) p.set(key, next)
    else p.delete(key)
    setParams(p, { replace: true })
  }

  const onClear = () => {
    const p = new URLSearchParams(params)
    KEYS.forEach((k) => p.delete(k))
    setParams(p, { replace: true })
  }

  return (
    <>
      <Seo
        title="Curated Texas Opportunities"
        description="Browse curated homes, estates, townhomes and condominiums across Austin, Dallas–Fort Worth and Houston."
      />
      <PageHero
        short
        eyebrow="Opportunities"
        title="Curated opportunities"
        intro="A hand-picked selection chosen for lifestyle and long-term value."
        image={{ src: '/images/home-04.jpg', alt: 'Contemporary home with an infinity pool' }}
      />

      <section className="section" aria-label="Opportunities">
        <div className="container">
          <FiltersBar value={filters} count={results.length} onChange={onChange} onClear={onClear} />

          {results.length ? (
            <div className="grid grid--3">
              {results.map((p, i) => (
                <PropertyCard key={p.slug} property={p} index={i} />
              ))}
            </div>
          ) : (
            <div className="empty" data-testid="empty-state">
              <h2 className="t-h3">No opportunities match those filters</h2>
              <p className="t-body">Try widening your search, or let us look for off-market options for you.</p>
              <div className="row">
                <Button variant="outline" onClick={onClear}>
                  Reset Filters
                </Button>
                <Button to="/private-consultation">Private Consultation</Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <FinalCta />
    </>
  )
}
