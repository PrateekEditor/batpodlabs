import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { playBotBeep, unlockAudio } from '../lib/audio'

type Mood = 'happy' | 'wink' | 'wow' | 'cool'

const MOODS: { mood: Mood; line: string }[] = [
  { mood: 'wink', line: 'npm run build ✓' },
  { mood: 'wow', line: 'Whoa — 0 test failures?!' },
  { mood: 'cool', line: 'Deployed to prod. Calmly.' },
  { mood: 'wink', line: 'Claude wrote it. I reviewed it.' },
  { mood: 'wow', line: 'Governor limits: survived.' },
  { mood: 'cool', line: 'Want this automated? Let’s talk.' },
]

const SKIN = '#D6A073'
const SKIN_SHADE = '#B9825A'
const HAIR = '#14141C'
const NAVY = '#16213E'
const AMBER = '#E8862D'
const BLUE = '#2D7FF9'

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

/**
 * A cursor-tracking dev mascot: head, eyes and features follow the pointer
 * with a small parallax, it blinks on its own, and clicking it cycles through
 * expressions with a one-liner. Drawn as one inline SVG so there are no image
 * assets and no extra dependencies.
 */
export function DevMascot() {
  const svgRef = useRef<SVGSVGElement>(null)
  const headRef = useRef<SVGGElement>(null)
  const faceRef = useRef<SVGGElement>(null)
  const pupilL = useRef<SVGCircleElement>(null)
  const pupilR = useRef<SVGCircleElement>(null)
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })

  const [mood, setMood] = useState<Mood>('happy')
  const [blink, setBlink] = useState(false)
  const [bubble, setBubble] = useState<string | null>(null)
  const step = useRef(0)
  const moodTimer = useRef<number | undefined>(undefined)

  // pointer tracking, smoothed in a rAF loop (no React re-renders per frame)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const onMove = (e: PointerEvent) => {
      const svg = svgRef.current
      if (!svg || reduce) return
      const r = svg.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height * 0.45
      target.current.x = clamp((e.clientX - cx) / 380, -1, 1)
      target.current.y = clamp((e.clientY - cy) / 380, -1, 1)
    }
    const onLeave = () => {
      target.current.x = 0
      target.current.y = 0
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)

    let raf = 0
    const tick = () => {
      const c = current.current
      c.x += (target.current.x - c.x) * 0.12
      c.y += (target.current.y - c.y) * 0.12
      headRef.current?.setAttribute(
        'transform',
        `translate(${(c.x * 7).toFixed(2)} ${(c.y * 4).toFixed(2)}) rotate(${(c.x * 5).toFixed(2)} 100 150)`,
      )
      faceRef.current?.setAttribute('transform', `translate(${(c.x * 5).toFixed(2)} ${(c.y * 3).toFixed(2)})`)
      const px = (c.x * 3.6).toFixed(2)
      const py = (c.y * 3).toFixed(2)
      pupilL.current?.setAttribute('transform', `translate(${px} ${py})`)
      pupilR.current?.setAttribute('transform', `translate(${px} ${py})`)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  // idle blink
  useEffect(() => {
    let t: number
    const loop = () => {
      t = window.setTimeout(() => {
        setBlink(true)
        window.setTimeout(() => setBlink(false), 130)
        loop()
      }, 2600 + Math.random() * 2600)
    }
    loop()
    return () => window.clearTimeout(t)
  }, [])

  // friendly hello once
  useEffect(() => {
    const a = window.setTimeout(() => setBubble('Hey — poke me.'), 1800)
    const b = window.setTimeout(() => setBubble((v) => (v === 'Hey — poke me.' ? null : v)), 5200)
    return () => {
      window.clearTimeout(a)
      window.clearTimeout(b)
    }
  }, [])

  const react = useCallback(() => {
    unlockAudio()
    playBotBeep()
    const pick = MOODS[step.current % MOODS.length]
    step.current += 1
    setMood(pick.mood)
    setBubble(pick.line)
    window.clearTimeout(moodTimer.current)
    moodTimer.current = window.setTimeout(() => {
      setMood('happy')
      setBubble(null)
    }, 2200)
  }, [])

  useEffect(() => () => window.clearTimeout(moodTimer.current), [])

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      react()
    }
  }

  const cool = mood === 'cool'
  const eyesClosedL = blink
  const eyesClosedR = blink || mood === 'wink'

  return (
    <div className="pointer-events-none fixed bottom-3 right-3 z-30 flex flex-col items-end sm:bottom-5 sm:right-6">
      <div
        aria-live="polite"
        className={`mb-1 max-w-[190px] rounded-2xl rounded-br-sm bg-navy px-3 py-1.5 text-xs font-medium text-cream shadow-lg transition-all duration-200 motion-reduce:transition-none ${
          bubble ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
        }`}
      >
        {bubble ?? ' '}
      </div>

      <svg
        ref={svgRef}
        viewBox="0 0 200 220"
        role="button"
        tabIndex={0}
        aria-label="Prateek's cartoon avatar — it watches your cursor; press to make it react"
        onClick={react}
        onKeyDown={onKey}
        className="pointer-events-auto rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 h-[132px] w-[120px] cursor-pointer select-none drop-shadow-[0_8px_10px_rgba(13,22,64,0.22)] transition-transform duration-150 hover:scale-105 active:scale-95 motion-reduce:transition-none sm:h-[190px] sm:w-[173px]"
      >
        {/* hoodie */}
        <path d="M14 222 C14 178 50 160 100 160 C150 160 186 178 186 222 Z" fill={NAVY} />
        <path d="M60 164 C74 190 126 190 140 164 C128 158 72 158 60 164 Z" fill="#0D1640" />
        <path d="M86 176 L84 204" stroke={AMBER} strokeWidth="3" strokeLinecap="round" />
        <path d="M114 176 L116 204" stroke={AMBER} strokeWidth="3" strokeLinecap="round" />
        <text x="100" y="216" textAnchor="middle" fontSize="15" fontWeight="700" fill={AMBER} fontFamily="ui-monospace, monospace">
          {'</>'}
        </text>

        {/* neck */}
        <rect x="85" y="136" width="30" height="34" rx="12" fill={SKIN_SHADE} />

        {/* head (tracks the cursor) */}
        <g ref={headRef}>
          {/* ears */}
          <ellipse cx="45" cy="102" rx="9" ry="12" fill={SKIN_SHADE} />
          <ellipse cx="155" cy="102" rx="9" ry="12" fill={SKIN_SHADE} />
          {/* head */}
          <ellipse cx="100" cy="96" rx="56" ry="58" fill={SKIN} />
          {/* stubble / goatee shading */}
          <path d="M60 116 C62 158 138 158 140 116 C132 140 68 140 60 116 Z" fill={HAIR} opacity="0.38" />
          {/* hair with a quiff */}
          <path
            d="M43 90 C34 48 64 24 98 24 C108 4 140 2 156 24 C170 44 160 72 157 90 C151 72 143 60 128 54 C110 63 82 61 66 56 C54 62 47 74 43 90 Z"
            fill={HAIR}
          />
          <path d="M98 24 C108 14 124 12 136 18" stroke="#3A3A4A" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7" />

          {/* face features get extra parallax */}
          <g ref={faceRef}>
            {/* brows */}
            <path d="M62 76 C70 70 84 70 92 75" stroke={HAIR} strokeWidth="5" strokeLinecap="round" fill="none" />
            <path
              d={mood === 'wow' ? 'M108 70 C116 64 130 64 138 70' : 'M108 75 C116 70 130 70 138 76'}
              stroke={HAIR}
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />

            {/* eyes */}
            <g>
              {eyesClosedL ? (
                <path d="M68 96 Q78 102 88 96" stroke={HAIR} strokeWidth="3.5" strokeLinecap="round" fill="none" />
              ) : (
                <>
                  <ellipse cx="78" cy="96" rx="11" ry={mood === 'wow' ? 12 : 10} fill="#fff" />
                  <circle ref={pupilL} cx="78" cy="96" r={mood === 'wow' ? 4.2 : 5.4} fill={HAIR} />
                </>
              )}
              {eyesClosedR ? (
                <path d="M112 96 Q122 102 132 96" stroke={HAIR} strokeWidth="3.5" strokeLinecap="round" fill="none" />
              ) : (
                <>
                  <ellipse cx="122" cy="96" rx="11" ry={mood === 'wow' ? 12 : 10} fill="#fff" />
                  <circle ref={pupilR} cx="122" cy="96" r={mood === 'wow' ? 4.2 : 5.4} fill={HAIR} />
                </>
              )}
            </g>

            {/* techy glasses */}
            <g>
              <rect x="62" y="82" width="32" height="28" rx="10" fill={cool ? '#0D1640' : '#2D7FF9'} fillOpacity={cool ? 0.92 : 0.1} stroke={BLUE} strokeWidth="3.2" />
              <rect x="106" y="82" width="32" height="28" rx="10" fill={cool ? '#0D1640' : '#2D7FF9'} fillOpacity={cool ? 0.92 : 0.1} stroke={BLUE} strokeWidth="3.2" />
              <path d="M94 94 L106 94" stroke={BLUE} strokeWidth="3.2" strokeLinecap="round" />
              <path d="M62 92 L52 90" stroke={BLUE} strokeWidth="3" strokeLinecap="round" />
              <path d="M138 92 L148 90" stroke={BLUE} strokeWidth="3" strokeLinecap="round" />
              <path d="M68 88 L76 86" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity="0.8" />
              <path d="M112 88 L120 86" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity="0.8" />
              {cool && (
                <>
                  <path d="M69 98 L88 90" stroke={AMBER} strokeWidth="2" strokeLinecap="round" opacity="0.9" />
                  <path d="M113 98 L132 90" stroke={AMBER} strokeWidth="2" strokeLinecap="round" opacity="0.9" />
                </>
              )}
            </g>

            {/* nose */}
            <path d="M96 106 C94 114 98 117 104 114" stroke={SKIN_SHADE} strokeWidth="3" strokeLinecap="round" fill="none" />

            {/* mustache */}
            <path d="M76 126 C86 118 96 120 100 123 C104 120 114 118 124 126 C116 130 106 127 100 127 C94 127 84 130 76 126 Z" fill={HAIR} />

            {/* mouth */}
            {mood === 'wow' ? (
              <ellipse cx="100" cy="139" rx="7" ry="8" fill="#5A1F1F" />
            ) : (
              <path d="M85 133 Q100 148 115 133 Q100 137 85 133 Z" fill="#fff" stroke="#5A1F1F" strokeWidth="2" strokeLinejoin="round" />
            )}
          </g>

          {/* headset */}
          <path d="M38 94 C34 24 166 24 162 94" stroke="#0D1640" strokeWidth="7" strokeLinecap="round" fill="none" />
          <rect x="26" y="86" width="18" height="32" rx="9" fill={AMBER} stroke="#0D1640" strokeWidth="3" />
          <rect x="156" y="86" width="18" height="32" rx="9" fill={AMBER} stroke="#0D1640" strokeWidth="3" />
          <path d="M33 116 C33 140 52 148 72 144" stroke="#0D1640" strokeWidth="3" strokeLinecap="round" fill="none" />
          <circle cx="74" cy="144" r="4.5" fill={AMBER} stroke="#0D1640" strokeWidth="2" />
        </g>
      </svg>
    </div>
  )
}
