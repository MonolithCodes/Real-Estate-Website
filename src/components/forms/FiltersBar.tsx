import { destinations } from '../../data/destinations'
import { statusLabels } from '../../data/properties'
import type { PropertyCategory, PropertyStatus } from '../../data/properties'
import { Button } from '../ui/Button'
import { Select } from '../ui/Select'

export interface Filters {
  destination: string
  category: string
  status: string
}

const categories: readonly PropertyCategory[] = ['Estate', 'Condominium', 'Townhome', 'Community', 'Waterfront', 'Retreat']
const statuses = Object.keys(statusLabels) as PropertyStatus[]

interface FiltersBarProps {
  value: Filters
  count: number
  onChange: (key: keyof Filters, next: string) => void
  onClear: () => void
}

/** URL-synced filter bar (the parent owns state via search params). */
export function FiltersBar({ value, count, onChange, onClear }: FiltersBarProps) {
  const active = Object.values(value).some(Boolean)

  return (
    <div className="filters" role="search" aria-label="Filter opportunities">
      <div className="filters__row">
        <Select
          label="Destination"
          name="destination"
          value={value.destination}
          onChange={(e) => onChange('destination', e.target.value)}
          options={[{ value: '', label: 'All destinations' }, ...destinations.map((d) => ({ value: d.slug, label: d.title }))]}
        />
        <Select
          label="Property type"
          name="category"
          value={value.category}
          onChange={(e) => onChange('category', e.target.value)}
          options={[{ value: '', label: 'All types' }, ...categories.map((c) => ({ value: c, label: c }))]}
        />
        <Select
          label="Status"
          name="status"
          value={value.status}
          onChange={(e) => onChange('status', e.target.value)}
          options={[{ value: '', label: 'Any status' }, ...statuses.map((s) => ({ value: s, label: statusLabels[s] }))]}
        />
      </div>
      <div className="filters__foot">
        <p className="t-body" aria-live="polite" data-testid="results-count">
          {count} {count === 1 ? 'opportunity' : 'opportunities'}
        </p>
        {active ? (
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear All
          </Button>
        ) : null}
      </div>
    </div>
  )
}
