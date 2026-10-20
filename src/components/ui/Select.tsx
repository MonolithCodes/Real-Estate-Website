import { useId } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { ChevronDownIcon } from './icons'

export interface SelectOption {
  value: string
  label: string
}

export type SelectProps = {
  label: string
  options: readonly SelectOption[]
  placeholder?: string
  hint?: string
  error?: string
} & Omit<ComponentPropsWithoutRef<'select'>, 'className' | 'children'>

export function Select({ label, options, placeholder, hint, error, id: idProp, ...rest }: SelectProps) {
  const auto = useId()
  const id = idProp ?? auto
  const described = [hint && !error ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ')

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <div className="select">
        <select
          id={id}
          className="field__control"
          aria-invalid={error ? true : undefined}
          aria-describedby={described || undefined}
          {...rest}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="select__icon" size={18} />
      </div>
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
