import { Link } from 'react-router-dom'
import { PageHero } from '../components/layout/PageHero'
import { Seo } from '../components/ui/Seo'
import { builders } from '../data/content'
import { articles } from '../data/content'
import { destinations } from '../data/destinations'
import { footerColumns, primaryNav } from '../data/nav'
import { properties } from '../data/properties'

export function Sitemap() {
  const groups: { title: string; links: { label: string; to: string }[] }[] = [
    { title: 'Main', links: [...primaryNav, { label: 'Private Consultation', to: '/private-consultation' }, { label: 'Land, Development & JV', to: '/land-development-jv' }, { label: 'Client Stories', to: '/client-stories' }] },
    { title: 'Destinations', links: destinations.map((d) => ({ label: d.title, to: `/destinations/${d.slug}` })) },
    { title: 'Opportunities', links: properties.map((p) => ({ label: p.title, to: `/opportunities/${p.slug}` })) },
    { title: 'Developments', links: builders.map((b) => ({ label: b.name, to: `/developments/${b.slug}` })) },
    { title: 'Insights', links: articles.map((a) => ({ label: a.title, to: `/insights/${a.slug}` })) },
    { title: 'Legal', links: footerColumns.find((c) => c.title === 'Legal')?.links.filter((l) => l.to !== '/sitemap').map((l) => ({ ...l })) ?? [] },
  ]
  return (
    <>
      <Seo title="Sitemap" description="All pages on the site." />
      <PageHero short eyebrow="Sitemap" title="Sitemap" />
      <section className="section">
        <div className="container sitemap-grid">
          {groups.map((g) => (
            <nav key={g.title} aria-label={g.title}>
              <h2 className="eyebrow" style={{ marginBottom: 'var(--space-4)' }}>
                {g.title}
              </h2>
              <ul>
                {g.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </section>
    </>
  )
}
