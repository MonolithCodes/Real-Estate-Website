/**
 * Procedural house layout in metres (1 unit = 1 m). Origin: centre of the ground-floor slab at grade.
 * Front of the house faces +z (towards the hero camera). Footprint 16 × 10 m plus porch, deck and pool.
 */

export interface Opening {
  /** Distance from the wall's start corner to the opening's left edge. */
  offset: number
  width: number
  sill: number
  height: number
  kind: 'window' | 'slider' | 'entry'
}

export interface WallSpec {
  start: readonly [number, number]
  end: readonly [number, number]
  base: number
  height: number
  openings: readonly Opening[]
}

export const WALL_T = 0.25
export const SLAB_TOP = 0.35
export const GROUND_TOP = 3.55
export const UPPER_BASE = 3.8
export const UPPER_TOP = 6.8

const ground = (start: [number, number], end: [number, number], openings: Opening[]): WallSpec => ({
  start,
  end,
  base: SLAB_TOP,
  height: GROUND_TOP - SLAB_TOP,
  openings,
})
const upper = (start: [number, number], end: [number, number], openings: Opening[]): WallSpec => ({
  start,
  end,
  base: UPPER_BASE,
  height: UPPER_TOP - UPPER_BASE,
  openings,
})

/** Ground floor: x −8..8, z −5..5. Walls run clockwise seen from above, so local +z faces outward. */
export const groundWalls: readonly WallSpec[] = [
  ground([-8, 5], [8, 5], [
    { offset: 5.8, width: 1.6, sill: 0, height: 2.5, kind: 'entry' },
    { offset: 8.4, width: 3, sill: 0.5, height: 2.2, kind: 'window' },
    { offset: 12.2, width: 2.6, sill: 0.5, height: 2.2, kind: 'window' },
  ]),
  ground([8, 5], [8, -5], [
    { offset: 2, width: 4.2, sill: 0, height: 2.7, kind: 'slider' },
    { offset: 7.4, width: 1.4, sill: 0.9, height: 1.4, kind: 'window' },
  ]),
  ground([8, -5], [-8, -5], [
    { offset: 2.5, width: 2, sill: 0.9, height: 1.5, kind: 'window' },
    { offset: 7, width: 3, sill: 1.05, height: 1.2, kind: 'window' },
    { offset: 12, width: 1.4, sill: 0.9, height: 1.6, kind: 'window' },
  ]),
  ground([-8, -5], [-8, 5], [{ offset: 3.5, width: 2.8, sill: 0.6, height: 2, kind: 'window' }]),
]

/** Upper floor: x −8..2.5, z −5..2.5, set back from the front and east to leave a single-storey wing. */
export const upperWalls: readonly WallSpec[] = [
  upper([-8, 2.5], [2.5, 2.5], [
    { offset: 4.2, width: 2.4, sill: 0.4, height: 2.2, kind: 'window' },
    { offset: 7.4, width: 2.4, sill: 0.4, height: 2.2, kind: 'window' },
  ]),
  upper([2.5, 2.5], [2.5, -5], [{ offset: 2.8, width: 2, sill: 0.6, height: 1.8, kind: 'window' }]),
  upper([2.5, -5], [-8, -5], [
    { offset: 1.5, width: 1.4, sill: 1, height: 1.2, kind: 'window' },
    { offset: 5.5, width: 2.2, sill: 0.6, height: 1.8, kind: 'window' },
  ]),
  upper([-8, -5], [-8, 2.5], [{ offset: 2.4, width: 2.4, sill: 0.5, height: 2, kind: 'window' }]),
]

export interface Rect {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
}

export const PLOT = { minX: -17, maxX: 23, minZ: -13, maxZ: 15, radius: 2.5, depth: 0.6 } as const
export const POOL: Rect & { water: number; floor: number } = { minX: 9.6, maxX: 13.6, minZ: -3.4, maxZ: 5.4, water: 0.18, floor: -0.45 }
export const DECK: Rect & { top: number } = { minX: 8.2, maxX: 15.6, minZ: -5, maxZ: 7.6, top: 0.3 }
export const PORCH: Rect = { minX: -8, maxX: 2.5, minZ: 5, maxZ: 7.4 }
export const DRIVE: Rect = { minX: 3.6, maxX: 7.4, minZ: 5.2, maxZ: 15 }
/** Front path from the porch steps (entry door centre x = −1.4) to the plot edge. */
export const PATH_X = -1.4

/** Areas kept clear of grass and trees. */
export const KEEP_CLEAR: readonly Rect[] = [
  { minX: -8.8, maxX: 8.8, minZ: -5.8, maxZ: 5.8 },
  { minX: PORCH.minX - 0.4, maxX: PORCH.maxX + 0.4, minZ: PORCH.minZ, maxZ: PORCH.maxZ + 0.6 },
  { minX: DECK.minX - 0.4, maxX: DECK.maxX + 0.4, minZ: DECK.minZ - 0.4, maxZ: DECK.maxZ + 0.4 },
  { minX: DRIVE.minX - 0.3, maxX: DRIVE.maxX + 0.3, minZ: DRIVE.minZ, maxZ: DRIVE.maxZ },
  { minX: PATH_X - 0.9, maxX: PATH_X + 0.9, minZ: PORCH.maxZ, maxZ: PLOT.maxZ },
]

export const inRect = (r: Rect, x: number, z: number): boolean => x >= r.minX && x <= r.maxX && z >= r.minZ && z <= r.maxZ

/** Where the camera rig looks: the visual centre of house, deck and pool. */
export const HOUSE_CENTER = [3.5, 2.6, 1] as const
