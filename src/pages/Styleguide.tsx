import { useState } from 'react'
import { PageHero } from '../components/layout/PageHero'
import { Accordion } from '../components/ui/Accordion'
import type { AccordionItem } from '../components/ui/Accordion'
import { ArrowLink } from '../components/ui/ArrowLink'
import { Button } from '../components/ui/Button'
import { ArrowRightIcon } from '../components/ui/icons'
import { Input, Textarea } from '../components/ui/Input'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeader } from '../components/ui/SectionHeader'
import { Select } from '../components/ui/Select'
import { Tag } from '../components/ui/Tag'

const faq: readonly AccordionItem[] = [
  { id: 'a', question: 'How does a private consultation work?', answer: 'A short, confidential conversation to understand your goals, budget and timeline.' },
  { id: 'b', question: 'Are prices final?', answer: 'Prices shown are developer-published and subject to change.' },
]

const budgets = [
  { value: 'lt1', label: 'Under 1m' },
  { value: '1-3', label: '1m – 3m' },
  { value: 'gt3', label: '3m +' },
] as const

/** Dev-only primitives showcase for visual verification. Not part of the public sitemap. */
export function Styleguide() {
  const [budget, setBudget] = useState('')

  return (
    <>
      <PageHero eyebrow="Dev only" title="UI primitives" intro="Visual check of design.md components." short />

      <section className="section" aria-labelledby="sg-buttons">
        <div className="container">
          <SectionHeader id="sg-buttons" eyebrow="Buttons" title="Primary, ghost, outline, link" />
          <Reveal>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', alignItems: 'center' }}>
              <Button icon={<ArrowRightIcon size={16} />}>Primary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="link">Text Link</Button>
              <Button size="sm">Small</Button>
              <Button disabled>Disabled</Button>
              <ArrowLink to="/opportunities">View All</ArrowLink>
              <Tag>Branded Residence</Tag>
              <Tag variant="outline">Outline</Tag>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="sg-forms">
        <div className="container">
          <SectionHeader id="sg-forms" eyebrow="Forms" title="Inputs, select, textarea" />
          <Reveal>
            <div style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 'var(--measure-wide)' }}>
              <Input label="Full name" placeholder="Jane Smith…" autoComplete="name" />
              <Input label="Email" type="email" placeholder="jane@example.com…" spellCheck={false} error="Please enter a valid email." />
              <Select
                label="Budget"
                options={budgets}
                placeholder="Select a range"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
              <Textarea label="Message" hint="Optional" placeholder="Tell us what you are looking for…" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="sg-accordion">
        <div className="container">
          <SectionHeader id="sg-accordion" eyebrow="Accordion" title="Frequently asked questions" />
          <Reveal>
            <Accordion items={faq} defaultOpenId="a" />
          </Reveal>
        </div>
      </section>
    </>
  )
}
