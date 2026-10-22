import { propertyBySlug } from '../../../data/properties'

/**
 * Home 3D story: copy and choreography windows. Every value here is a share of the pinned scroll (0..1).
 * The 3D parts have their own windows in src/three/house/assemblyConfig.ts; keep the two in step.
 */

/** Pinned scroll length, in viewport heights. */
export const STORY_LENGTH_VH = { desktop: 600, mobile: 450 } as const
/** Seconds the ScrollTrigger playhead takes to catch up with the scrollbar (a little lag reads as cinematic). */
export const STORY_SCRUB = 1

/** Phones and portrait tablets: portrait framing, shorter pin, no chips. Mirrored in heroStory.css. */
export const MOBILE_QUERY = '(max-width: 47.99em), (orientation: portrait) and (max-width: 63.99em)'
/** Still of the finished house, shown while the 3D chunk loads and as the no-WebGL fallback (`npm run poster`). */
export const POSTER_SRC = '/house-poster.webp'

export type StageId = 'hero' | 'location' | 'structure' | 'craft' | 'light' | 'life' | 'living' | 'reveal'
export type StageSide = 'start' | 'end' | 'center'

export interface StoryStat {
  label: string
  value: string
}

export interface StoryStage {
  id: StageId
  /** Short label for the progress rail. Stages without one (hero, reveal) are not on the rail. */
  rail?: string
  eyebrow: string
  title: string
  /** Second headline line, set in italic gold (one per hero, design.md §1). */
  accent?: string
  body?: string
  /** Scroll window [start, end) in which this stage's copy is on screen. */
  window: readonly [number, number]
  /** Which side of the screen the copy sits on (desktop). The camera frames the house on the other side. */
  side: StageSide
  stats?: readonly StoryStat[]
  link?: { to: string; label: string }
}

const featured = propertyBySlug('dripping-springs-stone-ranch')

export const storyStages: readonly StoryStage[] = [
  {
    id: 'hero',
    eyebrow: 'Austin · Dallas–Fort Worth · Houston',
    title: 'Every great home',
    accent: 'begins as a plan.',
    body: 'Texas homes, advised end to end.',
    window: [0, 0.08],
    side: 'start',
  },
  {
    id: 'location',
    rail: 'Location',
    eyebrow: '01 / Location',
    title: 'Start with the right ground.',
    body: 'We shortlist by the way you want to live: schools, commute, light, lot size and long-term value, across Austin and the Hill Country, Dallas–Fort Worth and Houston. You see the right streets before you see a single listing.',
    window: [0.08, 0.2],
    side: 'start',
  },
  {
    id: 'structure',
    rail: 'Structure',
    eyebrow: '02 / Structure',
    title: 'Built by vetted builders.',
    body: 'Direct access to the builders and listing brokerages we have worked alongside, with track record, warranties and build quality checked before you commit.',
    window: [0.2, 0.38],
    side: 'end',
  },
  {
    id: 'craft',
    rail: 'Craft',
    eyebrow: '03 / Craft',
    title: 'Read the market, not the brochure.',
    body: 'Comparable sales, price-per-square-foot trends, property tax and HOA costs, set out plainly so every decision is backed by evidence rather than adjectives.',
    window: [0.38, 0.52],
    side: 'start',
  },
  {
    id: 'light',
    rail: 'Light',
    eyebrow: '04 / Light',
    title: 'Details you can live with.',
    body: 'Orientation, glazing and materials make the difference between a good house and the right home. We walk every property with that lens, in person or by live video.',
    window: [0.52, 0.66],
    side: 'end',
  },
  {
    id: 'life',
    rail: 'Life',
    eyebrow: '05 / Life',
    title: 'Room for the life you are planning.',
    body: featured
      ? `Modelled on the ${featured.title} in ${featured.location}: ${featured.descriptor.toLowerCase()}.`
      : undefined,
    window: [0.66, 0.8],
    side: 'start',
    stats: featured
      ? [
          { label: 'Bedrooms', value: featured.specs.beds },
          { label: 'Bathrooms', value: featured.specs.baths },
          { label: 'Living area', value: featured.specs.size },
          { label: 'Land', value: featured.specs.lot },
        ]
      : undefined,
    link: featured ? { to: `/opportunities/${featured.slug}`, label: 'View this home' } : undefined,
  },
  {
    id: 'living',
    rail: 'Living',
    eyebrow: '06 / Living',
    title: 'Outdoor living, Texas-sized.',
    body: 'Pools, porches and shade trees for long evenings outside, with HOA rules, flood zones and utility costs checked before you fall for the view.',
    window: [0.8, 0.92],
    side: 'end',
  },
  {
    id: 'reveal',
    eyebrow: 'Your next chapter',
    title: 'Your home is already out there.',
    body: 'Tell us how you want to live. We will bring you the shortlist.',
    window: [0.95, 1.01],
    side: 'center',
  },
]

export const railStages = storyStages.filter((stage) => stage.rail)

/** Index of the stage whose window contains `progress` (the last stage that has started). */
export function stageIndexAt(progress: number): number {
  let index = 0
  for (let i = 0; i < storyStages.length; i++) {
    if (progress >= storyStages[i].window[0]) index = i
  }
  return index
}

/** Short description of the canvas for assistive technology (the canvas itself is aria-hidden). */
export const sceneDescription =
  'Illustration: as you scroll, a modern Texas farmhouse assembles piece by piece, from the plot and foundation to walls, roof, glazing, furnished interiors, landscaping and a pool, finishing at dusk with the windows lit.'
