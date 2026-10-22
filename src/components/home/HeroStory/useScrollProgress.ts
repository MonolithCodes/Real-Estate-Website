import { useEffect } from 'react'
import type { RefObject } from 'react'
import { addFrameCallback } from './storyRuntime'

/**
 * Wires the pinned section to GSAP ScrollTrigger (scrub) and Lenis. GSAP is imported lazily; until it
 * arrives the hero is in its initial (progress 0) state, which the CSS already renders.
 */
export function useScrollProgress(rootRef: RefObject<HTMLElement | null>, enabled: boolean, lengthVh: number): void {
  useEffect(() => {
    const root = rootRef.current
    if (!enabled || !root) return
    let stop: (() => void) | undefined
    let cancelled = false
    void import('./storyScroll').then(({ startStoryScroll }) => {
      if (!cancelled) stop = startStoryScroll(root)
    })
    return () => {
      cancelled = true
      stop?.()
    }
  }, [rootRef, enabled])

  useEffect(() => {
    if (!enabled) return
    void import('./storyScroll').then(({ refreshStoryScroll }) => refreshStoryScroll())
  }, [enabled, lengthVh])
}

/** Runs `callback(progress, exit)` on every story frame. Write to the DOM through refs here, never to state. */
export function useStoryFrame(callback: (progress: number, exit: number) => void): void {
  useEffect(() => addFrameCallback(callback), [callback])
}
