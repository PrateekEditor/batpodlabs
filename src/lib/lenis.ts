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
// easeInOutCubic — a smooth accelerate/decelerate curve in the same spirit
// as anime.js's power/inOut family (https://animejs.com/easing-editor/power/inout),
// used here instead of Lenis's slower default easeOutExpo-style curve.
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function initLenis() {
  if (lenis) return lenis
  lenis = new Lenis({ autoRaf: false, duration: 0.9, easing: easeInOutCubic })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)
  return lenis
}
