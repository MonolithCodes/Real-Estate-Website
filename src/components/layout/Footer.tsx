import { Link } from 'react-router-dom'
import { footerColumns } from '../../data/nav'
import { site } from '../../data/site'
import { mailUrl, telUrl } from '../../lib/contact'
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from '../ui/icons'
import { SiteLogo } from './SiteLogo'

const socials = [
  { name: 'Instagram', href: site.social.instagram, cls: 'social-btn--instagram', Icon: InstagramIcon },
  { name: 'Facebook', href: site.social.facebook, cls: 'social-btn--facebook', Icon: FacebookIcon },
  { name: 'LinkedIn', href: site.social.linkedin, cls: 'social-btn--linkedin', Icon: LinkedinIcon },
] as const

export function Footer() {
  return (
    <footer className="footer theme-dark" data-testid="site-footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <SiteLogo />
            <p className="footer__about">{site.description}</p>
            <address className="footer__contact">
              <a href={telUrl} data-testid="footer-phone">
                <PhoneIcon size={16} />
                {site.phone}
              </a>
              <a href={mailUrl} data-testid="footer-email">
                <MailIcon size={16} />
                {site.email}
              </a>
              <p>
                <MapPinIcon size={16} />
                <span>
                  {site.location}
                  <br />
                  {site.locationNote}
                </span>
              </p>
            </address>
            <div className="social">
              {socials.map(({ name, href, cls, Icon }) => (
                <a
                  key={name}
                  href={href}
                  className={`social-btn ${cls}`}
                  aria-label={name}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`social-${name.toLowerCase()}`}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <nav className="footer__columns" aria-label="Footer">
            {footerColumns.map((col) => (
              <div key={col.title}>
                <h2 className="footer__title">{col.title}</h2>
                <ul className="footer__list">
                  {col.links.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className="footer__link">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="footer__bottom">
          <div className="gold-hairline" aria-hidden="true" />
          <p className="t-legal footer__disclaimer">{site.license}</p>
          <p className="t-legal footer__disclaimer">{site.disclaimer}</p>
          <p className="t-legal footer__disclaimer">{site.equalHousing}</p>
          <p className="t-legal">
            © {new Date().getFullYear()} {site.brandName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
