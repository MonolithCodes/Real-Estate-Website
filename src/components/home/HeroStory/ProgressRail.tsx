import { useCallback, useRef } from 'react'
import { railStages, stageIndexAt, storyStages } from './storyContent'
import { storyState } from './storyRuntime'
import { useStoryFrame } from './useScrollProgress'

/** Vertical progress rail: six stage labels, current stage in gold, click to travel to a stage. */
export function ProgressRail() {
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const fillRef = useRef<HTMLSpanElement>(null)
  const lastIndex = useRef(-2)

  useStoryFrame(
    useCallback((progress: number) => {
      const first = railStages[0].window[0]
      const last = railStages[railStages.length - 1].window[1]
      const fill = Math.min(1, Math.max(0, (progress - first) / (last - first)))
      fillRef.current?.style.setProperty('transform', `scaleY(${fill.toFixed(4)})`)

      const current = storyStages[stageIndexAt(progress)]
      const index = railStages.findIndex((stage) => stage.id === current.id)
      if (index === lastIndex.current) return
      lastIndex.current = index
      itemRefs.current.forEach((el, i) => {
        if (!el) return
        if (i === index) el.setAttribute('aria-current', 'step')
        else el.removeAttribute('aria-current')
      })
    }, []),
  )

  return (
    <nav className="story__rail" aria-label="House story stages">
      <span className="story__rail-track" aria-hidden="true">
        <span ref={fillRef} className="story__rail-fill" />
      </span>
      <ol>
        {railStages.map((stage, i) => (
          <li key={stage.id}>
            <button
              type="button"
              ref={(el) => {
                itemRefs.current[i] = el
              }}
              className="story__rail-item"
              onClick={() => storyState.scrollToProgress?.(stage.window[0] + 0.02)}
            >
              <span className="story__rail-dot" aria-hidden="true" />
              <span className="story__rail-label">{stage.rail}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  )
}
