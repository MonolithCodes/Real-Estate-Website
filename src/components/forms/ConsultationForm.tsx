import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { whatsappUrl } from '../../lib/contact'
import {
  budgetOptions,
  buyerTypeOptions,
  destinationOptions,
  emptyEnquiry,
  submitEnquiry,
  timelineOptions,
  validateContact,
  validateIntent,
} from '../../lib/enquiry'
import type { EnquiryErrors, EnquiryValues } from '../../lib/enquiry'
import { Button } from '../ui/Button'
import { Input, Textarea } from '../ui/Input'
import { Select } from '../ui/Select'

type Step = 0 | 1 | 2 | 'done'
const STEP_TITLES = ['Your goals', 'Your preferences', 'Your details'] as const

/** Three-step private consultation form with inline validation and a WhatsApp fallback. */
export function ConsultationForm({ source = 'consultation' }: { source?: string }) {
  const [step, setStep] = useState<Step>(0)
  const [values, setValues] = useState<EnquiryValues>(() => emptyEnquiry(source))
  const [errors, setErrors] = useState<EnquiryErrors>({})
  const [sending, setSending] = useState(false)
  const [failed, setFailed] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const set = <K extends keyof EnquiryValues>(key: K, value: EnquiryValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const focusFirstError = () =>
    requestAnimationFrame(() =>
      formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
    )

  const next = () => {
    const e = step === 0 ? validateIntent(values) : {}
    setErrors(e)
    if (Object.keys(e).length) return focusFirstError()
    setStep((s) => (typeof s === 'number' && s < 2 ? ((s + 1) as Step) : s))
  }

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    if (step !== 2) return next()
    const e = validateContact(values)
    setErrors(e)
    if (Object.keys(e).length) return focusFirstError()
    setSending(true)
    setFailed(false)
    try {
      const res = await submitEnquiry(values)
      if (res.ok) setStep('done')
      else setFailed(true)
    } catch {
      setFailed(true)
    } finally {
      setSending(false)
    }
  }

  if (step === 'done') {
    return (
      <div className="card enquiry form__success" role="status" data-testid="consultation-success">
        <h2 className="t-h3-lg">Thank you, {values.name.split(' ')[0] || 'friend'}.</h2>
        <p className="t-body">
          We have received your request and will reply within one business day to arrange your private consultation.
        </p>
        <div className="form__actions">
          <Button href={whatsappUrl('Hello, I just submitted a consultation request.')} variant="outline">
            Chat on WhatsApp
          </Button>
          <Button to="/opportunities" variant="ghost">
            Browse Opportunities
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form ref={formRef} className="card enquiry form" onSubmit={onSubmit} noValidate data-testid="consultation-form">
      <div className="form__progress" aria-hidden="true">
        {STEP_TITLES.map((t, i) => (
          <span key={t} data-done={i <= (step as number)} />
        ))}
      </div>
      <p className="eyebrow" aria-live="polite">
        Step {(step as number) + 1} of 3 · {STEP_TITLES[step as number]}
      </p>

      {step === 0 ? (
        <>
          <Select
            label="I am"
            name="buyerType"
            options={buyerTypeOptions}
            placeholder="Select one…"
            value={values.buyerType}
            onChange={(e) => set('buyerType', e.target.value)}
            error={errors.buyerType}
          />
          <Select
            label="Destination"
            name="destination"
            options={destinationOptions}
            placeholder="Select a destination…"
            value={values.destination}
            onChange={(e) => set('destination', e.target.value)}
            error={errors.destination}
          />
          <Select
            label="Approximate budget"
            name="budget"
            options={budgetOptions}
            placeholder="Select a range…"
            value={values.budget}
            onChange={(e) => set('budget', e.target.value)}
            error={errors.budget}
          />
        </>
      ) : null}

      {step === 1 ? (
        <>
          <Select
            label="Timeline"
            name="timeline"
            options={timelineOptions}
            placeholder="When do you plan to buy…"
            value={values.timeline}
            onChange={(e) => set('timeline', e.target.value)}
          />
          <Textarea
            label="Anything we should know?"
            name="message"
            hint="Optional: schools, commute, must-haves, questions."
            placeholder="Tell us what matters most…"
            value={values.message}
            onChange={(e) => set('message', e.target.value)}
          />
        </>
      ) : null}

      {step === 2 ? (
        <>
          <Input
            label="Full name"
            name="name"
            autoComplete="name"
            placeholder="Jane Smith…"
            value={values.name}
            onChange={(e) => set('name', e.target.value)}
            error={errors.name}
          />
          <div className="form__row form__row--2">
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
            <Input
              label="Phone / WhatsApp"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="+1 512 555 0123…"
              hint="Optional"
              value={values.phone}
              onChange={(e) => set('phone', e.target.value)}
              error={errors.phone}
            />
          </div>
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
                I agree to be contacted about my enquiry and have read the{' '}
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
        </>
      ) : null}

      {failed ? (
        <p className="field__error" role="alert">
          Something went wrong sending your request. Please try again or message us on WhatsApp.
        </p>
      ) : null}

      <div className="form__actions">
        {step > 0 ? (
          <Button variant="ghost" onClick={() => setStep((s) => ((s as number) - 1) as Step)}>
            Back
          </Button>
        ) : null}
        {step < 2 ? (
          <Button onClick={next}>Continue</Button>
        ) : (
          <Button type="submit" disabled={sending}>
            {sending ? 'Sending…' : 'Request Consultation'}
          </Button>
        )}
      </div>
      <p className="t-legal">We reply within one business day. Your details are kept confidential.</p>
    </form>
  )
}
