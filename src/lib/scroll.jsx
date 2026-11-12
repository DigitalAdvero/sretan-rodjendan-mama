import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { createContext, useContext, useEffect, useState } from 'react'

const LenisContext = createContext(null)

/** Gentle inertial scrolling for mouse wheels; touch scrolling stays native. */
export function SmoothScroll({ children }) {
  const [lenis, setLenis] = useState(null)

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const instance = new Lenis({ duration: 1.25, smoothWheel: true, autoRaf: true })
    setLenis(instance)
    return () => {
      instance.destroy()
      setLenis(null)
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}

export const useLenis = () => useContext(LenisContext)

/** Freezes page scrolling while an overlay (gift, lightbox) is open. */
export function useScrollLock(locked) {
  const lenis = useLenis()
  useEffect(() => {
    if (!locked) return undefined
    const html = document.documentElement
    const previous = html.style.overflow
    html.style.overflow = 'hidden'
    lenis?.stop()
    return () => {
      html.style.overflow = previous
      lenis?.start()
    }
  }, [locked, lenis])
}

export function scrollToTarget(lenis, target, options = {}) {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.8, ...options })
    return
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: options.immediate ? 'auto' : 'smooth' })
    return
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target
  el?.scrollIntoView({ behavior: options.immediate ? 'auto' : 'smooth', block: 'start' })
}

export function jumpToTop(lenis) {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
  else window.scrollTo(0, 0)
}
