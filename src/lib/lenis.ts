import type Lenis from 'lenis'

let lenisInstance: Lenis | null = null

/** Called once by useLenis() when it creates/destroys the singleton scroller. */
export function setLenisInstance(instance: Lenis | null) {
  lenisInstance = instance
}

/** Smooth-scrolls to a section by DOM id. Falls back to native smooth scroll if Lenis isn't ready yet. */
export function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenisInstance) {
    lenisInstance.scrollTo(el, { offset: 0, duration: 1.4 })
  } else {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
