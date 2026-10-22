import { useCallback, useRef } from 'react'
import { StageCopy } from './StageCopy'
import { storyStages } from './storyContent'
import type { StoryStage } from './storyContent'
import { smoothstep, storyState } from './storyRuntime'
import { useStoryFrame } from './useScrollProgress'

const TRAVEL_PX = 48
const FADE_SHARE = 0.2

/** Copy visibility for a stage at `progress`: 0..1 in, 0..1 out (both 1 while fully on screen). */
function stageFade(stage: StoryStage, index: number, progress: number, exit: number): { fadeIn: number; fadeOut: number } {
  const [a, b] = stage.window
  const span = b - a
  const isFirst = index === 0
  const isLast = index === storyStages.length - 1
  const fadeIn = isFirst ? 1 : smoothstep(a, a + span * FADE_SHARE, progress)
  const fadeOut = isLast ? 1 - smoothstep(0, 0.35, exit) : 1 - smoothstep(b - span * (isFirst ? 0.55 : FADE_SHARE), b, progress)
  return { fadeIn, fadeOut }
}

/** Per-stage copy cards. They enter from below and leave upwards, tied to each stage's scroll window. */
export function StageOverlay() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const cueRef = useRef<HTMLParagraphElement>(null)
  const lastStyle = useRef<string[]>([])

  useStoryFrame(
    useCallback((progress: number, exit: number) => {
      storyStages.forEach((stage, i) => {
        const el = cardRefs.current[i]
        if (!el) return
        const { fadeIn, fadeOut } = stageFade(stage, i, progress, exit)
        const opacity = Math.min(fadeIn, fadeOut)
        const y = (1 - fadeIn) * TRAVEL_PX - (1 - fadeOut) * TRAVEL_PX
        const key = `${opacity.toFixed(3)}|${y.toFixed(1)}`
        if (lastStyle.current[i] === key) return
        lastStyle.current[i] = key
        el.style.opacity = opacity.toFixed(3)
        el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`
        el.dataset.active = opacity > 0.5 ? 'true' : 'false'
      })
      cueRef.current?.style.setProperty('opacity', (1 - smoothstep(0.002, 0.02, progress)).toFixed(3))
    }, []),
  )

  // Keyboard users tabbing into a card that is scrolled out of view: bring its stage on screen.
  const onFocusCard = (stage: StoryStage, index: number) => {
    if (cardRefs.current[index]?.dataset.active === 'true') return
    const [a, b] = stage.window
    storyState.scrollToProgress?.(index === 0 ? 0 : a + (Math.min(b, 1) - a) * 0.4)
  }

  return (
    <div className="story__overlay">
      {storyStages.map((stage, i) => (
        <div
          key={stage.id}
          ref={(el) => {
            cardRefs.current[i] = el
          }}
          className={`story__card story__card--${stage.id}${stage.id === 'reveal' ? ' theme-dark' : ''}`}
          data-side={stage.side}
          data-active={i === 0 ? 'true' : 'false'}
          onFocus={() => onFocusCard(stage, i)}
        >
          <StageCopy stage={stage} />
        </div>
      ))}
      <p ref={cueRef} className="story__cue" aria-hidden="true">
        <span>Scroll to build</span>
        <span className="story__cue-line" />
      </p>
    </div>
  )
}
