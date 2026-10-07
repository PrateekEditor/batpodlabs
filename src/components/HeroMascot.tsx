import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Mascot } from './PageMascot'
import { SKILL_GROUPS } from '../data/skills'
import { playBotBeep, unlockAudio } from '../lib/audio'

type Sticker = { title: string; items: string[]; bg: string; fg: string; tilt: number; icon: string; fill?: boolean }

// One sticker per skill group, in the order the groups appear on the page.
const STYLE: Omit<Sticker, 'title' | 'items'>[] = [
  { bg: '#1F5FD6', fg: '#fff', tilt: -5, icon: 'M7 18a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 17 8.5 4 4 0 0 1 17.5 18H7z' },
  { bg: '#7040D8', fg: '#fff', tilt: 4, icon: 'M13 2L4 14h7l-1 8 9-12h-7l1-8z', fill: true },
  { bg: '#0F7F7B', fg: '#fff', tilt: -3, icon: 'M4 8h14M14 4l4 4-4 4M20 16H6M10 12l-4 4 4 4' },
  { bg: '#E8862D', fg: '#0D1640', tilt: 5, icon: 'M3 12l9-9h8v8l-9 9-8-8zM15.5 8.5h.01' },
  { bg: '#2A7F50', fg: '#fff', tilt: -4, icon: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1' },
  { bg: '#0D1640', fg: '#F2E9D8', tilt: 3, icon: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z', fill: true },
]

const STICKERS: Sticker[] = SKILL_GROUPS.map((g, i) => ({ ...STYLE[i % STYLE.length], title: g.title, items: g.items }))

const N = STICKERS.length
const LIFE = 16 // seconds for one sticker to spiral from the inside out
const TURNS = 1.35 // how far round the character it travels on the way

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

/**
 * The cursor-tracking character with the six skill groups spiralling around
 * it as stickers. Each one is born near the character, drifts outward in a
 * widening ellipse and fades; the lower half of the orbit passes in front of
 * the character and the upper half behind, which sells the 3D. Hover (or tap
 * / focus) a sticker to pause the spiral and see what is in that group.
 */
export function HeroMascot() {
  const wrap = useRef<HTMLDivElement>(null)
  const els = useRef<(HTMLDivElement | null)[]>([])
  const focusRef = useRef<number | null>(null)
  const clock = useRef(0)
  const [w, setW] = useState(520)
  const [hover, setHover] = useState<number | null>(null)
  const [pinned, setPinned] = useState<number | null>(null)
  const active = hover ?? pinned

  useLayoutEffect(() => {
    const el = wrap.current
    if (!el) return
    const ro = new ResizeObserver(() => setW(el.clientWidth))
    ro.observe(el)
    setW(el.clientWidth)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    focusRef.current = active
  }, [active])

  // tap elsewhere releases a pinned sticker
  useEffect(() => {
    if (pinned === null) return
    const off = (e: PointerEvent) => {
      if (!(e.target as Element).closest('[data-sticker]')) setPinned(null)
    }
    window.addEventListener('pointerdown', off)
    return () => window.removeEventListener('pointerdown', off)
  }, [pinned])

  // the spiral itself — moved imperatively, so no React render per frame
  useEffect(() => {
    const unit = clamp(w / 520, 0.72, 1)
    const rx0 = w * 0.34
    const rx1 = w * 0.42
    const cy = w * 0.045

    const place = (pFor: (i: number) => number, t: number) => {
      for (let i = 0; i < N; i++) {
        const el = els.current[i]
        if (!el) continue
        const p = pFor(i)
        const rx = rx0 + (rx1 - rx0) * p
        const ry = rx * 0.5
        const th = -Math.PI / 2 + p * Math.PI * 2 * TURNS
        const x = rx * Math.cos(th)
        const y = ry * Math.sin(th) + cy
        const front = Math.sin(th) > 0
        const focused = focusRef.current === i
        let a = Math.min(1, p / 0.12, (1 - p) / 0.16)
        a = clamp(a, 0, 1) * (front ? 1 : 0.82)
        let s = (0.72 + 0.38 * p) * unit * (front ? 1 : 0.9)
        if (focused) {
          a = 1
          s = unit * 1.12
        }
        const rot = STICKERS[i].tilt + Math.sin(t * 0.8 + i) * 3
        el.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${rot.toFixed(1)}deg) scale(${s.toFixed(3)})`
        el.style.opacity = a.toFixed(2)
        el.style.zIndex = focused ? '30' : front ? '20' : '5'
        el.style.pointerEvents = a > 0.35 ? 'auto' : 'none'
      }
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // no motion: a still ring, every sticker fully visible
      place((i) => 0.3 + (i / N) * 0.5, 0)
      return
    }

    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (focusRef.current === null) clock.current += dt
      const t = clock.current
      place((i) => (t / LIFE + i / N) % 1, t)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [w, active])

  const onKey = (e: KeyboardEvent, i: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setPinned((v) => (v === i ? null : i))
    }
  }

  const size = Math.round(w * 0.72)

  return (
    <div ref={wrap} className="relative mx-auto aspect-square w-full max-w-[540px]" style={{ touchAction: 'manipulation' }}>
      {/* warm glow + the faint orbit rails */}
      <div className="absolute left-1/2 top-[52%] aspect-square w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber/20 blur-3xl" aria-hidden />
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        <ellipse cx="50" cy="54.5" rx="34" ry="17" fill="none" stroke="#0D1640" strokeOpacity="0.1" strokeWidth="0.3" strokeDasharray="1.2 1.6" />
        <ellipse cx="50" cy="54.5" rx="42" ry="21" fill="none" stroke="#0D1640" strokeOpacity="0.07" strokeWidth="0.3" strokeDasharray="1.2 1.6" />
      </svg>

      {/* the character */}
      <div
        className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
        onClickCapture={() => {
          unlockAudio()
          playBotBeep()
        }}
      >
        <Mascot
          directions="/mascots/prateek-directions.webp"
          reactions="/mascots/prateek-reactions.webp"
          size={size}
          label="Prateek"
        />
      </div>

      {/* skill stickers */}
      {STICKERS.map((s, i) => (
        <div
          key={s.title}
          ref={(el) => {
            els.current[i] = el
          }}
          data-sticker
          className="absolute left-1/2 top-1/2 will-change-transform"
          style={{ opacity: 0 }}
        >
          <div
            role="button"
            tabIndex={0}
            aria-label={`${s.title}: ${s.items.join(', ')}`}
            aria-pressed={pinned === i}
            onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(i)}
            onPointerLeave={(e) => e.pointerType === 'mouse' && setHover(null)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
            onClick={() => setPinned((v) => (v === i ? null : i))}
            onKeyDown={(e) => onKey(e, i)}
            className="relative flex cursor-pointer select-none items-center gap-1.5 whitespace-nowrap rounded-2xl py-1.5 pl-2 pr-3 text-[12.5px] font-bold leading-none outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2"
            style={{
              background: s.bg,
              color: s.fg,
              boxShadow: '0 0 0 3px #fff, 0 6px 14px rgba(13,22,64,0.25)',
              fontFamily: 'var(--font-display)',
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill={s.fill ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d={s.icon} />
            </svg>
            {s.title}

            {active === i && (
              <div
                className="pointer-events-none absolute left-1/2 top-full z-10 mt-3 w-[210px] -translate-x-1/2 whitespace-normal rounded-xl bg-navy px-3 py-2.5 text-left text-[11.5px] font-medium leading-snug text-cream shadow-xl"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {s.items.join(' · ')}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
