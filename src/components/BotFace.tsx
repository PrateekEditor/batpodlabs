import { useEffect, useId, useRef } from 'react'

/**
 * PP's face. The eyes follow the cursor; with no cursor (phones, or a mouse
 * left alone) they look around on their own, and they blink now and then.
 * `scan` makes it look left-right like it's busy loading; `happy` squints
 * the eyes into a smile.
 */
export function BotFace({ size = 56, happy = false, scan = false }: { size?: number; happy?: boolean; scan?: boolean }) {
  const gid = useId().replace(/:/g, '')
  const svg = useRef<SVGSVGElement>(null)
  const pupils = useRef<SVGGElement>(null)
  const eyes = useRef<SVGGElement>(null)
  const lastMove = useRef(0)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hasCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const look = (x: number, y: number) => pupils.current?.setAttribute('transform', `translate(${(x * 4.5).toFixed(2)} ${(y * 3.4).toFixed(2)})`)

    const onMove = (e: PointerEvent) => {
      const el = svg.current
      if (!el) return
      lastMove.current = Date.now()
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      const d = Math.hypot(dx, dy) || 1
      const k = Math.min(1, d / 140)
      look((dx / d) * k, (dy / d) * k)
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    const timers: number[] = []
    let wanderTimer = 0
    if (!reduce) {
      const wander = () => {
        if (scan) {
          look(Math.random() < 0.5 ? -1 : 1, (Math.random() - 0.5) * 0.4)
          wanderTimer = window.setTimeout(wander, 420)
          return
        }
        if (!hasCursor || Date.now() - lastMove.current > 4000) {
          const a = Math.random() * Math.PI * 2
          const m = Math.random() < 0.25 ? 0 : 0.6 + Math.random() * 0.4
          look(Math.cos(a) * m, Math.sin(a) * m)
        }
        wanderTimer = window.setTimeout(wander, 1300 + Math.random() * 1700)
      }
      wanderTimer = window.setTimeout(wander, 800)

      const blink = () => {
        if (eyes.current) eyes.current.style.transform = 'scaleY(0.08)'
        timers.push(window.setTimeout(() => eyes.current && (eyes.current.style.transform = ''), 120))
        timers.push(window.setTimeout(blink, 2400 + Math.random() * 2800))
      }
      timers.push(window.setTimeout(blink, 1800))
    }

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.clearTimeout(wanderTimer)
      timers.forEach(window.clearTimeout)
    }
  }, [scan])

  return (
    <svg
      ref={svg}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="shrink-0 overflow-visible drop-shadow-md"
      aria-hidden
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      {/* headset ears */}
      <circle cx="6" cy="52" r="6.5" fill="#E8862D" />
      <circle cx="94" cy="52" r="6.5" fill="#E8862D" />
      {/* body */}
      <rect x="7" y="5" width="86" height="86" rx="30" fill={`url(#${gid})`} />
      {/* visor */}
      <rect x="14" y="27" width="72" height="40" rx="20" fill="#0b1233" />
      {happy ? (
        <g stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none">
          <path d="M27 52 Q36 40 45 52" />
          <path d="M55 52 Q64 40 73 52" />
        </g>
      ) : (
        <g ref={eyes} style={{ transformBox: 'fill-box', transformOrigin: 'center', transition: 'transform 0.08s' }}>
          <circle cx="36" cy="47" r="10.5" fill="#fff" />
          <circle cx="64" cy="47" r="10.5" fill="#fff" />
          <g ref={pupils} style={{ transition: 'transform 0.14s ease-out' }}>
            <circle cx="36" cy="47" r="5.2" fill="#0b1233" />
            <circle cx="64" cy="47" r="5.2" fill="#0b1233" />
            <circle cx="38" cy="45" r="1.6" fill="#fff" />
            <circle cx="66" cy="45" r="1.6" fill="#fff" />
          </g>
        </g>
      )}
      {/* mouth */}
      <path d={happy ? 'M38 76 Q50 90 62 76' : 'M42 77 Q50 83 58 77'} stroke="#fff" strokeWidth="3.6" strokeLinecap="round" fill="none" />
    </svg>
  )
}
