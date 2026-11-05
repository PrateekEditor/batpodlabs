import { useEffect, useRef, useState, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Stakyn as a tour guide. Any element with `data-guide="Short tip"` is a
 * stop. As the page scrolls (GSAP ScrollTrigger, fed by Lenis), the orb
 * leaves its corner and glides next to the stop nearest the middle of the
 * screen, looks at it and shows the tip. On phones it rides the right edge
 * and hops to the stop of the section in view.
 *
 * It goes back to the corner and waits when it would get in the way:
 * the visitor stops scrolling for a while, holds the mouse or finger down,
 * moves the cursor close to it, or nothing on screen is a stop.
 */

const ORB = 56
const R = ORB / 2
const GAP = 16
const IDLE_MS = 6500
const TOP_SAFE = 120 // below the fixed header

type Pos = { x: number; y: number }

const margin = () => (window.innerWidth >= 640 ? 24 : 16)
const isPhone = () => window.innerWidth < 768
const dockCentre = (): Pos => {
  const m = margin()
  return { x: document.documentElement.clientWidth - m - R, y: window.innerHeight - m - R }
}
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

function visibleStops() {
  const h = window.innerHeight
  return Array.from(document.querySelectorAll<HTMLElement>('[data-guide]')).filter((el) => {
    const r = el.getBoundingClientRect()
    if (!r.width || !r.height) return false
    return r.top > TOP_SAFE - 10 && r.bottom < h - 40
  })
}

/** True when an orb centred here would sit on top of another button, link or field. */
function blocked(p: Pos, self: Element | null) {
  const pts: [number, number][] = [
    [p.x, p.y],
    [p.x - R + 4, p.y - R + 4],
    [p.x + R - 4, p.y - R + 4],
    [p.x - R + 4, p.y + R - 4],
    [p.x + R - 4, p.y + R - 4],
  ]
  return pts.some(([x, y]) =>
    document.elementsFromPoint(x, y).some((el) => !(self && self.contains(el)) && !!el.closest('a, button, input, select, textarea, [role="button"]')),
  )
}

/** Where the orb's centre goes for a stop: the first free spot around it. */
function spotFor(el: HTMLElement, self: Element | null): Pos {
  const r = el.getBoundingClientRect()
  const W = document.documentElement.clientWidth
  const H = window.innerHeight
  const m = margin()
  const minY = TOP_SAFE + R
  const maxY = H - m - R
  const fit = (p: Pos): Pos => ({ x: clamp(p.x, m + R, W - m - R), y: clamp(p.y, minY, maxY) })
  const cy = r.top + r.height / 2
  const candidates: Pos[] = isPhone()
    ? [
        // ride the right edge, just above or below the stop so it stays tappable
        { x: W - m - R, y: r.top - R - 8 },
        { x: W - m - R, y: r.bottom + R + 8 },
        { x: W - m - R, y: cy },
      ]
    : [
        { x: r.right + GAP + R, y: cy },
        { x: r.left - GAP - R, y: cy },
        { x: r.right - R, y: r.top - GAP - R },
        { x: r.right - R, y: r.bottom + GAP + R },
      ]
  const inView = candidates.map(fit).filter((p, i) => Math.abs(p.x - candidates[i].x) < 1 && Math.abs(p.y - candidates[i].y) < 1)
  return inView.find((p) => !blocked(p, self)) ?? fit(candidates[0])
}

export function useScrollGuide({
  enabled,
  wrap,
  hop,
  eyes,
}: {
  enabled: boolean
  /** element that carries the guide offset */
  wrap: RefObject<HTMLElement | null>
  /** inner element for the phone hop */
  hop: RefObject<HTMLElement | null>
  /** the logo's eyes group */
  eyes: RefObject<SVGGElement | null>
}) {
  const [tip, setTip] = useState<string | null>(null)
  const [guiding, setGuiding] = useState(false)
  const active = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const toX = gsap.quickTo(el, 'x', { duration: 0.55, ease: 'power3.out' })
    const toY = gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3.out' })

    let lastScroll = Date.now()
    let holding = false
    let near = false
    let cursor: Pos | null = null
    let tipTimer = 0
    let raf = 0

    const look = (at: Pos | null) => {
      const e = eyes.current
      if (!e) return
      if (!at) {
        e.style.transform = ''
        return
      }
      const orb = el.getBoundingClientRect()
      const dx = at.x - (orb.left + R)
      const dy = at.y - (orb.top + R)
      const d = Math.hypot(dx, dy) || 1
      const k = Math.min(1, d / 120)
      e.style.transform = `translate(${((dx / d) * k * 48).toFixed(1)}px, ${((dy / d) * k * 15).toFixed(1)}px)`
    }

    const park = () => {
      if (active.current) {
        active.current = null
        setGuiding(false)
        setTip(null)
      }
      toX(0)
      toY(0)
      look(cursor)
    }

    const update = () => {
      raf = 0
      if (!enabled || reduce) return park()
      const idle = Date.now() - lastScroll > IDLE_MS
      if (holding || near || idle) return park()

      const stops = visibleStops()
      if (!stops.length) return park()
      // the stop closest to 45% down the screen
      const focus = window.innerHeight * 0.45
      const pick = stops.reduce((best, s) => {
        const r = s.getBoundingClientRect()
        const d = Math.abs(r.top + r.height / 2 - focus)
        const rb = best.getBoundingClientRect()
        return d < Math.abs(rb.top + rb.height / 2 - focus) ? s : best
      })

      const spot = spotFor(pick, el)
      const dock = dockCentre()
      toX(spot.x - dock.x)
      toY(spot.y - dock.y)

      const r = pick.getBoundingClientRect()
      look({ x: r.left + r.width / 2, y: r.top + r.height / 2 })

      if (active.current !== pick) {
        active.current = pick
        setGuiding(true)
        setTip(pick.dataset.guide || null)
        window.clearTimeout(tipTimer)
        tipTimer = window.setTimeout(() => setTip(null), 3800)
        if (isPhone() && hop.current) {
          gsap.fromTo(hop.current, { y: 0 }, { y: -22, duration: 0.18, ease: 'power2.out', yoyo: true, repeat: 1 })
        }
      }
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    const onScroll = () => {
      lastScroll = Date.now()
      near = false
      schedule()
    }
    const st = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: onScroll })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', schedule)

    const onDown = () => {
      holding = true
      schedule()
    }
    const onUp = () => {
      holding = false
      lastScroll = Date.now()
      schedule()
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      cursor = { x: e.clientX, y: e.clientY }
      // the cursor came up to it: back off to the corner until the next scroll
      if (active.current && !near) {
        const orb = el.getBoundingClientRect()
        if (Math.hypot(e.clientX - (orb.left + R), e.clientY - (orb.top + R)) < 110) {
          near = true
          schedule()
          return
        }
      }
      if (!active.current) look(cursor)
    }
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    window.addEventListener('pointermove', onMove, { passive: true })

    // wake up a moment after the page appears, and re-check for idling
    const first = window.setTimeout(() => {
      lastScroll = Date.now()
      schedule()
    }, 900)
    const tick = window.setInterval(schedule, 1000)

    return () => {
      st.kill()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      window.removeEventListener('pointermove', onMove)
      window.clearTimeout(first)
      window.clearTimeout(tipTimer)
      window.clearInterval(tick)
      if (raf) cancelAnimationFrame(raf)
      active.current = null
      gsap.set(el, { x: 0, y: 0 })
      look(null)
    }
  }, [enabled, wrap, hop, eyes])

  return { tip: enabled ? tip : null, guiding: enabled && guiding }
}
