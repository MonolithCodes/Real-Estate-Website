import { useEffect } from 'react'
import { createLenis, destroyLenis } from '../lib/lenis'
import { useReducedMotion } from './useReducedMotion'

/** Starts Lenis smooth scrolling for the app lifetime. Disabled for reduced motion. */
export function useLenis(): void {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const lenis = createLenis()
    let frame = requestAnimationFrame(function loop(time) {
      lenis.raf(time)
      frame = requestAnimationFrame(loop)
    })
    return () => {
      cancelAnimationFrame(frame)
      destroyLenis()
    }
  }, [reduced])
}
