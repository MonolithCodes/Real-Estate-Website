import { useEffect, useRef } from 'react'
import { startScroll, stopScroll } from '../../lib/lenis'
import { ArrowRightIcon, CloseIcon } from './icons'

interface LightboxProps {
  images: readonly string[]
  index: number
  alt: string
  onClose: () => void
  onChange: (next: number) => void
}

/** Full-screen image viewer: ESC closes, arrow keys navigate, focus returns to the opener. */
export function Lightbox({ images, index, alt, onClose, onChange }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const count = images.length

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    document.documentElement.classList.add('menu-open')
    stopScroll()
    return () => {
      document.documentElement.classList.remove('menu-open')
      startScroll()
      opener?.focus?.()
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') onChange((index + 1) % count)
      else if (e.key === 'ArrowLeft') onChange((index - 1 + count) % count)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, count, onClose, onChange])

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="Image gallery" onClick={onClose}>
      <img
        className="lightbox__img"
        src={images[index]}
        alt={`${alt} — photo ${index + 1} of ${count}`}
        onClick={(e) => e.stopPropagation()}
      />
      <button ref={closeRef} type="button" className="lightbox__btn lightbox__btn--close" aria-label="Close gallery" onClick={onClose}>
        <CloseIcon size={20} />
      </button>
      {count > 1 ? (
        <>
          <button
            type="button"
            className="lightbox__btn lightbox__btn--prev"
            aria-label="Previous photo"
            onClick={(e) => {
              e.stopPropagation()
              onChange((index - 1 + count) % count)
            }}
          >
            <ArrowRightIcon size={20} />
          </button>
          <button
            type="button"
            className="lightbox__btn lightbox__btn--next"
            aria-label="Next photo"
            onClick={(e) => {
              e.stopPropagation()
              onChange((index + 1) % count)
            }}
          >
            <ArrowRightIcon size={20} />
          </button>
        </>
      ) : null}
      <p className="lightbox__caption" aria-live="polite">
        {index + 1} / {count}
      </p>
    </div>
  )
}
