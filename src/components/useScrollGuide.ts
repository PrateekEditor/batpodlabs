import { useEffect, useRef, useState, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getLenis } from '../lib/lenis'

/**
 * Stakyn as a tour guide, one stop per section (not per card or button).
 *
 * A section opts in with `data-tour="what to say about it"`; an element
 * inside it marked `data-guide` is its main action, and `data-tour-cta`
 * on the section labels the button that takes you there (`data-tour-chat`
 * makes that button open the chat instead).
 *
 * GSAP ScrollTrigger reports which section is in view, so nothing is
 * measured while you scroll.
 *  - Phone: Stakyn stays in its corner (no movement while scrolling, so no
 *    jitter), hops when a new section comes up and pops a chat bubble.
 *  - PC: it jumps next to the section's heading, rides along with it, and
 *    pops the same bubble. It goes back to the corner after a few seconds
 *    without scrolling, while the mouse is held down, or when the cursor
 *    comes close.
 * Each section's bubble shows once per visit to the page.
 */

const ORB = 56
const R = ORB / 2
const GAP = 18
const IDLE_MS = 6500
const TOP_SAFE = 120 // below the fixed header
const BUBBLE_MS = 6500

type Pos = { x: number; y: number }
export type TourBubble = { id: number; text: string; cta?: string; below: boolean }

const margin = () => (window.innerWidth >= 640 ? 24 : 16)
const isPhone = () => window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches
const dockCentre = (): Pos => {
  const m = margin()
  return { x: document.documentElement.clientWidth - m - R, y: window.innerHeight - m - R }
}
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

/** Page position (not screen position) for the orb's centre: just right of the section heading's text. */
function perchFor(section: HTMLElement): Pos {
  const h = section.querySelector<HTMLElement>('h1, h2') ?? section
  const range = document.createRange()
  range.selectNodeContents(h)
  const r = range.getBoundingClientRect()
  const W = document.documentElement.clientWidth
  const m = margin()
  const x = clamp(r.right + GAP + R, m + R, W - m - R)
  return { x, y: r.top + r.height / 2 + window.scrollY }
}

