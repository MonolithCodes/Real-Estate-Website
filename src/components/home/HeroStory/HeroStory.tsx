import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, RefObject } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useMediaQuery } from '../../../hooks/useMediaQuery'
import { useReducedMotion } from '../../../hooks/useReducedMotion'
import { hasWebGL } from '../../../lib/webgl'
import { ProgressRail } from './ProgressRail'
import { SceneBoundary } from './SceneBoundary'
import { StageOverlay } from './StageOverlay'
import { StaticStory } from './StaticStory'
import { StoryDebug } from './StoryDebug'
import { luminance, sampleBackground, toCss } from './storyAtmosphere'
import type { Rgb } from './storyAtmosphere'
import { MOBILE_QUERY, POSTER_SRC, STORY_LENGTH_VH, sceneDescription } from './storyContent'
import { smoothstep, storyState } from './storyRuntime'
import { useScrollProgress, useStoryFrame } from './useScrollProgress'
import './heroStory.css'

/** three.js, R3F and the house live in their own chunk, fetched after the hero copy has painted. */
const HouseScene = lazy(() => import('../../../three/HouseScene').then((m) => ({ default: m.HouseScene })))

type SceneStatus = 'loading' | 'ready' | 'failed'

function useInViewport(ref: RefObject<Element | null>): boolean {
  const [inView, setInView] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '25% 0px' })
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])
  return inView
}

/**
 * Home hero: a pinned, scroll-driven 3D house assembly with synchronised HTML copy.
 * Falls back to a stacked static layout for reduced motion and browsers without WebGL.
 */
export function HeroStory() {
  const reduced = useReducedMotion()
  const [webgl] = useState(hasWebGL)
  const [params] = useSearchParams()

  if (reduced || !webgl) return <StaticStory webgl={webgl} />
  // Tuning aids: ?debug=1 shows the readout, ?p=0.45 freezes the story at a progress value.
  const fixed = Number.parseFloat(params.get('p') ?? '')
  return (
    <PinnedStory
      debug={params.get('debug') === '1'}
      poster={params.get('poster') === '1'}
      fixedProgress={Number.isFinite(fixed) ? Math.min(1, Math.max(0, fixed)) : null}
    />
  )
}

interface PinnedStoryProps {
  debug: boolean
  poster: boolean
  fixedProgress: number | null
}

function PinnedStory({ debug, poster, fixedProgress }: PinnedStoryProps) {
  const mobile = useMediaQuery(MOBILE_QUERY)
  const rootRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const seamRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<SceneStatus>('loading')
  const inView = useInViewport(rootRef)
  const lengthVh = mobile ? STORY_LENGTH_VH.mobile : STORY_LENGTH_VH.desktop

  useScrollProgress(rootRef, true, lengthVh)

  useEffect(() => {
    const override = poster ? 1 : fixedProgress
    if (override === null) return
    storyState.override = override
    return () => {
      storyState.override = null
    }
  }, [poster, fixedProgress])

  // Background, dark-scope flip for the rail and the canvas hand-off into the next section.
  const bg = useRef<Rgb>([0, 0, 0])
  const last = useRef({ bg: '', dark: false, canvas: '', seam: '' })
  useStoryFrame(
    useCallback((progress: number, exit: number) => {
      const root = rootRef.current
      if (!root) return
      const color = sampleBackground(progress, exit, bg.current)
      const css = toCss(color)
      if (css !== last.current.bg) {
        last.current.bg = css
        root.style.setProperty('--story-bg', css)
      }
      const dark = luminance(color) < 0.35
      if (dark !== last.current.dark) {
        last.current.dark = dark
        railRef.current?.classList.toggle('theme-dark', dark)
      }
      // Hand-off: an ivory seam rises from the bottom just before the pin releases, so the dusk stage
      // never meets the ivory section below on a hard edge; then the canvas and rail fade away.
      const seam = `${smoothstep(0.985, 1, progress).toFixed(3)}|${(1 - smoothstep(0, 0.2, exit)).toFixed(3)}`
      if (seam !== last.current.seam) {
        last.current.seam = seam
        const [seamOpacity, railOpacity] = seam.split('|')
        seamRef.current?.style.setProperty('opacity', seamOpacity)
        railRef.current?.style.setProperty('opacity', railOpacity)
      }
      const fade = smoothstep(0.05, 0.55, exit)
      const canvas = `${(1 - fade).toFixed(3)}|${(1 - 0.05 * smoothstep(0, 1, exit)).toFixed(4)}`
      if (canvas !== last.current.canvas && canvasRef.current) {
        last.current.canvas = canvas
        const [opacity, scale] = canvas.split('|')
        canvasRef.current.style.opacity = opacity
        canvasRef.current.style.transform = `scale(${scale})`
      }
    }, []),
  )

  const onReady = useCallback(() => setStatus('ready'), [])
  const onFailure = useCallback(() => setStatus('failed'), [])

  return (
    <section
      ref={rootRef}
      className="story"
      style={{ '--story-length': lengthVh } as CSSProperties}
      aria-labelledby="story-title"
      data-poster={poster ? 'true' : undefined}
      data-testid="home-hero"
    >
      <div className="story__stage">
        <div ref={canvasRef} className="story__canvas" aria-hidden="true">
          {poster ? null : (
            <img
              className="story__poster"
              data-hidden={status === 'ready' ? 'true' : 'false'}
              src={POSTER_SRC}
              alt=""
              width={1600}
              height={1000}
              fetchPriority="high"
              decoding="async"
            />
          )}
          {status === 'failed' ? null : (
            <SceneBoundary onError={onFailure}>
              <Suspense fallback={null}>
                <HouseScene
                  active={inView}
                  mobile={mobile}
                  mode={poster ? 'poster' : 'story'}
                  onReady={onReady}
                  onFailure={onFailure}
                />
              </Suspense>
            </SceneBoundary>
          )}
        </div>
        <div ref={seamRef} className="story__seam" aria-hidden="true" />
        <p className="visually-hidden">{sceneDescription}</p>
        <StageOverlay />
        <div ref={railRef} className="story__rail-wrap">
          <ProgressRail />
        </div>
        {debug ? <StoryDebug /> : null}
      </div>
    </section>
  )
}
