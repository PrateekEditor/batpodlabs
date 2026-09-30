import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const THEMES = {
  cream: { bg: '#f2e9d8', text: '#1c1a16' },
  navy: { bg: '#0d1640', text: '#eaf3ff' },
} as const

/**
 * Crossfades a fixed backdrop div's background color as the user scrolls
 * past each `[data-theme="cream"|"navy"]` section, so the whole page reads
 * as one continuous scroll instead of hard-cut section backgrounds.
 */
export function useSectionTheme(backdropId: string) {
  useEffect(() => {
    const backdrop = document.getElementById(backdropId)
    if (!backdrop) return

    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-theme]'))
    const triggers = sections.map((el) => {
      const theme = THEMES[el.dataset.theme as keyof typeof THEMES]
      if (!theme) return null
      const apply = () => gsap.to(backdrop, { backgroundColor: theme.bg, duration: 0.6, ease: 'power1.out' })
      return ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onEnter: apply,
        onEnterBack: apply,
      })
    })

    return () => {
      triggers.forEach((t) => t?.kill())
    }
  }, [backdropId])
}
