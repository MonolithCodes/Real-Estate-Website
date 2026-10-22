import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, PerformanceMonitor } from '@react-three/drei'
import { easing } from 'maath'
import { NeutralToneMapping } from 'three'
import type { Group, Material, Mesh } from 'three'
import { getProgress, smoothstep, storyState } from '../components/home/HeroStory/storyRuntime'
import { detectInitialTier, lowerTier, qualitySettings } from '../lib/quality'
import type { QualityTier } from '../lib/quality'
import { CameraRig } from './CameraRig'
import { partProgress } from './house/assembly'
import { partConfig } from './house/assemblyConfig'
import { House } from './house/House'
import { HOUSE_CENTER, PLOT } from './house/layout'
import { tokenCss } from './palette'
import type { SceneMode } from './sceneState'
import { sceneState } from './sceneState'
import { SpecChips } from './SpecChips'
import { SurveyGrid } from './SurveyGrid'
import { TimeOfDay } from './TimeOfDay'

const Effects = lazy(() => import('./Effects').then((m) => ({ default: m.Effects })))

/** Local, small environment map (scripts/generate-env-hdr.mjs). No CDN presets at runtime. */
const ENV_URL = '/env/studio-warm.hdr'
const PROGRESS_SMOOTH = 0.18

/** First in the frame: damps story progress into sceneState for every other component to read. */
function ProgressDriver({ mode }: { mode: SceneMode }) {
  useFrame((_, delta) => {
    sceneState.time += delta
    const target = mode === 'story' ? getProgress() : 1
    const exit = mode === 'story' ? storyState.exit : 0
    if (!sceneState.primed) {
      sceneState.primed = true
      sceneState.p = target
      sceneState.exit = exit
      return
    }
    easing.damp(sceneState, 'p', target, PROGRESS_SMOOTH, delta)
    easing.damp(sceneState, 'exit', exit, PROGRESS_SMOOTH, delta)
  })
  return null
}

/** Soft contact shadows under the house, faded in with the plot. */
function PlotShadows({ resolution }: { resolution: number }) {
  const ref = useRef<Group>(null)
  const color = useMemo(() => tokenCss('--bg-ink'), [])
  useFrame(() => {
    const plot = partProgress(partConfig.plot, sceneState.p)
    const mesh = ref.current?.children.find((c): c is Mesh => (c as Mesh).isMesh)
    if (mesh) (mesh.material as Material).opacity = 0.55 * smoothstep(0.8, 1, plot)
  })
  return (
    <ContactShadows
      ref={ref}
      position={[HOUSE_CENTER[0], 0.01, (PLOT.minZ + PLOT.maxZ) / 2]}
      scale={[PLOT.maxX - PLOT.minX - 2, PLOT.maxZ - PLOT.minZ - 2]}
      far={12}
      blur={2.4}
      opacity={0}
      resolution={resolution}
      color={color}
    />
  )
}

/** Calls `onReady` once two frames have rendered (the poster can then fade out). */
function ReadySignal({ onReady }: { onReady: () => void }) {
  const frames = useRef(0)
  useFrame(() => {
    frames.current += 1
    if (frames.current === 2) onReady()
  })
  return null
}

/** `?poster=1`: after the scene settles, writes a WebP still into the DOM for scripts/capture-poster.mjs. */
function PosterCapture() {
  const frames = useRef(0)
  useFrame(({ gl }) => {
    frames.current += 1
    if (frames.current !== 60) return
    const out = document.createElement('pre')
    out.id = 'poster-data'
    out.hidden = true
    out.textContent = gl.domElement.toDataURL('image/webp', 0.86)
    document.body.append(out)
  })
  return null
}

export interface HouseSceneProps {
  /** Render loop runs only while the story is on screen. */
  active: boolean
  mobile: boolean
  mode: SceneMode
  onReady: () => void
  onFailure: () => void
}

/** The R3F canvas: lights, environment, camera rig, the house and quality tiers. Lazy-loaded. */
export function HouseScene({ active, mobile, mode, onReady, onFailure }: HouseSceneProps) {
  const [tier, setTier] = useState<QualityTier>(() => (mode === 'poster' ? 'medium' : detectInitialTier(mobile)))
  const settings = qualitySettings(tier, mobile)
  const showChips = settings.chips && mode === 'story'

  useEffect(
    () => () => {
      sceneState.primed = false
    },
    [],
  )

  return (
    <Canvas
      className="story__gl"
      dpr={mobile ? [1, 1.5] : [1, 1.75]}
      gl={{ antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: mode === 'poster' }}
      camera={{ fov: 38, near: 0.5, far: 400, position: [26, 16, 34] }}
      frameloop={active ? 'always' : 'never'}
      style={{ pointerEvents: 'none' }}
      onCreated={({ gl }) => {
        gl.toneMapping = NeutralToneMapping
        gl.domElement.addEventListener(
          'webglcontextlost',
          (event) => {
            event.preventDefault()
            onFailure()
          },
          { once: true },
        )
      }}
    >
      {mode === 'story' ? (
        <PerformanceMonitor flipflops={3} onDecline={() => setTier(lowerTier)} onFallback={() => setTier('low')} />
      ) : null}
      <ProgressDriver mode={mode} />
      <TimeOfDay mode={mode} />
      <Suspense fallback={null}>
        <Environment files={ENV_URL} />
      </Suspense>
      <CameraRig mode={mode} mobile={mobile} />
      <SurveyGrid />
      <House key={tier} settings={settings} />
      {settings.shadows ? <PlotShadows resolution={settings.shadowResolution} /> : null}
      {showChips ? <SpecChips /> : null}
      {settings.postprocessing ? (
        <Suspense fallback={null}>
          <Effects />
        </Suspense>
      ) : null}
      <ReadySignal onReady={onReady} />
      {mode === 'poster' ? <PosterCapture /> : null}
    </Canvas>
  )
}
