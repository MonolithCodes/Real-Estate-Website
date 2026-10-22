import type { UIMatch } from 'react-router-dom'

/** Static per-route flags read by the layout via `useMatches()`. */
export interface RouteHandle {
  /** The page opens on a light hero, so the header starts in its solid (ivory) state. */
  lightHero?: boolean
}

export function isLightHeroRoute(matches: readonly UIMatch[]): boolean {
  return matches.some((match) => (match.handle as RouteHandle | undefined)?.lightHero === true)
}
