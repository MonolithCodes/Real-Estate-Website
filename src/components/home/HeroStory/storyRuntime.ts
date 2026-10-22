import { stageIndexAt } from './storyContent'

/**
 * The single source of truth for story scroll. GSAP ScrollTrigger writes `progress`/`exit`; DOM overlays
 * (via `useStoryFrame`) and the R3F scene (in `useFrame`) read it. Never mirror these in React state.
 */
export const storyState = {
  /** 0..1 across the pinned section. */
  progress: 0,
  /** 0..1 as the pinned stage scrolls away into the next section. */
  exit: 0,
  /** Forces progress (poster capture, reduced-motion turntable). */
  override: null as number | null,
  /** Set by the scroll bridge: scrolls the page so the story reaches `progress`. */
  scrollToProgress: null as ((progress: number) => void) | null,
}

export const getProgress = (): number => storyState.override ?? storyState.progress

type FrameCallback = (progress: number, exit: number) => void
const frameCallbacks = new Set<FrameCallback>()

export function addFrameCallback(callback: FrameCallback): () => void {
  frameCallbacks.add(callback)
  callback(getProgress(), storyState.exit)
  return () => {
    frameCallbacks.delete(callback)
  }
}

/* Stage index: the only story value exposed to React, and it changes about eight times per scroll. */
let stageIndex = 0
const stageListeners = new Set<() => void>()

export const stageStore = {
  get: (): number => stageIndex,
  subscribe(listener: () => void): () => void {
    stageListeners.add(listener)
    return () => {
      stageListeners.delete(listener)
    }
  },
}

let last = { progress: -1, exit: -1 }

/** Called once per animation frame by the scroll bridge (gsap.ticker). Skips work when nothing moved. */
export function runStoryFrame(force = false): void {
  const progress = getProgress()
  const exit = storyState.exit
  if (!force && Math.abs(progress - last.progress) < 1e-5 && Math.abs(exit - last.exit) < 1e-5) return
  last = { progress, exit }

  const nextStage = stageIndexAt(progress)
  if (nextStage !== stageIndex) {
    stageIndex = nextStage
    stageListeners.forEach((listener) => listener())
  }
  frameCallbacks.forEach((callback) => callback(progress, exit))
}

/* Small math helpers shared by overlays and the scene. */
export const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v)
export const smoothstep = (a: number, b: number, v: number): number => {
  const t = clamp01((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}