export function useScrollGuide({
  enabled,
  path,
  wrap,
  hop,
  eyes,
}: {
  enabled: boolean
  /** re-scan the page's sections when this changes */
  path: string
  /** element that carries the guide offset */
  wrap: RefObject<HTMLElement | null>
  /** inner element for the jump between stops */
  hop: RefObject<HTMLElement | null>
  /** the logo's eyes group */
  eyes: RefObject<SVGGElement | null>
}) {
  const [bubble, setBubble] = useState<TourBubble | null>(null)
  const [guiding, setGuiding] = useState(false)
  const ctaTarget = useRef<HTMLElement | null>(null)
  const ctaChat = useRef(false)
  const hideBubble = useRef<() => void>(() => {})
  const holdBubble = useRef<(on: boolean) => void>(() => {})

  useEffect(() => {
    const el = wrap.current
    if (!el || !enabled) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const phone = isPhone()
    let active: HTMLElement | null = null
    let perch: Pos | null = null // page coordinates on PC
    let parked = true
    let lastScroll = Date.now()
    let holding = false
    let near = false
    let bubbleTimer = 0
    let bubbleHeld = false
    let nextId = 1
    const seen = new WeakSet<HTMLElement>()

    const orbNow = (): Pos => {
      const r = el.getBoundingClientRect()
      return { x: r.left + R, y: r.top + R }
    }
    const look = (at: Pos | null) => {
      const e = eyes.current
      if (!e) return
      if (!at) {
        e.style.transform = ''
        return
      }
      const o = orbNow()
      const dx = at.x - o.x
      const dy = at.y - o.y
      const d = Math.hypot(dx, dy) || 1
      const k = Math.min(1, d / 120)
      e.style.transform = `translate(${((dx / d) * k * 48).toFixed(1)}px, ${((dy / d) * k * 15).toFixed(1)}px)`
    }

    /** Where the wrapper's offset should be right now, from the perch (PC) or the corner. */
    const offsetNow = (): Pos => {
      if (phone || parked || !perch) return { x: 0, y: 0 }
      const dock = dockCentre()
      const m = margin()
      const y = clamp(perch.y - window.scrollY, TOP_SAFE + R, window.innerHeight - m - R)
      return { x: perch.x - dock.x, y: y - dock.y }
    }
    const place = () => {
      const o = offsetNow()
      gsap.set(el, { x: o.x, y: o.y })
    }
    /** Move to the current target with a little arc, so it reads as a jump. */
    const jump = () => {
      const from = orbNow()
      place()
      const to = orbNow()
      const inner = hop.current
      if (!inner) return
      const dx = from.x - to.x
      const dy = from.y - to.y
      gsap.killTweensOf(inner)
      // keep it visually where it was, then glide the rest of the way
      const ix = Number(gsap.getProperty(inner, 'x')) || 0
      const iy = Number(gsap.getProperty(inner, 'y')) || 0
      if (Math.hypot(dx, dy) < 4) {
        gsap.set(inner, { x: 0, y: 0 })
        // same spot (phones): a hop on the spot
        gsap.fromTo(inner, { y: 0 }, { y: -24, duration: 0.2, ease: 'power2.out', yoyo: true, repeat: 1 })
        return
      }
      const sx = ix + dx
      const sy = iy + dy
      gsap.set(inner, { x: sx, y: sy })
      gsap.to(inner, { x: 0, duration: 0.6, ease: 'power2.inOut' })
      gsap.to(inner, {
        keyframes: [
          { y: sy / 2 - 46, duration: 0.3, ease: 'power2.out' },
          { y: 0, duration: 0.3, ease: 'power2.in' },
        ],
      })
    }

    const closeBubble = () => {
      window.clearTimeout(bubbleTimer)
      setBubble(null)
    }
    hideBubble.current = closeBubble
    holdBubble.current = (on: boolean) => {
      bubbleHeld = on
      window.clearTimeout(bubbleTimer)
      if (!on) bubbleTimer = window.setTimeout(closeBubble, 2500)
    }
    const showBubble = (section: HTMLElement) => {
      // a section already introduced: just clear the last section's bubble
      if (seen.has(section)) return closeBubble()
      seen.add(section)
      const text = section.dataset.tour
      if (!text) return
      const target = section.querySelector<HTMLElement>('[data-guide]')
      ctaTarget.current = target
      ctaChat.current = section.hasAttribute('data-tour-chat')
      const below = !phone && orbNow().y < TOP_SAFE + 140
      setBubble({ id: nextId++, text, cta: target || ctaChat.current ? section.dataset.tourCta || 'Show me' : undefined, below })
      window.clearTimeout(bubbleTimer)
      bubbleTimer = window.setTimeout(() => {
        if (!bubbleHeld) closeBubble()
      }, BUBBLE_MS)
    }

    const park = (yes: boolean) => {
      if (parked === yes) return
      parked = yes
      setGuiding(!yes)
      if (yes) closeBubble()
      jump()
    }

    const activate = (section: HTMLElement) => {
      if (active === section) return
      active = section
      perch = phone ? null : perchFor(section)
      near = false
      if (holding) return
      if (parked && !phone) {
        parked = false
        setGuiding(true)
      }
      if (phone) setGuiding(true)
      jump()
      const h = section.querySelector('h1, h2')?.getBoundingClientRect()
      look(h ? { x: h.left + h.width / 2, y: h.top + h.height / 2 } : null)
      showBubble(section)
    }

    // one ScrollTrigger per section: it tells us when the section is the one in view
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-tour]'))
    const triggers = sections.map((s) =>
      ScrollTrigger.create({
        trigger: s,
        start: 'top 62%',
        end: 'bottom 38%',
        onToggle: (self) => {
          if (self.isActive) activate(s)
        },
      }),
    )

    // PC only: ride along with the page between stops (one transform per frame, no measuring)
    const onScroll = () => {
      lastScroll = Date.now()
      if (phone) return
      if (near) {
        near = false
      }
      if (parked && active && !holding) {
        parked = false
        setGuiding(true)
        jump()
        return
      }
      place()
    }
    const lenis = getLenis()
    if (!phone) {
      if (lenis) lenis.on('scroll', onScroll)
      else window.addEventListener('scroll', onScroll, { passive: true })
    }

    const onResize = () => {
      if (active && !phone) perch = perchFor(active)
      place()
    }
    window.addEventListener('resize', onResize)

    const onDown = (e: PointerEvent) => {
      if (phone || e.pointerType !== 'mouse') return
      if ((e.target as Element).closest('[data-tour-bubble]')) return
      holding = true
      park(true)
    }
    const onUp = () => {
      if (!holding) return
      holding = false
      lastScroll = Date.now()
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      if (parked) {
        look({ x: e.clientX, y: e.clientY })
        return
      }
      if ((e.target as Element).closest('[data-tour-bubble]')) return
      const o = orbNow()
      if (Math.hypot(e.clientX - o.x, e.clientY - o.y) < 90) {
        near = true
        park(true)
      }
    }
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    window.addEventListener('pointermove', onMove, { passive: true })

    // PC: back to the corner when the visitor stops scrolling for a while
    const tick = window.setInterval(() => {
      if (!phone && !parked && !bubbleHeld && Date.now() - lastScroll > IDLE_MS) park(true)
    }, 1000)

    // the page just rendered: measure once it has settled
    const settle = window.setTimeout(() => ScrollTrigger.refresh(), 400)

    return () => {
      triggers.forEach((t) => t.kill())
      if (lenis) lenis.off('scroll', onScroll)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      window.removeEventListener('pointermove', onMove)
      window.clearInterval(tick)
      window.clearTimeout(settle)
      window.clearTimeout(bubbleTimer)
      if (hop.current) gsap.killTweensOf(hop.current)
      gsap.set(el, { x: 0, y: 0 })
      if (hop.current) gsap.set(hop.current, { x: 0, y: 0 })
      look(null)
      setBubble(null)
      setGuiding(false)
    }
  }, [enabled, path, wrap, hop, eyes])

  /** The bubble's button: take the visitor to the section's main action. */
  const goToAction = () => {
    const t = ctaTarget.current
    hideBubble.current()
    if (ctaChat.current) {
      window.dispatchEvent(new Event('bot:open'))
      return
    }
    if (!t) return
    if (t.hasAttribute('data-tour-click')) {
      t.click()
      return
    }
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(t, { offset: -window.innerHeight * 0.35 })
    else t.scrollIntoView({ behavior: 'smooth', block: 'center' })
    window.setTimeout(() => {
      t.classList.remove('tour-pulse')
      void t.offsetWidth
      t.classList.add('tour-pulse')
      if (t instanceof HTMLInputElement) t.focus({ preventScroll: true })
    }, 650)
  }

  return {
    bubble: enabled ? bubble : null,
    guiding: enabled && guiding,
    goToAction,
    closeBubble: () => hideBubble.current(),
    holdBubble: (on: boolean) => holdBubble.current(on),
  }
}
