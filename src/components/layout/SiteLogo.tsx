import { Link } from 'react-router-dom'
import { site } from '../../data/site'

export function SiteLogo() {
  return (
    <Link to="/" className="logo" data-testid="logo-home-link" aria-label={`${site.brandName} — home`}>
      <span className="logo__mark text-gold-gradient" aria-hidden="true">
        {site.monogram}
      </span>
      <span className="logo__text" translate="no">{site.brandName}</span>
    </Link>
  )
}
