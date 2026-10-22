import { smoothstep } from './storyRuntime'

/**
 * Background colour across the story, shared by the HTML stage and the WebGL clear colour so the two
 * always match. Colours come from tokens.css at runtime (never hard-coded here).
 */

export type Rgb = [number, number, number]

interface ColorKey {
  at: number
  token: string
}

/** Ivory hero → cool morning → bright ivory noon → warm golden hour → charcoal dusk. */
const BACKGROUND_KEYS: readonly ColorKey[] = [
  { at: 0, token: '--bg-base' },
  { at: 0.2, token: '--scene-sky-morning' },
  { at: 0.5, token: '--bg-base' },
  { at: 0.8, token: '--bg-alt' },
  { at: 0.88, token: '--scene-sky-golden' },
  { at: 0.95, token: '--bg-ink' },
]

/** The exit hand-off returns to this "daylight" moment so the next (ivory) section follows seamlessly. */
export const DAYLIGHT_PROGRESS = 0.5

const cache = new Map<string, Rgb>()

/** Reads a hex colour token from :root as sRGB components in 0..1. */
export function tokenRgb(token: string): Rgb {
  const hit = cache.get(token)
  if (hit) return hit
  const raw = getComputedStyle(document.documentElement).getPropertyValue(token).trim()
  const hex = raw.startsWith('#') ? raw.slice(1) : ''
  const full = hex.length === 3 ? [...hex].map((c) => c + c).join('') : hex
  const n = Number.parseInt(full, 16)
  const rgb: Rgb = Number.isNaN(n) || full.length !== 6 ? [1, 1, 1] : [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
  cache.set(token, rgb)
  return rgb
}

export const mixRgb = (a: Rgb, b: Rgb, t: number, out: Rgb = [0, 0, 0]): Rgb => {
  out[0] = a[0] + (b[0] - a[0]) * t
  out[1] = a[1] + (b[1] - a[1]) * t
  out[2] = a[2] + (b[2] - a[2]) * t
  return out
}

/** Samples keyed colours with smooth (ease-in-out) blending between keys. */
export function sampleKeys(keys: readonly ColorKey[], p: number, out: Rgb): Rgb {
  if (p <= keys[0].at) return mixRgb(tokenRgb(keys[0].token), tokenRgb(keys[0].token), 0, out)
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i]
    const b = keys[i + 1]
    if (p <= b.at) return mixRgb(tokenRgb(a.token), tokenRgb(b.token), smoothstep(a.at, b.at, p), out)
  }
  const lastKey = keys[keys.length - 1]
  return mixRgb(tokenRgb(lastKey.token), tokenRgb(lastKey.token), 0, out)
}

/** How far the exit hand-off has pulled the look back to daylight (0..1). */
export const exitBlend = (exit: number): number => smoothstep(0, 0.4, exit)

const story: Rgb = [0, 0, 0]
const day: Rgb = [0, 0, 0]

export function sampleBackground(progress: number, exit: number, out: Rgb): Rgb {
  sampleKeys(BACKGROUND_KEYS, progress, story)
  const blend = exitBlend(exit)
  if (blend <= 0) return mixRgb(story, story, 0, out)
  return mixRgb(story, sampleKeys(BACKGROUND_KEYS, DAYLIGHT_PROGRESS, day), blend, out)
}

/** Relative luminance (approximate, sRGB) used to flip overlay text to the dark scope. */
export const luminance = ([r, g, b]: Rgb): number => 0.2126 * r + 0.7152 * g + 0.0722 * b

export const toCss = ([r, g, b]: Rgb): string =>
  `rgb(${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(b * 255)})`
