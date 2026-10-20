import { Link } from 'react-router-dom'
import { telUrl, whatsappUrl } from '../../lib/contact'
import { MailIcon, MessageIcon, PhoneIcon } from '../ui/icons'

export function MobileActionBar() {
  return (
    <nav className="mobile-bar" aria-label="Quick contact" data-testid="mobile-action-bar">
      <a
        href={whatsappUrl('Hello, I would like to speak to an adviser.')}
        className="mobile-bar__item mobile-bar__item--accent"
        target="_blank"
        rel="noopener noreferrer"
        data-testid="mobile-bar-whatsapp"
      >
        <MessageIcon size={20} />
        WhatsApp
      </a>
      <Link to="/private-consultation" className="mobile-bar__item" data-testid="mobile-bar-enquire">
        <MailIcon size={20} />
        Enquire
      </Link>
      <a href={telUrl} className="mobile-bar__item" data-testid="mobile-bar-call">
        <PhoneIcon size={20} />
        Call
      </a>
    </nav>
  )
}
