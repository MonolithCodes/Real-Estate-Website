import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { whatsappUrl } from '../../lib/contact'
import { emptyEnquiry, submitEnquiry, validateContact } from '../../lib/enquiry'
import type { EnquiryErrors, EnquiryValues } from '../../lib/enquiry'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface EnquiryCardProps {
  projectTitle: string
  price: string
  slug: string
}

/** Compact sticky enquiry card for the project detail page. */
export function EnquiryCard({ projectTitle, price, slug }: EnquiryCardProps) {
  const [values, setValues] = useState<EnquiryValues>(() => ({
    ...emptyEnquiry(`project:${slug}`),
    message: `I am interested in ${projectTitle}.`,
  }))
  const [errors, setErrors] = useState<EnquiryErrors>({})
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const ref = useRef<HTMLFormElement>(null)

  const set = <K extends keyof EnquiryValues>(k: K, val: EnquiryValues[K]) => {
    setValues((v) => ({ ...v, [k]: val }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    const e = validateContact(values)
    setErrors(e)
    if (Object.keys(e).length) {
      requestAnimationFrame(() => ref.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }
    setSending(true)
    await submitEnquiry(values)
    setSending(false)
    setDone(true)
  }

  if (done) {
    return (
      <div className="card enquiry form__success" role="status">
        <h2 className="t-h3">Request received</h2>
        <p className="t-body">An advisor will contact you within one business day about {projectTitle}.</p>
        <Button href={whatsappUrl(`Hello, I am interested in ${projectTitle}.`)} variant="outline">
          Chat on WhatsApp
        </Button>
      </div>
    )
  }

  return (
    <form ref={ref} className="card enquiry form" onSubmit={onSubmit} noValidate data-testid="enquiry-card">
      <div>
        <p className="eyebrow">Enquire</p>
        <p className="detail__price">{price.split(' · ')[0]}</p>
      </div>
      <Input
        label="Full name"
        name="name"
        autoComplete="name"
        placeholder="Jane Smith…"
        value={values.name}
        onChange={(e) => set('name', e.target.value)}
        error={errors.name}
      />
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        spellCheck={false}
        placeholder="jane@example.com…"
        value={values.email}
        onChange={(e) => set('email', e.target.value)}
        error={errors.email}
      />
      <input
        className="honeypot"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        name="website"
        value={values.website}
        onChange={(e) => set('website', e.target.value)}
      />
      <div>
        <label className="form__consent">
          <input
            type="checkbox"
            name="consent"
            checked={values.consent}
            onChange={(e) => set('consent', e.target.checked)}
            aria-invalid={errors.consent ? true : undefined}
          />
          <span>
            I agree to be contacted. See our{' '}
            <Link to="/privacy-policy" className="btn btn--link">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {errors.consent ? (
          <p className="field__error" role="alert">
            {errors.consent}
          </p>
        ) : null}
      </div>
      <Button type="submit" disabled={sending}>
        {sending ? 'Sending…' : 'Request Details'}
      </Button>
      <Button href={whatsappUrl(`Hello, I am interested in ${projectTitle}.`)} variant="outline">
        WhatsApp an Advisor
      </Button>
    </form>
  )
}
