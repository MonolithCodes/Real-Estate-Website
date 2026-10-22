import { useCallback, useRef } from 'react'
import { stageIndexAt, storyStages } from './storyContent'
import { useStoryFrame } from './useScrollProgress'

/** `?debug=1`: live progress, exit and stage readout for tuning the choreography. */
export function StoryDebug() {
  const ref = useRef<HTMLPreElement>(null)

  useStoryFrame(
    useCallback((progress: number, exit: number) => {
      if (!ref.current) return
      const stage = storyStages[stageIndexAt(progress)]
      ref.current.textContent = `progress ${progress.toFixed(3)}\nexit     ${exit.toFixed(3)}\nstage    ${stage.id} [${stage.window.join(' – ')}]`
    }, []),
  )

  return <pre ref={ref} className="story__debug" aria-hidden="true" />
}
