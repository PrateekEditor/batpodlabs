import { useEffect, useRef } from 'react'

/**
 * Lightweight scroll-reveal: adds `.is-visible` to the ref'd element the
 * first time it enters the viewport. Plain IntersectionObserver — no GSAP
 * needed for a simple fade/slide-in, keeps this off the animation budget
 * used by the character's idle motion.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}
