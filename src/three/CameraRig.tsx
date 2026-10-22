import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import { CatmullRomCurve3, Vector3 } from 'three'
import type { PerspectiveCamera } from 'three'
import { stageIndexAt, storyStages } from '../components/home/HeroStory/storyContent'
import { smoothstep } from '../components/home/HeroStory/storyRuntime'
import type { Vec3 } from './house/assembly'
import { HOUSE_CENTER } from './house/layout'
import type { SceneMode } from './sceneState'
import { sceneState } from './sceneState'

interface CameraKey {
  at: number
  position: Vec3
  target: Vec3
}

/**
 * Camera path keyed to the storyboard. Position and look-at each run along a centripetal Catmull-Rom
 * spline; progress is mapped so each key is reached at its `at` value.
 */
const KEYS: readonly CameraKey[] = [
  { at: 0, position: [26, 16, 34], target: [1.5, 3.5, 0] },
  { at: 0.1, position: [22, 30, 28], target: [1, 0, 0] },
  { at: 0.2, position: [21, 20, 27], target: [1.5, 1.5, 0] },
  { at: 0.36, position: [25, 12, 22], target: [1.5, 3, 0] },
  { at: 0.47, position: [8, 13, 33], target: [0, 4.2, 0] },
  { at: 0.6, position: [-13, 8, 29], target: [0.5, 3.2, 2] },
  { at: 0.72, position: [6, 31, 15], target: [0.5, 0.5, -0.5] },
  { at: 0.79, position: [12, 27, 13], target: [1.5, 1, 0] },
  { at: 0.87, position: [31, 12, 22], target: [6, 1.5, 1] },
  { at: 0.95, position: [25, 7, 31], target: [3, 3, 0.5] },
  { at: 1, position: [31, 10, 41], target: [HOUSE_CENTER[0] - 1, 3, HOUSE_CENTER[2] - 1] },
]

const toVec = (v: Vec3) => new Vector3(v[0], v[1], v[2])
const positionCurve = new CatmullRomCurve3(KEYS.map((k) => toVec(k.position)), false, 'centripetal')
const targetCurve = new CatmullRomCurve3(KEYS.map((k) => toVec(k.target)), false, 'centripetal')

/** Progress → curve parameter, easing gently into and out of each key. */
function curveParam(p: number): number {
  const last = KEYS.length - 1
  if (p <= 0) return 0
  if (p >= 1) return 1
  let i = 0
  while (i < last - 1 && p >= KEYS[i + 1].at) i++
  const local = (p - KEYS[i].at) / (KEYS[i + 1].at - KEYS[i].at)
  const eased = local * 0.5 + smoothstep(0, 1, local) * 0.5
  return (i + eased) / last
}

/** Overall distance multiplier on the keyed path (wider = calmer, more architectural). */
const FRAMING = 1.32
const SMOOTH = 0.28
const OFFSET_SMOOTH = 0.6
const TURNTABLE = { radius: 54, height: 19, speed: 0.05 }

/** Horizontal frame shift so the house sits opposite the copy card (desktop). */
const SIDE_OFFSET = { start: -0.13, end: 0.13, center: 0 } as const

interface RigState {
  position: Vector3
  target: Vector3
  look: Vector3
  ox: number
  oy: number
  snapped: boolean
}

export function CameraRig({ mode, mobile }: { mode: SceneMode; mobile: boolean }) {
  const rig = useRef<RigState | null>(null)

  useFrame(({ camera, size }, delta) => {
    rig.current ??= { position: new Vector3(), target: new Vector3(), look: new Vector3(), ox: 0, oy: 0, snapped: false }
    const state = rig.current
    const cam = camera as PerspectiveCamera
    const { position, target } = state
    let ox = 0
    let oy = 0

    if (mode === 'turntable') {
      const a = sceneState.time * TURNTABLE.speed + 0.6
      target.set(HOUSE_CENTER[0], HOUSE_CENTER[1], HOUSE_CENTER[2])
      position.set(target.x + Math.sin(a) * TURNTABLE.radius, TURNTABLE.height, target.z + Math.cos(a) * TURNTABLE.radius)
    } else {
      const u = mode === 'poster' ? 1 : curveParam(sceneState.p)
      positionCurve.getPoint(u, position)
      targetCurve.getPoint(u, target)
      if (mode === 'story') {
        const side = storyStages[stageIndexAt(sceneState.p)].side
        ox = mobile ? 0 : SIDE_OFFSET[side]
        // Portrait: house in the upper ~55% with the copy below. Finale: lift the house above the copy.
        oy = mobile ? 0.2 : side === 'center' ? 0.12 : 0
      }
    }

    // Narrow / portrait viewports pull the camera back so the whole plot stays in frame.
    const aspect = size.width / Math.max(1, size.height)
    const pullBack = (mode === 'turntable' ? 1 : FRAMING) * (aspect >= 1.25 ? 1 : 1 + (1.25 - aspect) * 1.05)
    position.sub(target).multiplyScalar(pullBack).add(target)

    if (!state.snapped) {
      state.snapped = true
      cam.position.copy(position)
      state.look.copy(target)
      state.ox = ox
      state.oy = oy
    } else {
      easing.damp3(cam.position, position, SMOOTH, delta)
      easing.damp3(state.look, target, SMOOTH, delta)
      easing.damp(state, 'ox', ox, OFFSET_SMOOTH, delta)
      easing.damp(state, 'oy', oy, OFFSET_SMOOTH, delta)
    }
    cam.lookAt(state.look)
    cam.setViewOffset(size.width, size.height, state.ox * size.width, state.oy * size.height, size.width, size.height)
  })

  return null
}
