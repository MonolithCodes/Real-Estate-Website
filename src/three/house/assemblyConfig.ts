import type { PartConfig, PartId, PoseInput } from './assembly'

/**
 * Assembly choreography. Retune timing here without touching logic.
 *
 * - `range` is the global scroll window (0..1) over which a part travels from `from` to `to`.
 * - Stage windows (copy) live in src/components/home/HeroStory/storyContent.ts:
 *   hero 0–.08 · location .08–.20 · structure .20–.38 · craft .38–.52 · light .52–.66 · life .66–.80 ·
 *   living .80–.92 · reveal .92–1.
 * - Small offsets inside a stage (≈ .01–.02) give the choreographed stagger.
 * - Units are metres; the house origin is the centre of the ground-floor slab.
 */

const HOME: PoseInput = { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1, opacity: 1 }

/** Interior cutaway (stage 05): the roof lifts and slides back, then returns for stage 06. */
const CUTAWAY_ENTER = [0.665, 0.715] as const
const CUTAWAY_EXIT = [0.795, 0.845] as const
const ROOF_ASIDE = { position: [-1, 8.5, -15] as const, rotation: [-0.35, 0.25, 0] as const }

export const assemblyConfig: readonly PartConfig[] = [
  {
    id: 'plot',
    from: { position: [0, -9, 6], rotation: [0.35, 0.2, -0.08], scale: 0.55, opacity: 0.06 },
    to: HOME,
    range: [0.08, 0.16],
    ease: 'easeOutCubic',
    hold: null,
  },
  {
    id: 'foundation',
    from: { position: [12, -3, 15], rotation: [0.5, 0.8, 0.2], scale: 0.6, opacity: 0.08 },
    via: { at: 0.5, pose: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 0.04, 1], opacity: 0.6 } },
    to: HOME,
    range: [0.13, 0.21],
    ease: 'easeOutCubic',
    hold: null,
  },
  {
    id: 'walls_ground',
    from: { position: [12, 7, -10], rotation: [-0.4, 1.1, 0.25], scale: 0.7, opacity: 0.08 },
    // Flies onto the slab flattened, then rises from its base.
    via: { at: 0.45, pose: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 0.03, 1], opacity: 0.55 } },
    to: HOME,
    range: [0.21, 0.31],
    ease: 'easeOutCubic',
    hold: null,
    pivot: [0, 0.35, 0],
  },
  {
    id: 'walls_upper',
    from: { position: [-1, 16, -13], rotation: [0.3, -0.7, 0.4], scale: 0.7, opacity: 0.08 },
    // Hovers above the ground floor, then lowers in.
    via: { at: 0.55, pose: { position: [0, 7, 0], rotation: [0, 0.15, 0], scale: 1, opacity: 0.85 } },
    to: HOME,
    range: [0.28, 0.38],
    ease: 'easeInOutCubic',
    hold: { pose: { opacity: 0.15 }, enter: [0.665, 0.7], exit: [0.79, 0.83] },
  },
  {
    id: 'roof',
    from: { position: [2, 16, -10], rotation: [0.6, 0.9, 0], scale: 0.6, opacity: 0.08 },
    to: HOME,
    range: [0.4, 0.5],
    ease: 'easeOutCubic',
    hold: { pose: ROOF_ASIDE, enter: CUTAWAY_ENTER, exit: CUTAWAY_EXIT },
  },
  {
    id: 'chimney',
    from: { position: [10, 20, -4], rotation: [0.9, 0.2, 0.6], scale: 0.6, opacity: 0.08 },
    via: { at: 0.6, pose: { position: [0, 6, 0], rotation: [0, 0, 0], scale: 1, opacity: 0.9 } },
    to: HOME,
    range: [0.47, 0.53],
    ease: 'easeOutQuart',
    hold: { pose: ROOF_ASIDE, enter: CUTAWAY_ENTER, exit: CUTAWAY_EXIT },
  },
  {
    id: 'frames',
    from: { position: [4, 2, 17], rotation: [0.2, -0.9, 0.1], scale: 0.75, opacity: 0.08 },
    to: HOME,
    range: [0.53, 0.6],
    ease: 'easeOutQuart',
    hold: null,
  },
  {
    id: 'glazing',
    from: { position: [7, 15, -14], rotation: [-0.2, 0.6, 0.1], scale: 0.75, opacity: 0.06 },
    to: HOME,
    range: [0.555, 0.635],
    ease: 'easeOutCubic',
    hold: null,
  },
  {
    id: 'cladding',
    from: { position: [22, 11, -3], rotation: [0.4, 0.5, -0.3], scale: 0.7, opacity: 0.08 },
    // Wipes across the facade from its west edge.
    via: { at: 0.55, pose: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [0.02, 1, 1], opacity: 1 } },
    to: HOME,
    range: [0.56, 0.66],
    ease: 'easeInOutCubic',
    hold: null,
    pivot: [-8.2, 0, 5],
  },
  {
    id: 'interior',
    from: { position: [6, 12, 14], rotation: [0.4, 0.5, -0.2], scale: 0.55, opacity: 0.06 },
    // Drops in through the opened roof.
    via: { at: 0.5, pose: { position: [0, 10, 0], rotation: [0, 0, 0], scale: 1, opacity: 0.9 } },
    to: HOME,
    range: [0.66, 0.74],
    ease: 'easeOutCubic',
    hold: null,
  },
  {
    id: 'deck',
    from: { position: [18, 2, 14], rotation: [0.3, -0.4, 0], scale: 0.6, opacity: 0.08 },
    to: HOME,
    range: [0.8, 0.86],
    ease: 'easeOutCubic',
    hold: null,
  },
  {
    id: 'pool',
    from: { position: [20, 9, -6], rotation: [-0.5, 0.3, 0.4], scale: 0.6, opacity: 0.08 },
    to: HOME,
    range: [0.82, 0.875],
    ease: 'easeOutCubic',
    hold: null,
  },
  {
    // Trees, shrubs and grass grow in individually (see parts/Landscape.tsx); the group itself stays put.
    id: 'landscape',
    from: HOME,
    to: HOME,
    range: [0.83, 0.92],
    ease: 'linear',
    hold: null,
    blueprint: false,
  },
  {
    id: 'lights',
    from: HOME,
    to: HOME,
    range: [0.86, 0.91],
    ease: 'linear',
    hold: null,
    blueprint: false,
  },
]

export const partConfig = Object.fromEntries(assemblyConfig.map((c) => [c.id, c])) as Record<PartId, PartConfig>
