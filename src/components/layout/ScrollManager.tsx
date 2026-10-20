import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToTarget, scrollToTop } from '../../lib/lenis'

/** On route change: scroll to top (or the hash target) and move focus to <main> for screen readers. */
export function ScrollManager() {
  const { pathname, hash } = useLocation()
  const first = useRef(true)

  useEffect(() => {
    if (hash) {
      scrollToTarget(hash)
    } else {
      scrollToTop()
    }
    if (first.current) {
      first.current = false
      return
    }
    document.getElementById('main')?.focus({ preventScroll: true })
  }, [pathname, hash])

  return null
}
