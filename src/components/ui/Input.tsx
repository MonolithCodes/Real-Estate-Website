import { useId } from 'react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

interface FieldChrome {
  label: string
  hint?: string
  error?: string
}

function describedBy(id: string, hint?: string, error?: string): string | undefined {
  const ids = [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean)
  return ids.length ? ids.join(' ') : undefined
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: FieldChrome & { id: string; children: ReactNode }) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="field__hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="field__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export type InputProps = FieldChrome & Omit<ComponentPropsWithoutRef<'input'>, 'className'>

export function Input({ label, hint, error, id: idProp, ...rest }: InputProps) {
  const auto = useId()
  const id = idProp ?? auto
  return (
    <Field id={id} label={label} hint={hint} error={error}>
      <input
        id={id}
        className="field__control"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        {...rest}
      />
    </Field>
  )
}

export type TextareaProps = FieldChrome & Omit<ComponentPropsWithoutRef<'textarea'>, 'className'>

export function Textarea({ label, hint, error, id: idProp, ...rest }: TextareaProps) {
  const auto = useId()
  const id = idProp ?? auto
  return (
    <Field id={id} label={label} hint={hint} error={error}>
      <textarea
        id={id}
        className="field__control"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        {...rest}
      />
    </Field>
  )
}
