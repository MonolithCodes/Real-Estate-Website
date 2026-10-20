import type { SVGProps } from 'react'

/** Minimal inline icon set (Lucide-style, 1.5 stroke) so no icon dependency is needed. */
type IconProps = Omit<SVGProps<SVGSVGElement>, 'children'> & { size?: number }

function Svg({ size = 20, strokeWidth = 1.5, ...rest }: IconProps & { children?: never }, paths: string[]) {
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}

export const MenuIcon = (p: IconProps) => Svg(p, ['M4 6h16', 'M4 12h16', 'M4 18h16'])
export const CloseIcon = (p: IconProps) => Svg(p, ['M18 6 6 18', 'M6 6l12 12'])
export const ArrowRightIcon = (p: IconProps) => Svg(p, ['M5 12h14', 'm12 5 7 7-7 7'])
export const ChevronDownIcon = (p: IconProps) => Svg(p, ['m6 9 6 6 6-6'])
export const PlusIcon = (p: IconProps) => Svg(p, ['M12 5v14', 'M5 12h14'])
export const PhoneIcon = (p: IconProps) =>
  Svg(p, [
    'M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z',
  ])
export const MailIcon = (p: IconProps) =>
  Svg(p, ['M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', 'm22 7-10 6L2 7'])
export const MapPinIcon = (p: IconProps) =>
  Svg(p, ['M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z', 'M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'])
export const MessageIcon = (p: IconProps) =>
  Svg(p, ['M7.9 20A9 9 0 1 0 4 16.1L2 22z'])
export const InstagramIcon = (p: IconProps) =>
  Svg(p, [
    'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z',
    'M16 11.4a4 4 0 1 1-7.9 1.2 4 4 0 0 1 7.9-1.2z',
    'M17.5 6.5h.01',
  ])
export const FacebookIcon = (p: IconProps) =>
  Svg(p, ['M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z'])
export const LinkedinIcon = (p: IconProps) =>
  Svg(p, [
    'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z',
    'M2 9h4v12H2z',
    'M4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z',
  ])
