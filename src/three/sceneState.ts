import type { Material } from 'three'

export type SceneMode = 'story' | 'turntable' | 'poster'

/**
 * Per-frame scene values, written by <ProgressDriver> (first in the frame) and read by everything else.
 * `p` and `exit` are the damped story progress values; mutable on purpose (never React state).
 */
export const sceneState = {
  p: 0,
  exit: 0,
  /** Seconds since the scene mounted, for idle motion. */
  time: 0,
  /** False until the first frame, which snaps progress instead of damping it. */
  primed: false,
}

/**
 * Materials whose look depends on time of day (window glass, interior and path lights, pool glow).
 * Assembly parts clone their materials, so the clones register here for <TimeOfDay> to drive.
 */
export type MaterialRole = 'glass' | 'glow' | 'poolGlow'
export const roleMaterials: Record<MaterialRole, Set<Material>> = {
  glass: new Set(),
  glow: new Set(),
  poolGlow: new Set(),
}
