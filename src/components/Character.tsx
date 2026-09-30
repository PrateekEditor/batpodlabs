import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react'
import { isMuted, playBotBeep, subscribeMuted, toggleMuted, unlockAudio } from '../lib/audio'

type Action = 'idle' | 'idea' | 'note' | 'drink'
const ACTIONS: Action[] = ['idea', 'note', 'drink']

/**
 * Original flat-vector desk scene — Prateek (back/three-quarter view, same
 * black hoodie + red speed-stripe mark as before) seated in a gaming chair
 * between two monitors, hands animating on the keyboard. The left screen
 * shows a little chat conversation, the right screen has code quietly
 * auto-scrolling. A wall-mounted notice board carries an original cloud-mark
 * sticky (nodding to Salesforce, not a traced logo) and an original
 * friendly-bot sticky (nodding to Agentforce, not Salesforce's actual
 * mascot artwork), plus a small original robot figurine on the desk that
 * beeps and nudges a random idea/note/coffee-break animation when tapped —
 * the same animations also fire on their own at random intervals, like the
 * ambient typing loop. Hand-built from primitives — not 3D, not a traced
 * photo or a copy of any real product's mascot/logo artwork.
 */
export function Character() {
  const [muted, setMutedState] = useState(isMuted)
  const [action, setAction] = useState<Action>('idle')
  const actionRef = useRef<Action>('idle')
  const actionTimer = useRef<number | null>(null)

  useEffect(() => subscribeMuted(setMutedState), [])

  useEffect(() => {
    actionRef.current = action
  }, [action])

  // Random idle moments — fires on its own every few seconds, independent
  // of taps, so the scene never looks frozen even if no one clicks anything.
  useEffect(() => {
    let stopped = false
    let timer: number
    const loop = () => {
      const delay = 3000 + Math.random() * 2000
      timer = window.setTimeout(() => {
        if (!stopped && actionRef.current === 'idle') triggerAction(false)
        if (!stopped) loop()
      }, delay)
    }
    loop()
    return () => {
      stopped = true
      window.clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(
    () => () => {
      if (actionTimer.current) window.clearTimeout(actionTimer.current)
    },
    [],
  )

  function triggerAction(withSound: boolean) {
    if (withSound) {
      unlockAudio()
      playBotBeep()
    }
    const next = ACTIONS[Math.floor(Math.random() * ACTIONS.length)]
    setAction(next)
    if (actionTimer.current) window.clearTimeout(actionTimer.current)
    actionTimer.current = window.setTimeout(() => setAction('idle'), 2000)
  }

  function handleAmpTap(e: MouseEvent<SVGGElement> | KeyboardEvent<SVGGElement>) {
    unlockAudio()
    toggleMuted()
    e.currentTarget.blur()
  }

  const handsPaused = action === 'note' || action === 'drink'

  return (
    <div className="character-float relative mx-auto w-full max-w-[460px] sm:max-w-[540px]">
      {/* soft glow blobs behind the scene */}
      <div
        aria-hidden
        className="absolute left-1/2 top-[30%] -z-10 h-64 w-64 -translate-x-1/2 rounded-full opacity-40 blur-3xl sm:h-80 sm:w-80"
        style={{ background: 'radial-gradient(circle, #E8862D 0%, transparent 70%)' }}
      />
      <div
        aria-hidden
        className="absolute right-[4%] top-[6%] -z-10 h-28 w-28 rounded-full opacity-30 blur-2xl"
        style={{ background: 'radial-gradient(circle, #2D7FF9 0%, transparent 70%)' }}
      />

      <svg viewBox="0 0 590 480" className="relative z-10 h-auto w-full" role="img" aria-label="Illustration of Prateek Patel at his desk, chatting on one screen and coding on the other">
        <defs>
          <linearGradient id="bezel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#262626" />
            <stop offset="1" stopColor="#0a0a0a" />
          </linearGradient>
          <linearGradient id="screenGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#16224f" />
            <stop offset="1" stopColor="#0d1640" />
          </linearGradient>
          <clipPath id="codeClipRight">
            <rect x="430" y="150" width="130" height="82" />
          </clipPath>
        </defs>

        {/* ground shadow, under the desk legs */}
        <ellipse cx="300" cy="434" rx="220" ry="12" fill="#0D1640" opacity="0.07" />

        {/* ===== shelf + notice board (wall) — sit fully above the monitors, y <= 138 ===== */}
        <g>
          {/* notice board */}
          <rect x="384" y="8" width="150" height="110" rx="10" fill="#E4D9BE" stroke="#C9A06B" strokeWidth="3" />

          {/* sticky: cloud mark (Salesforce-nod, original icon) */}
          <g transform="translate(396 20) rotate(-6)">
            <rect width="44" height="36" rx="3" fill="#EAF3FF" />
            <g transform="translate(8 9)">
              <circle cx="6" cy="9" r="6.5" fill="#2D7FF9" />
              <circle cx="15" cy="5" r="8" fill="#2D7FF9" />
              <circle cx="24" cy="10" r="5.5" fill="#2D7FF9" />
              <rect x="1" y="10" width="28" height="7" rx="3.5" fill="#2D7FF9" />
            </g>
          </g>
          <circle cx="418" cy="18" r="3.6" fill="#E4372B" />

          {/* sticky: friendly bot (Agentforce-nod, original character) */}
          <g transform="translate(452 22) rotate(5)">
            <rect width="42" height="38" rx="3" fill="#FFF3E6" />
            <g transform="translate(5 6)">
              <line x1="16" y1="0" x2="16" y2="5" stroke="#0D1640" strokeWidth="2" strokeLinecap="round" />
              <circle cx="16" cy="2" r="2" fill="#E8862D" />
              <rect x="4" y="5" width="24" height="19" rx="7" fill="#0D1640" />
              <circle cx="11" cy="14" r="2.4" fill="#EAF3FF" />
              <circle cx="21" cy="14" r="2.4" fill="#EAF3FF" />
              <path d="M11 19 q5 4 10 0" stroke="#EAF3FF" strokeWidth="1.6" strokeLinecap="round" fill="none" />
            </g>
          </g>
          <circle cx="473" cy="20" r="3.6" fill="#0D1640" />

          {/* sticky: notes lines */}
          <g transform="translate(400 62) rotate(-3)">
            <rect width="86" height="38" rx="3" fill="#FFFBEF" />
            <line x1="7" y1="10" x2="64" y2="10" stroke="#C9A06B" strokeWidth="3" strokeLinecap="round" />
            <line x1="7" y1="19" x2="54" y2="19" stroke="#C9A06B" strokeWidth="3" strokeLinecap="round" />
            <line x1="7" y1="28" x2="60" y2="28" stroke="#C9A06B" strokeWidth="3" strokeLinecap="round" />
          </g>
          <circle cx="406" cy="60" r="3.6" fill="#E8862D" />

          {/* shelf, flush above the monitor tops */}
          <rect x="384" y="124" width="150" height="12" rx="5" fill="#C9A06B" />
          <rect x="396" y="88" width="18" height="36" rx="3" fill="#2D7FF9" />
          <rect x="416" y="82" width="18" height="42" rx="3" fill="#E8862D" />
          <rect x="436" y="92" width="16" height="32" rx="3" fill="#0D1640" />
          <path d="M498 124 q-14 -22 -2 -36 q4 16 2 36 z" fill="#5C8A4E" />
          <path d="M498 124 q13 -20 4 -32 q-2 16 -4 32 z" fill="#6E9C5E" />
        </g>

        {/* ===== monitors — angled slightly inward toward Prateek, with a
             dropped shadow and a gradient bezel, for a bit of 3D pop ===== */}
        {/* left screen — a little chat conversation on the go */}
        <g transform="rotate(3 165 191)">
          <ellipse cx="103" cy="271" rx="28" ry="7" fill="#0D1640" opacity="0.16" />
          <rect x="94" y="236" width="18" height="30" rx="4" fill="#8A8477" />
          <rect x="90" y="140" width="150" height="102" rx="10" fill="url(#bezel)" />
          <rect x="91" y="141" width="148" height="4" rx="2" fill="#3a3a3a" opacity="0.6" />
          <rect x="100" y="150" width="130" height="82" rx="4" fill="url(#screenGlow)" />
          <g opacity="0.95">
            <rect x="108" y="160" width="60" height="14" rx="7" fill="#33427a" />
            <rect x="150" y="180" width="66" height="14" rx="7" fill="#2D7FF9" />
            <rect x="108" y="200" width="50" height="14" rx="7" fill="#33427a" />
            <circle className="glint" cx="150" cy="222" r="2.6" fill="#8fb6ff" />
            <circle className="glint" cx="159" cy="222" r="2.6" fill="#8fb6ff" />
            <circle className="glint" cx="168" cy="222" r="2.6" fill="#8fb6ff" />
          </g>
          {/* floating chat-bubble icon, tucked over the top-left corner */}
          <g transform="translate(70 110)">
            <rect width="36" height="26" rx="9" fill="#2D7FF9" />
            <path d="M8 26 l0 9 l11 -9 z" fill="#2D7FF9" />
            <circle cx="10" cy="13" r="2.3" fill="#EAF3FF" />
            <circle cx="18" cy="13" r="2.3" fill="#EAF3FF" />
            <circle cx="26" cy="13" r="2.3" fill="#EAF3FF" />
          </g>
        </g>

        {/* right screen — code quietly auto-scrolling, clipped to the screen */}
        <g transform="rotate(-3 495 191)">
          <ellipse cx="457" cy="271" rx="28" ry="7" fill="#0D1640" opacity="0.16" />
          <rect x="448" y="236" width="18" height="30" rx="4" fill="#8A8477" />
          <rect x="420" y="140" width="150" height="102" rx="10" fill="url(#bezel)" />
          <rect x="421" y="141" width="148" height="4" rx="2" fill="#3a3a3a" opacity="0.6" />
          <rect x="430" y="150" width="130" height="82" rx="4" fill="url(#screenGlow)" />
          <g clipPath="url(#codeClipRight)">
            <g className="code-scroll">
              <g transform="translate(438 160)">
                <rect width="80" height="6" rx="3" fill="#5fd8ff" />
                <rect y="14" width="56" height="6" rx="3" fill="#E8862D" />
                <rect y="28" width="96" height="6" rx="3" fill="#8fb6ff" />
                <rect y="42" width="66" height="6" rx="3" fill="#5fd8ff" />
                <rect y="56" width="88" height="6" rx="3" fill="#E4372B" />
                <rect y="70" width="46" height="6" rx="3" fill="#8fb6ff" />
              </g>
              <g transform="translate(438 242)">
                <rect width="80" height="6" rx="3" fill="#5fd8ff" />
                <rect y="14" width="56" height="6" rx="3" fill="#E8862D" />
                <rect y="28" width="96" height="6" rx="3" fill="#8fb6ff" />
                <rect y="42" width="66" height="6" rx="3" fill="#5fd8ff" />
                <rect y="56" width="88" height="6" rx="3" fill="#E4372B" />
                <rect y="70" width="46" height="6" rx="3" fill="#8fb6ff" />
              </g>
            </g>
          </g>
        </g>

        {/* ===== desk ===== */}
        <path d="M30 282 L560 282 L586 304 L4 304 Z" fill="#E0C79C" />
        <rect x="20" y="304" width="550" height="92" rx="10" fill="#C9A06B" />
        <rect x="20" y="304" width="550" height="14" fill="#D4AE7C" />
        <rect x="46" y="396" width="16" height="36" rx="4" fill="#A77E4F" />
        <rect x="528" y="396" width="16" height="36" rx="4" fill="#A77E4F" />

        {/* amplifiers — tucked right beside each monitor's foot, as close as the
            desk items allow. Tap either to mute/unmute all sound. */}
        <g
          transform="translate(70 296)"
          onClick={handleAmpTap}
          className="cursor-pointer"
          role="button"
          tabIndex={0}
          aria-label={muted ? 'Unmute site sound' : 'Mute site sound'}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleAmpTap(e)
          }}
        >
          <ellipse cx="11" cy="21" rx="13" ry="3" fill="#0D1640" opacity="0.12" />
          <rect width="22" height="20" rx="4" fill="#151515" opacity={muted ? 0.35 : 1} />
          <circle cx="7" cy="7" r="3" fill={muted ? '#6f6a5e' : '#E8862D'} />
          <circle cx="15" cy="7" r="2" fill={muted ? '#6f6a5e' : '#5fd8ff'} />
          <rect x="4" y="13" width="14" height="3" rx="1.5" fill="#3A3A3A" />
          {muted && <line x1="-2" y1="22" x2="24" y2="-2" stroke="#E4372B" strokeWidth="2" strokeLinecap="round" />}
        </g>
        <g
          transform="translate(466 300)"
          onClick={handleAmpTap}
          className="cursor-pointer"
          role="button"
          tabIndex={0}
          aria-label={muted ? 'Unmute site sound' : 'Mute site sound'}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleAmpTap(e)
          }}
        >
          <ellipse cx="11" cy="21" rx="13" ry="3" fill="#0D1640" opacity="0.12" />
          <rect width="22" height="20" rx="4" fill="#151515" opacity={muted ? 0.35 : 1} />
          <circle cx="7" cy="7" r="3" fill={muted ? '#6f6a5e' : '#5fd8ff'} />
          <circle cx="15" cy="7" r="2" fill={muted ? '#6f6a5e' : '#E8862D'} />
          <rect x="4" y="13" width="14" height="3" rx="1.5" fill="#3A3A3A" />
          {muted && <line x1="-2" y1="22" x2="24" y2="-2" stroke="#E4372B" strokeWidth="2" strokeLinecap="round" />}
        </g>

        {/* pen cup + pencils (desk, left) */}
        <g transform="translate(150 260)">
          <rect x="0" y="14" width="30" height="28" rx="5" fill="#2A2A2A" />
          <line x1="6" y1="18" x2="2" y2="-6" stroke="#E8862D" strokeWidth="4" strokeLinecap="round" />
          <line x1="15" y1="18" x2="14" y2="-10" stroke="#5fd8ff" strokeWidth="4" strokeLinecap="round" />
          <line x1="24" y1="18" x2="27" y2="-4" stroke="#C2C6CF" strokeWidth="4" strokeLinecap="round" />
        </g>

        {/* original robot figurine — replaces a desk-toy penguin. Tap it: beep + a random idea/note/coffee moment. */}
        <g
          transform="translate(20 266)"
          onClick={(e) => {
            triggerAction(true)
            e.currentTarget.blur()
          }}
          className="cursor-pointer"
          role="button"
          tabIndex={0}
          aria-label="Tap the desk robot"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') triggerAction(true)
          }}
          onMouseUp={(e) => e.currentTarget.blur()}
        >
          <ellipse cx="18" cy="38" rx="17" ry="4" fill="#0D1640" opacity="0.12" />
          <rect x="4" y="14" width="28" height="24" rx="9" fill="#0D1640" />
          <circle cx="18" cy="6" r="9" fill="#EAF3FF" stroke="#0D1640" strokeWidth="2.5" />
          <circle cx="15" cy="5" r="1.8" fill="#0D1640" />
          <circle cx="21" cy="5" r="1.8" fill="#0D1640" />
          <path d="M14 9 q4 3 8 0" stroke="#0D1640" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          <line x1="18" y1="-3" x2="18" y2="-9" stroke="#0D1640" strokeWidth="2" strokeLinecap="round" />
          <circle className="glint" cx="18" cy="-10" r="2.6" fill="#E8862D" />
          <rect x="9" y="20" width="18" height="6" rx="3" fill="#E8862D" opacity="0.85" />
          <circle cx="-2" cy="26" r="4" fill="#0D1640" />
          <circle cx="38" cy="26" r="4" fill="#0D1640" />
        </g>

        {/* small plant, desk right */}
        <g transform="translate(512 248)">
          <path d="M8 40 h30 l-4 14 h-22 z" fill="#EAF3FF" stroke="#C9A06B" strokeWidth="2" />
          <path d="M23 40 q-16 -10 -18 -30 q16 4 20 18 q3 -16 16 -20 q0 18 -10 27 q10 -4 16 2 q-10 8 -24 3 z" fill="#5C8A4E" />
        </g>

        {/* ===== gaming chair back — navy with amber piping, sitting behind
             Prateek so its bolsters peek out past the hoodie on both sides.
             Its top edge stays below the head so nothing pokes above him. ===== */}
        <g transform="translate(300 240)">
          <rect x="-108" y="-95" width="216" height="155" rx="34" fill="#16213e" />
          <rect x="-108" y="-95" width="30" height="155" rx="18" fill="#0D1640" />
          <rect x="78" y="-95" width="30" height="155" rx="18" fill="#0D1640" />
          <rect x="-7" y="-90" width="14" height="145" rx="7" fill="#E8862D" opacity="0.9" />
        </g>

        {/* keyboard, centered on the desk top */}
        <rect x="262" y="296" width="76" height="16" rx="4" fill="#1B1B1B" />
        <g fill="#3A3A3A">
          <rect x="268" y="300" width="6" height="6" rx="1.5" />
          <rect x="278" y="300" width="6" height="6" rx="1.5" />
          <rect x="288" y="300" width="6" height="6" rx="1.5" />
          <rect x="298" y="300" width="24" height="6" rx="1.5" />
          <rect x="326" y="300" width="6" height="6" rx="1.5" />
        </g>

        {/* ===== Prateek, seated, back/three-quarter view — facing the screens, not us ===== */}
        <g>
          {/* soft contact shadow under the hoodie, grounding him against the desk */}
          <ellipse cx="300" cy="308" rx="78" ry="10" fill="#0D1640" opacity="0.1" />

          {/* hoodie hood + shoulders/back */}
          <path
            d="M228 306
               q-8 -76 72 -90
               q80 -14 72 90
               q0 10 -10 10
               h-124
               q-10 0 -10 -10 z"
            fill="#151515"
          />
          {/* hood seam */}
          <path d="M300 218 q4 34 0 60" stroke="#2A2A2A" strokeWidth="3" fill="none" strokeLinecap="round" />

          {/* red speed-stripe mark, upper back/shoulder */}
          <g transform="translate(252 244) rotate(14)">
            <rect width="30" height="6" rx="3" fill="#E4372B" />
            <rect y="10" width="22" height="6" rx="3" fill="#E4372B" />
            <rect y="20" width="15" height="6" rx="3" fill="#E4372B" />
          </g>

          {/* head (back of head, short dark hair) */}
          <circle cx="300" cy="178" r="40" fill="#14110F" />
          <ellipse cx="300" cy="196" rx="30" ry="16" fill="#E3AD78" />
          {/* ears */}
          <ellipse cx="270" cy="192" rx="6" ry="9" fill="#E3AD78" />
          <ellipse cx="330" cy="192" rx="6" ry="9" fill="#E3AD78" />
          {/* sunglasses arm hint, catching screen glow */}
          <rect className="glint" x="326" y="186" width="7" height="4" rx="2" fill="#5fd8ff" opacity="0.7" />

          {/* arms reaching forward to the keyboard */}
          <path d="M252 262 q-16 18 -6 40 l18 4 q-6 -22 6 -36 z" fill="#171717" />
          <path d="M348 262 q16 18 6 40 l-18 4 q6 -22 -6 -36 z" fill="#171717" />

          {/* hands — typing, animated (paused during a note/coffee moment) */}
          <g className={handsPaused ? '' : 'hand-left'}>
            <ellipse cx="270" cy="304" rx="11" ry="7" fill="#E3AD78" />
          </g>
          <g className={handsPaused ? '' : 'hand-right'}>
            <ellipse cx="330" cy="304" rx="11" ry="7" fill="#E3AD78" />
          </g>

          {/* idea moment — a lightbulb pops above his head */}
          {action === 'idea' && (
            <g className="pop-idea" transform="translate(300 96)">
              <circle r="14" fill="#FFF3E6" stroke="#E8862D" strokeWidth="2.5" />
              <rect x="-5" y="12" width="10" height="7" rx="2" fill="#C9A06B" />
              <line x1="-4" y1="16" x2="4" y2="16" stroke="#8A6B2A" strokeWidth="1.4" />
              <line x1="0" y1="-24" x2="0" y2="-18" stroke="#E8862D" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="16" y1="-16" x2="21" y2="-20" stroke="#E8862D" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="-16" y1="-16" x2="-21" y2="-20" stroke="#E8862D" strokeWidth="2.4" strokeLinecap="round" />
            </g>
          )}

          {/* note-taking moment — a small notepad + pencil appear by the right hand */}
          {action === 'note' && (
            <g className="pop-note" transform="translate(340 292)">
              <rect width="30" height="24" rx="3" fill="#FFFBEF" stroke="#C9A06B" strokeWidth="1.6" />
              <line x1="5" y1="8" x2="23" y2="8" stroke="#C9A06B" strokeWidth="2" strokeLinecap="round" className="note-line" />
              <line x1="5" y1="14" x2="19" y2="14" stroke="#C9A06B" strokeWidth="2" strokeLinecap="round" className="note-line" />
              <line x1="5" y1="20" x2="21" y2="20" stroke="#C9A06B" strokeWidth="2" strokeLinecap="round" className="note-line" />
              <line x1="24" y1="2" x2="34" y2="-8" stroke="#E8862D" strokeWidth="3" strokeLinecap="round" />
            </g>
          )}

          {/* coffee-break moment — a mug appears by the left hand, with rising steam */}
          {action === 'drink' && (
            <g className="pop-drink" transform="translate(255 288)">
              <rect x="-9" y="-4" width="18" height="16" rx="3" fill="#EAF3FF" stroke="#C9A06B" strokeWidth="1.6" />
              <path d="M9 0 q8 0 8 6 q0 6 -8 6" fill="none" stroke="#C9A06B" strokeWidth="2" />
              <line className="steam-line" x1="-4" y1="-10" x2="-4" y2="-17" stroke="#B8BFCF" strokeWidth="1.6" strokeLinecap="round" />
              <line className="steam-line" x1="2" y1="-11" x2="2" y2="-19" stroke="#B8BFCF" strokeWidth="1.6" strokeLinecap="round" />
            </g>
          )}
        </g>

        {/* gaming chair base — gas cylinder + wide wheeled skid, peeking below the desk front */}
        <g transform="translate(300 396)">
          <rect x="-8" y="0" width="16" height="26" rx="6" fill="#2A2A2A" />
          <path d="M-50 26 q50 14 100 0 q4 10 -6 14 q-44 12 -88 0 q-10 -4 -6 -14 z" fill="#1B1B1F" />
          <circle cx="-46" cy="42" r="6" fill="#0a0a0a" />
          <circle cx="-22" cy="48" r="6" fill="#0a0a0a" />
          <circle cx="0" cy="50" r="6" fill="#0a0a0a" />
          <circle cx="22" cy="48" r="6" fill="#0a0a0a" />
          <circle cx="46" cy="42" r="6" fill="#0a0a0a" />
        </g>
        <ellipse cx="300" cy="458" rx="60" ry="8" fill="#0D1640" opacity="0.12" />
      </svg>
    </div>
  )
}
