import { useEffect } from 'react'
import { initLenis } from './lenis'

/** Initializes the shared Lenis + GSAP ScrollTrigger wiring once, app-wide. */
export function useLenis() {
  useEffect(() => {
    initLenis()
  }, [])
}
