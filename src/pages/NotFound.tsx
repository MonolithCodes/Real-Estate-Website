import { Button } from '../components/ui/Button'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Seo } from '../components/ui/Seo'

export function NotFound() {
  return (
    <section
      className="section theme-dark grain"
      style={{ minHeight: '100svh', display: 'grid', placeItems: 'center', background: 'var(--bg-ink)' }}
    >
      <Seo title="Page Not Found" />
      <div className="container" style={{ textAlign: 'center' }} data-testid="not-found-page">
        <Eyebrow>Error 404</Eyebrow>
        <h1 className="t-hero" style={{ margin: 'var(--space-5) auto var(--space-6)' }}>
          Page not found
        </h1>
        <p className="t-lead" style={{ margin: '0 auto var(--space-10)' }}>
          The page you are looking for may have moved or no longer exists.
        </p>
        <Button to="/" variant="outline">
          Back to Home
        </Button>
      </div>
    </section>
  )
}
