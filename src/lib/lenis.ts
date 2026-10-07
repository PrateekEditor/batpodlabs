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
 * scroll loops fight each other). A short, gentle duration — this is a
 * simple single-page layout now, not a long scrollytelling piece, so heavy
 * easing just adds lag.
 */
function easeOutQuad(t: number) {
  return 1 - (1 - t) * (1 - t)
}

export function initLenis() {
  if (lenis) return lenis
  lenis = new Lenis({ autoRaf: false, duration: 0.7, easing: easeOutQuad })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)
  // Lenis caches the page height. Moving between pages (or content growing)
  // changes it, which left the scroll stuck short of the bottom — so
  // re-measure whenever the document's size changes.
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(() => lenis?.resize()).observe(document.body)
  }
  return lenis
}
