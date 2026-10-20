import Lenis from 'lenis'

let instance: Lenis | null = null

const HEADER_OFFSET = -96

export function createLenis(): Lenis {
  instance?.destroy()
  instance = new Lenis({ lerp: 0.1, smoothWheel: true })
  return instance
}

export function destroyLenis(): void {
  instance?.destroy()
  instance = null
}

export function stopScroll(): void {
  instance?.stop()
}

export function startScroll(): void {
  instance?.start()
}

export function scrollToTop(): void {
  if (instance) instance.scrollTo(0, { immediate: true, force: true })
  else window.scrollTo(0, 0)
}

export function scrollToTarget(target: string | HTMLElement): void {
  if (instance) instance.scrollTo(target, { offset: HEADER_OFFSET })
  else {
    const el = typeof target === 'string' ? document.querySelector(target) : target
    el?.scrollIntoView()
  }
}
