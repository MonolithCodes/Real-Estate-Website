import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color, Fog, SRGBColorSpace } from 'three'
import type { DirectionalLight, HemisphereLight, MeshStandardMaterial } from 'three'
import { DAYLIGHT_PROGRESS, exitBlend, sampleBackground } from '../components/home/HeroStory/storyAtmosphere'
import type { Rgb } from '../components/home/HeroStory/storyAtmosphere'
import { smoothstep } from '../components/home/HeroStory/storyRuntime'
import { tokenColor } from './palette'
import type { SceneMode } from './sceneState'
import { roleMaterials, sceneState } from './sceneState'

interface LightKey {
  at: number
  sun: string
  intensity: number
  position: readonly [number, number, number]
  hemi: number
  env: number
  /** 0 = day, 1 = dusk (window and path lights fully on). */
  night: number
}

/** Cool morning → bright noon → golden hour → dusk. Colours are tokens (tokens.css `--scene-sun-*`). */
const KEYS: readonly LightKey[] = [
  { at: 0, sun: '--scene-sun-morning', intensity: 1.25, position: [-25, 30, 30], hemi: 0.5, env: 0.42, night: 0 },
  { at: 0.2, sun: '--scene-sun-morning', intensity: 1.35, position: [-20, 28, 25], hemi: 0.48, env: 0.42, night: 0 },
  { at: 0.5, sun: '--scene-sun-noon', intensity: 1.7, position: [8, 45, 22], hemi: 0.5, env: 0.5, night: 0 },
  { at: 0.8, sun: '--scene-sun-noon', intensity: 1.6, position: [22, 30, 18], hemi: 0.45, env: 0.45, night: 0 },
  { at: 0.88, sun: '--scene-sun-golden', intensity: 1.55, position: [35, 12, 14], hemi: 0.32, env: 0.32, night: 0.15 },
  { at: 0.95, sun: '--scene-sun-dusk', intensity: 0.35, position: [40, 5, 6], hemi: 0.14, env: 0.12, night: 1 },
]

interface LightSample {
  sun: Color
  intensity: number
  position: [number, number, number]
  hemi: number
  env: number
  night: number
}

const createSample = (): LightSample => ({ sun: new Color(), intensity: 0, position: [0, 0, 0], hemi: 0, env: 0, night: 0 })
const scratch = { a: new Color(), b: new Color() }

function sampleLight(p: number, out: LightSample): LightSample {
  let i = 0
  while (i < KEYS.length - 2 && p > KEYS[i + 1].at) i++
  const a = KEYS[i]
  const b = KEYS[i + 1]
  const t = p <= a.at ? 0 : p >= b.at ? 1 : smoothstep(a.at, b.at, p)
  out.sun.copy(tokenColor(a.sun, scratch.a)).lerp(tokenColor(b.sun, scratch.b), t)
  out.intensity = a.intensity + (b.intensity - a.intensity) * t
  for (let k = 0; k < 3; k++) out.position[k] = a.position[k] + (b.position[k] - a.position[k]) * t
  out.hemi = a.hemi + (b.hemi - a.hemi) * t
  out.env = a.env + (b.env - a.env) * t
  out.night = a.night + (b.night - a.night) * t
  return out
}

function mixSample(a: LightSample, b: LightSample, t: number, out: LightSample): LightSample {
  out.sun.copy(a.sun).lerp(b.sun, t)
  out.intensity = a.intensity + (b.intensity - a.intensity) * t
  for (let k = 0; k < 3; k++) out.position[k] = a.position[k] + (b.position[k] - a.position[k]) * t
  out.hemi = a.hemi + (b.hemi - a.hemi) * t
  out.env = a.env + (b.env - a.env) * t
  out.night = a.night + (b.night - a.night) * t
  return out
}

const createWork = () => ({
  story: createSample(),
  day: createSample(),
  out: createSample(),
  bg: [0, 0, 0] as Rgb,
  background: new Color(),
  fog: new Fog(new Color(), 70, 170),
  ground: tokenColor('--scene-hemi-ground'),
})

/** Interpolates sun, sky, fog, environment and the dusk glow across progress. */
export function TimeOfDay({ mode }: { mode: SceneMode }) {
  const sun = useRef<DirectionalLight>(null)
  const hemi = useRef<HemisphereLight>(null)
  const scratchRef = useRef<ReturnType<typeof createWork> | null>(null)

  useFrame(({ scene }) => {
    scratchRef.current ??= createWork()
    const work = scratchRef.current
    const p = mode === 'story' ? sceneState.p : DAYLIGHT_PROGRESS
    const exit = mode === 'story' ? sceneState.exit : 0
    const blend = exitBlend(exit)
    const light = blend > 0 ? mixSample(sampleLight(p, work.story), sampleLight(DAYLIGHT_PROGRESS, work.day), blend, work.out) : sampleLight(p, work.out)

    const [r, g, b] = sampleBackground(p, exit, work.bg)
    work.background.setRGB(r, g, b, SRGBColorSpace)
    scene.background = work.background
    work.fog.color.copy(work.background)
    scene.fog = work.fog
    scene.environmentIntensity = light.env

    if (sun.current) {
      sun.current.color.copy(light.sun)
      sun.current.intensity = light.intensity
      sun.current.position.set(light.position[0], light.position[1], light.position[2])
    }
    if (hemi.current) {
      hemi.current.color.copy(work.background)
      hemi.current.groundColor.copy(work.ground)
      hemi.current.intensity = light.hemi
    }

    const night = light.night
    roleMaterials.glass.forEach((m) => {
      const glass = m as MeshStandardMaterial
      glass.emissiveIntensity = 1.4 * night
      glass.userData.baseOpacity = 0.25 + 0.55 * night
    })
    roleMaterials.glow.forEach((m) => ((m as MeshStandardMaterial).emissiveIntensity = 0.15 + 2.6 * night))
    roleMaterials.poolGlow.forEach((m) => ((m as MeshStandardMaterial).emissiveIntensity = 0.25 + 1.3 * night))
  })

  return (
    <>
      <directionalLight ref={sun} />
      <hemisphereLight ref={hemi} />
    </>
  )
}
