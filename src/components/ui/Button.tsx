import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export type ButtonVariant = 'primary' | 'ghost' | 'outline' | 'link'
export type ButtonSize = 'md' | 'sm'

interface ButtonBase {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: ReactNode
  className?: string
  children: ReactNode
  'aria-label'?: string
  'data-testid'?: string
}

type ButtonTarget =
  | { to: string; href?: never; onClick?: () => void; type?: never; disabled?: never }
  | { href: string; to?: never; onClick?: () => void; type?: never; disabled?: never }
  | {
      to?: never
      href?: never
      onClick?: () => void
      type?: 'button' | 'submit' | 'reset'
      disabled?: boolean
    }

export type ButtonProps = ButtonBase & ButtonTarget

function classes(variant: ButtonVariant, size: ButtonSize, extra?: string): string {
  return ['btn', `btn--${variant}`, size === 'sm' ? 'btn--sm' : '', extra].filter(Boolean).join(' ')
}

const isExternal = (href: string) => /^(https?:)?\/\//.test(href)

export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', icon, className, children, onClick } = props
  const cls = classes(variant, size, className)
  const aria = props['aria-label']
  const testId = props['data-testid']
  const content = (
    <>
      {children}
      {icon ? <span className="btn__icon">{icon}</span> : null}
    </>
  )

  if (props.to !== undefined) {
    return (
      <Link to={props.to} className={cls} aria-label={aria} data-testid={testId} onClick={onClick}>
        {content}
      </Link>
    )
  }

  if (props.href !== undefined) {
    const external = isExternal(props.href)
    return (
      <a
        href={props.href}
        className={cls}
        aria-label={aria}
        data-testid={testId}
        onClick={onClick}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      type={props.type ?? 'button'}
      className={cls}
      disabled={props.disabled}
      aria-label={aria}
      data-testid={testId}
      onClick={onClick}
    >
      {content}
    </button>
  )
}
