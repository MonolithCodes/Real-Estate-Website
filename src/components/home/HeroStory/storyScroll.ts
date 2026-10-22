import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onLenisScroll, scrollToY } from '../../../lib/lenis'
import { STORY_SCRUB } from './storyContent'
import { runStoryFrame, storyState } from './storyRuntime'

gsap.registerPlugin(ScrollTrigger)

/**
 * GSAP → mutable state bridge. Loaded on demand so GSAP never blocks the first paint of the hero copy.
 * Pinning itself is CSS `position: sticky` (no pin-spacer reflow); ScrollTrigger only measures and scrubs.
 */
export function startStoryScroll(root: HTMLElement): () => void {
  const ctx = gsap.context(() => {
    const main = gsap.fromTo(
      storyState,
      { progress: 0 },
      {
        progress: 1,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: STORY_SCRUB },
      },
    )

    gsap.fromTo(
      storyState,
      { exit: 0 },
      {
        exit: 1,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'bottom bottom', end: 'bottom top', scrub: 0.4 },
      },
    )

    storyState.scrollToProgress = (progress) => {
      const trigger = main.scrollTrigger
      if (!trigger) return
      scrollToY(trigger.start + (trigger.end - trigger.start) * progress)
    }
  }, root)

  // Lenis moves the window itself; this keeps ScrollTrigger in the same frame as Lenis.
  const offLenis = onLenisScroll(ScrollTrigger.update)
  const tick = () => runStoryFrame()
  gsap.ticker.add(tick)
  runStoryFrame(true)

  return () => {
    gsap.ticker.remove(tick)
    offLenis()
    storyState.scrollToProgress = null
    ctx.revert()
  }
}

/** Re-measure after the pinned length changes (mobile ↔ desktop). */
export const refreshStoryScroll = (): void => ScrollTrigger.refresh()
