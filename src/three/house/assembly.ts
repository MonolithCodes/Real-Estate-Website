/**
 * Pure assembly maths: every pose is a function of scroll progress only, so scrolling back up
 * disassembles exactly. No three.js imports, so it is cheap to unit-test.
 */

export type Vec3 = readonly [number, number, number]

export const EASINGS = {
  linear: (t: number) => t,
  easeOutCubic: (t: number) => 1 - (1 - t) ** 3,
  easeInOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
  easeOutQuart: (t: number) => 1 - (1 - t) ** 4,
  easeInOutSine: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,
  easeOutExpo: (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t)),
  easeOutBack: (t: number) => {
    const c1 = 1.4
    const c3 = c1 + 1
    return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2
  },
} as const satisfies Record<string, (t: number) => number>

export type EaseName = keyof typeof EASINGS

export interface PoseInput {
  position: Vec3
  rotation: Vec3
  /** Uniform number or per-axis (e.g. `[1, 0.02, 1]` for walls rising from their base). */
  scale: number | Vec3
  opacity: number
}

/** A later keyframe layered on top of the assembled pose, e.g. the roof lifting for the interior cutaway. */
export interface HoldKeyframe {
  pose: Partial<PoseInput>
  /** Progress window over which the part moves into the hold pose. */
  enter: readonly [number, number]
  /** Optional window over which it returns to its assembled pose. */
  exit?: readonly [number, number]
  ease?: EaseName
}

export type PartId =
  | 'plot'
  | 'foundation'
  | 'walls_ground'
  | 'walls_upper'
  | 'roof'
  | 'chimney'
  | 'frames'
  | 'glazing'
  | 'cladding'
  | 'interior'
  | 'deck'
  | 'pool'
  | 'landscape'
  | 'lights'

export interface PartConfig {
  id: PartId
  /** Exploded pose (hero cloud). */
  from: PoseInput
  /** Optional intermediate pose reached at `at` (0..1 of the range), e.g. "flattened on the slab". */
  via?: { pose: PoseInput; at: number }
  /** Home pose. */
  to: PoseInput
  /** Global scroll progress window 0..1. */
  range: readonly [number, number]
  ease: EaseName
  hold: HoldKeyframe | null
  /** Point the part rotates and scales around (house coordinates, metres). Defaults to the origin. */
  pivot?: Vec3
  /** Draw gold blueprint edges while assembling. Defaults to true. */
  blueprint?: boolean
}

export interface Pose {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  opacity: number
}

export const createPose = (): Pose => ({ position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], opacity: 1 })

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const scale3 = (s: number | Vec3): Vec3 => (typeof s === 'number' ? [s, s, s] : s)

/** Linear progress of a part through its range (0 before, 1 after). */
export const partProgress = (config: PartConfig, progress: number): number =>
  clamp01((progress - config.range[0]) / (config.range[1] - config.range[0]))

function lerpPose(a: PoseInput, b: PoseInput, t: number, out: Pose): void {
  const sa = scale3(a.scale)
  const sb = scale3(b.scale)
  for (let i = 0; i < 3; i++) {
    out.position[i] = lerp(a.position[i], b.position[i], t)
    out.rotation[i] = lerp(a.rotation[i], b.rotation[i], t)
    out.scale[i] = lerp(sa[i], sb[i], t)
  }
  out.opacity = lerp(a.opacity, b.opacity, t)
}

function holdWeight(hold: HoldKeyframe, progress: number): number {
  const ease = EASINGS[hold.ease ?? 'easeInOutCubic']
  const enter = ease(clamp01((progress - hold.enter[0]) / (hold.enter[1] - hold.enter[0])))
  if (!hold.exit) return enter
  const leave = ease(clamp01((progress - hold.exit[0]) / (hold.exit[1] - hold.exit[0])))
  return enter * (1 - leave)
}

/**
 * Writes the pose for `progress` into `out` and returns the part's linear progress `t`.
 * Outside its range the part is clamped to its exploded or home pose.
 */
export function samplePose(config: PartConfig, progress: number, out: Pose): number {
  const t = partProgress(config, progress)
  const ease = EASINGS[config.ease]

  if (config.via) {
    const { at, pose } = config.via
    if (t < at) lerpPose(config.from, pose, EASINGS.easeInOutCubic(t / at), out)
    else lerpPose(pose, config.to, ease((t - at) / (1 - at)), out)
  } else {
    lerpPose(config.from, config.to, ease(t), out)
  }

  if (config.hold) {
    const w = holdWeight(config.hold, progress)
    if (w > 0) {
      const target = config.hold.pose
      const base: PoseInput = { position: [...out.position], rotation: [...out.rotation], scale: [...out.scale], opacity: out.opacity }
      lerpPose(base, { ...base, ...target }, w, out)
    }
  }
  return t
}
