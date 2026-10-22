import { Color, SRGBColorSpace } from 'three'
import { tokenRgb } from '../components/home/HeroStory/storyAtmosphere'

/** Scene colours come from tokens.css (`--scene-*`, `--bg-*`, `--gold*`), never from literals. */
export function tokenColor(token: string, target = new Color()): Color {
  const [r, g, b] = tokenRgb(token)
  return target.setRGB(r, g, b, SRGBColorSpace)
}

/** Raw token string for 2D canvas drawing (procedural textures). */
export const tokenCss = (token: string): string =>
  getComputedStyle(document.documentElement).getPropertyValue(token).trim()

/** Deterministic PRNG so the landscape and textures are identical on every load. */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
