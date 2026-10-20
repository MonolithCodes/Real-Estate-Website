import { whatsappUrl } from '../../lib/contact'
import { MessageIcon } from '../ui/icons'

export function FloatingContact() {
  return (
    <a
      href={whatsappUrl('Hello, I would like to speak to an adviser.')}
      className="floating-contact"
      target="_blank"
      rel="noopener noreferrer"
      data-testid="whatsapp-float-button"
    >
      <MessageIcon size={18} />
      Speak to an Adviser
    </a>
  )
}
