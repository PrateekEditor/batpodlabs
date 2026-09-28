import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

/** Returns the shared Lenis instance, or null before initLenis() has run. */
export function getLenis() {
  return lenis
}

/**
 * Creates the shared smooth-scroll instance and wires it into GSAP's ticker,
 * as recommended when pairing Lenis with ScrollTrigger (otherwise the two
 * scroll loops fight each other).
 */
export function initLenis() {
  if (lenis) return lenis
  lenis = new Lenis({ autoRaf: false })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)
  return lenis
}
