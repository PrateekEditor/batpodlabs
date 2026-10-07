import { useCallback, useEffect, useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Avatar, Check, Spinner } from './AgentWorkspace'
import { Mascot } from './PageMascot'
import { navigate, setNavigateGuard, usePath } from '../lib/router'

/**
 * PP — a floating Salesforce dev copilot, bottom-right on every page, styled
 * like the demo window. Type a ticket (or pick one) and it plays a scripted
 * debug → fix → review → deploy run. It is a DEMO: nothing here calls a model
 * or touches an org; the point is to show what the real thing would do.
 *
 * PP is also the site's loader: on first load it boots in the middle of the
 * screen and then floats down to the corner; on every page change it flies to
 * the middle, the page swaps underneath, and it docks again, ready to chat.
 */

type Step =
  | { kind: 'agent'; text: string }
  | { kind: 'tool'; label: string; detail: string }

type Scenario = {
  keywords: RegExp
  steps: Step[]
  review: { file: string; change: string; tests: string }
  done: string
}

const SCENARIOS: Record<string, Scenario> = {
  quote: {
    keywords: /quote|total|amend|mdq|pric|segment/i,
    steps: [
      { kind: 'agent', text: 'On it. Pulling the quote, its flows and the Apex around it.' },
      { kind: 'tool', label: 'Reading org metadata', detail: '3 flows · 2 triggers · 1 batch job' },
      { kind: 'agent', text: 'Found it: the amendment flow recalculates totals before the new segments exist.' },
      { kind: 'tool', label: 'Drafting the fix', detail: '1 flow change · 4 test classes passing' },
    ],
    review: { file: 'Amendment_Recalc.flow', change: 'recalculate after segments are inserted', tests: '4 test classes · all passing' },
    done: 'Deployed to the sandbox. The ticket is updated and the team has been notified.',
  },
  flow: {
    keywords: /flow|null|renewal|opportunit|contract|error/i,
    steps: [
      { kind: 'agent', text: 'Looking at the renewal flow and the records it touches.' },
      { kind: 'tool', label: 'Reading flow versions', detail: '2 versions · 1 record-triggered flow' },
      { kind: 'agent', text: 'A blank Contract Term reaches a formula in the flow when an opportunity is created without one.' },
      { kind: 'tool', label: 'Drafting the fix', detail: '1 decision added · 3 test cases passing' },
    ],
    review: { file: 'Renewal_Create.flow', change: 'guard the formula when Contract Term is blank', tests: '3 test cases · all passing' },
    done: 'Deployed to the sandbox. The flow no longer errors, and the ticket is updated.',
  },
  batch: {
    keywords: /batch|cpu|limit|governor|apex|timeout|slow/i,
    steps: [
      { kind: 'agent', text: 'Checking the batch job and its recent runs.' },
      { kind: 'tool', label: 'Reading debug logs', detail: 'last 3 runs · near the CPU limit' },
      { kind: 'agent', text: 'Nested loops recalculate the same pricing rules for every quote line.' },
      { kind: 'tool', label: 'Drafting the fix', detail: '1 Apex class · 5 test methods passing' },
    ],
    review: { file: 'QuoteRecalcBatch.cls', change: 'cache pricing rules and bulkify the lookups', tests: '5 test methods · all passing' },
    done: 'Deployed to the sandbox. The batch now finishes well inside the limits, and the ticket is updated.',
  },
  lwc: {
    keywords: /lwc|component|load|render|blank|page|order|lightning/i,
    steps: [
      { kind: 'agent', text: 'Opening the component and the Apex it calls.' },
      { kind: 'tool', label: 'Checking wire adapters', detail: '1 LWC · 2 Apex methods' },
      { kind: 'agent', text: 'It queries before the Order record id is available, so it renders blank.' },
      { kind: 'tool', label: 'Drafting the fix', detail: '1 component change · 6 Jest tests passing' },
    ],
    review: { file: 'orderSummary.js', change: 'wait for the record id before the wire fires', tests: '6 Jest tests · all passing' },
    done: 'Deployed to the sandbox. The component loads, and the ticket is updated.',
  },
  generic: {
    keywords: /./,
    steps: [
      { kind: 'agent', text: 'Thanks — I’ll treat that as a new ticket and look at what changed recently.' },
      { kind: 'tool', label: 'Reading org metadata', detail: 'recent deployments · related automation' },
      { kind: 'agent', text: 'I’d narrow it to the automation that fires on that record, reproduce it in a sandbox, then draft a fix.' },
      { kind: 'tool', label: 'Drafting the fix', detail: 'sample output for this demo' },
    ],
    review: { file: 'Proposed change', change: 'shown to you before anything is deployed', tests: 'tests included' },
    done: 'In a real run this would be deployed to the sandbox and the ticket updated. This is a scripted demo — on your org I read the real metadata.',
  },
}

const CHIPS: { label: string; text: string }[] = [
  { label: 'Quote totals wrong after an amendment', text: 'TKT-101 — Quote totals are wrong after an amendment.' },
  { label: 'Renewal flow throws a null error', text: 'TKT-102 — The renewal flow throws a null error.' },
  { label: 'Batch job hits the CPU limit', text: 'TKT-103 — Our quote batch job hits the CPU limit.' },
  { label: 'Order page component won’t load', text: 'TKT-104 — The order page component won’t load.' },
]

function pick(text: string): Scenario {
  const hit = (['quote', 'flow', 'batch', 'lwc'] as const).find((k) => SCENARIOS[k].keywords.test(text))
  return SCENARIOS[hit ?? 'generic']
}

type Body =
  | { kind: 'user'; text: string }
  | { kind: 'agent'; text: string }
  | { kind: 'tool'; label: string; detail: string }
  | { kind: 'review'; file: string; change: string; tests: string; decision?: 'approved' | 'declined' }
  | { kind: 'done'; text: string }
type Msg = Body & { id: number }

type Phase = 'idle' | 'playing' | 'review'

const GREETING: Msg = {
  id: 0,
  kind: 'agent',
  text: 'Hi, I’m PP, a Salesforce dev copilot. Describe a ticket, or pick one below, and I’ll show how I’d debug and fix it.',
}

export function openBot() {
  window.dispatchEvent(new Event('bot:open'))
}

type Mode = 'boot' | 'idle' | 'cover'
const BOOT_MIN = 1100
const BOOT_MAX = 4000
const FLY_OUT = 350 // time for the cover to settle before the page swaps
const FLY_BACK = 600 // time for PP to dock again after the swap

const margin = () => (window.innerWidth >= 640 ? 24 : 16)
/** Offset that moves the docked orb to the centre of the viewport. */
function centreOffset() {
  const m = margin()
  const w = document.documentElement.clientWidth
  const h = window.innerHeight
  return { x: w / 2 - (w - m - 28), y: h / 2 - (h - m - 28) }
}

export function BotWidget() {
  const path = usePath()
  const prefersReduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [mode, setMode] = useState<Mode>(prefersReduce ? 'idle' : 'boot')
  const [instant, setInstant] = useState(false)
  const [off, setOff] = useState(() => (typeof window === 'undefined' ? { x: 0, y: 0 } : centreOffset()))
  const [hint, setHint] = useState(false)
  const navTimers = useRef<number[]>([])
  const busy = useRef(false)
  const viaGuard = useRef(false)
  const lastPath = useRef(path)
  const hinted = useRef(false)
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([GREETING])
  const [phase, setPhase] = useState<Phase>('idle')
  const [draft, setDraft] = useState('')
  const [reduce, setReduce] = useState(false)
  const idRef = useRef(1)
  const timers = useRef<number[]>([])
  const scroller = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const scenario = useRef<Scenario>(SCENARIOS.generic)

  const later = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, reduce ? 0 : ms))
  }
  const push = useCallback((m: Body) => {
    setMsgs((cur) => [...cur, { ...m, id: idRef.current++ }])
  }, [])

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    const t = timers.current
    return () => t.forEach(window.clearTimeout)
  }, [])

  // open from anywhere on the site (e.g. the "Try the debugger" buttons)
  useEffect(() => {
    const onOpen = () => setOpen(true)
    window.addEventListener('bot:open', onOpen)
    return () => window.removeEventListener('bot:open', onOpen)
  }, [])

  useEffect(() => {
    if (open) {
      setHint(false)
      window.setTimeout(() => input.current?.focus(), 50)
    }
  }, [open])

  const after = (ms: number, fn: () => void) => {
    navTimers.current.push(window.setTimeout(fn, ms))
  }

  // keep the "centre" target right if the window changes size mid-transition
  useEffect(() => {
    const onResize = () => setOff(centreOffset())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // boot: wait for the page, fonts and a short minimum, then float to the corner
  useEffect(() => {
    if (mode !== 'boot') return
    const started = Date.now()
    let done = false
    const finish = () => {
      if (done) return
      done = true
      setMode('idle')
    }
    const ready = Promise.all([
      document.readyState === 'complete' ? Promise.resolve() : new Promise<void>((r) => window.addEventListener('load', () => r(), { once: true })),
      document.fonts?.ready ?? Promise.resolve(),
      ...['/mascots/prateek-directions.webp', '/mascots/prateek-reactions.webp'].map(
        (src) =>
          new Promise<void>((r) => {
            const img = new Image()
            img.onload = img.onerror = () => r()
            img.src = src
          }),
      ),
    ])
    ready.then(() => {
      const wait = Math.max(0, BOOT_MIN - (Date.now() - started))
      navTimers.current.push(window.setTimeout(finish, wait))
    })
    navTimers.current.push(window.setTimeout(finish, BOOT_MAX))
  }, [mode])

  // page changes: fly to the centre, swap the page, dock again
  useEffect(() => {
    if (prefersReduce) {
      setNavigateGuard(null)
      return
    }
    setNavigateGuard((go) => {
      if (busy.current) return
      busy.current = true
      viaGuard.current = true
      setOpen(false)
      setOff(centreOffset())
      setMode('cover')
      after(FLY_OUT, go)
      after(FLY_OUT + FLY_BACK, () => {
        setMode('idle')
        busy.current = false
      })
    })
    return () => setNavigateGuard(null)
  }, [prefersReduce])

  // back / forward buttons change the path without the guard: cover instantly
  useLayoutEffect(() => {
    if (path === lastPath.current) return
    lastPath.current = path
    if (viaGuard.current) {
      viaGuard.current = false
      return
    }
    if (prefersReduce) return
    busy.current = true
    setOpen(false)
    setOff(centreOffset())
    setInstant(true)
    setMode('cover')
    after(500, () => {
      setInstant(false)
      setMode('idle')
      busy.current = false
    })
  }, [path, prefersReduce])

  // a one-time nudge after PP lands, for visitors who haven't found it
  useEffect(() => {
    if (mode !== 'idle' || hinted.current) return
    hinted.current = true
    let seen = false
    try {
      seen = sessionStorage.getItem('pp-hint') === '1'
      sessionStorage.setItem('pp-hint', '1')
    } catch {
      /* storage can be blocked; just show it */
    }
    if (seen) return
    navTimers.current.push(window.setTimeout(() => setHint(true), 1600))
    navTimers.current.push(window.setTimeout(() => setHint(false), 8000))
  }, [mode])

  useEffect(() => {
    const t = navTimers.current
    return () => t.forEach(window.clearTimeout)
  }, [])

  const seeDetails = () => {
    setOpen(false)
    navigate('/pipeline')
  }

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: reduce ? 'auto' : 'smooth' })
  }, [msgs, phase, open, reduce])

  const run = (text: string) => {
    const sc = pick(text)
    scenario.current = sc
    setPhase('playing')
    push({ kind: 'user', text })
    let t = 600
    for (const step of sc.steps) {
      const at = t
      later(at, () => push(step))
      t += step.kind === 'tool' ? 1300 : 1500
    }
    later(t, () => {
      push({ kind: 'review', ...sc.review })
      setPhase('review')
    })
  }

  const send = (e?: FormEvent) => {
    e?.preventDefault()
    const text = draft.trim()
    if (!text || phase !== 'idle') return
    setDraft('')
    run(text)
  }

  const decide = (id: number, approved: boolean) => {
    setMsgs((cur) => cur.map((m) => (m.id === id && m.kind === 'review' ? { ...m, decision: approved ? 'approved' : 'declined' } : m)))
    setPhase('playing')
    later(900, () => {
      if (approved) push({ kind: 'done', text: scenario.current.done })
      else push({ kind: 'agent', text: 'No problem — I’d revise the fix and bring it back for review.' })
      setPhase('idle')
    })
  }

  const reset = () => {
    timers.current.forEach(window.clearTimeout)
    timers.current = []
    setMsgs([GREETING])
    setPhase('idle')
  }

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') setOpen(false)
  }

  const started = msgs.length > 1

  const away = mode !== 'idle'

  return (
    <>
      {/* loading cover: sits under PP while it boots or while the page swaps */}
      <div
        aria-hidden
        className={`fixed inset-0 z-[60] bg-cream ${mode === 'boot' ? 'transition-opacity duration-500' : 'transition-opacity duration-200'} ${away ? 'opacity-100' : 'pointer-events-none opacity-0'} ${instant ? '!transition-none' : ''}`}
      >
        <p className="absolute left-0 right-0 text-center text-sm font-medium tracking-wide text-muted" style={{ top: 'calc(50% + 86px)' }}>
          {mode === 'boot' ? 'Booting PP…' : 'Loading…'}
        </p>
      </div>
      <span className="sr-only" role="status">{mode === 'boot' ? 'Loading the site' : ''}</span>

    <div className="fixed bottom-4 right-4 z-[70] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6" onKeyDown={onKey}>
      {open && !away && (
        <div
          role="dialog"
          aria-label="PP, Salesforce dev copilot (demo chat)"
          className="flex h-[min(560px,calc(100dvh-7.5rem))] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-2xl shadow-ink/20 msg-in"
        >
          <div className="flex items-center gap-3 border-b border-ink/10 px-4 py-3">
            <Avatar />
            <div className="min-w-0 flex-1 leading-tight">
              <div className="text-sm font-semibold text-ink">PP</div>
              <div className="truncate text-[11px] text-muted">Salesforce dev copilot · demo</div>
            </div>
            {started && (
              <button type="button" onClick={reset} className="rounded-md px-2 py-1 text-[11px] font-medium text-muted transition-colors hover:bg-ink/5 hover:text-ink">
                New ticket
              </button>
            )}
            {path.replace(/\/+$/, '') !== '/pipeline' && (
              <button
                type="button"
                onClick={seeDetails}
                title="See how the full pipeline works"
                className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber/50 px-2.5 py-1 text-[11px] font-semibold text-amber-text transition-colors hover:bg-amber/10"
              >
                Details
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition-colors hover:bg-ink/5 hover:text-ink"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div ref={scroller} className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
            {msgs.map((m, i) => {
              if (m.kind === 'user')
                return (
                  <div key={m.id} className="msg-in ml-auto max-w-[88%] rounded-2xl rounded-br-md bg-teal-600 px-3.5 py-2 text-[13px] leading-snug text-white">
                    {m.text}
                  </div>
                )
              if (m.kind === 'agent')
                return (
                  <p key={m.id} className="msg-in max-w-[92%] text-[13px] leading-relaxed text-ink/80">
                    {m.text}
                  </p>
                )
              if (m.kind === 'tool') {
                const finished = i < msgs.length - 1
                return (
                  <div key={m.id} className="msg-in flex items-center gap-2.5 rounded-lg border border-ink/10 bg-cream-alt px-3 py-2">
                    {finished ? <Check className="text-teal-600 dark:text-teal-400" /> : <Spinner />}
                    <div className="min-w-0 leading-tight">
                      <div className="text-xs font-semibold text-ink">{m.label}</div>
                      <div className="truncate text-[11px] text-muted">{m.detail}</div>
                    </div>
                  </div>
                )
              }
              if (m.kind === 'review')
                return (
                  <div key={m.id} className="msg-in rounded-xl border border-amber/40 bg-cream-alt p-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-ink">
                      <span className="rounded bg-amber/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-text">Review</span>
                      Deploy this fix to the sandbox?
                    </div>
                    <div className="mt-2 space-y-1 font-mono text-[11px] leading-snug">
                      <div className="break-words text-emerald-700 dark:text-emerald-300">+ {m.file} · {m.change}</div>
                      <div className="text-muted">  {m.tests}</div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      {m.decision === 'approved' ? (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600/15 px-3 py-1.5 text-xs font-semibold text-teal-800 dark:text-teal-300">
                          <Check /> Approved
                        </span>
                      ) : m.decision === 'declined' ? (
                        <span className="rounded-lg bg-ink/10 px-3 py-1.5 text-xs font-semibold text-muted">Declined</span>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => decide(m.id, true)}
                            className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-teal-700 active:scale-95"
                          >
                            Approve &amp; deploy
                          </button>
                          <button
                            type="button"
                            onClick={() => decide(m.id, false)}
                            className="rounded-lg border border-ink/15 px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:text-ink"
                          >
                            Decline
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )
              return (
                <div key={m.id} className="msg-in space-y-2">
                  <p className="max-w-[92%] text-[13px] leading-relaxed text-ink/80">{m.text}</p>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/15 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                    <Check /> Ticket updated · Closed
                  </span>
                  <p className="text-xs text-muted">
                    Want this on your org?{' '}
                    <a href="#contact" onClick={() => setOpen(false)} className="font-semibold text-amber-text underline-offset-2 hover:underline">
                      Get in touch
                    </a>
                  </p>
                </div>
              )
            })}

            {phase === 'playing' && !reduce && (
              <div className="flex gap-1 px-1" aria-hidden>
                <i className="typing-dot" />
                <i className="typing-dot" style={{ animationDelay: '0.15s' }} />
                <i className="typing-dot" style={{ animationDelay: '0.3s' }} />
              </div>
            )}

            {phase === 'idle' && (
              <div className="mt-1 flex flex-wrap gap-2">
                {CHIPS.map((c) => (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => run(c.text)}
                    className="rounded-full border border-ink/15 px-3 py-1.5 text-left text-xs font-medium text-ink transition-colors hover:border-amber hover:text-amber-text"
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={send} className="flex items-center gap-2 border-t border-ink/10 px-3 py-3">
            <input
              ref={input}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              disabled={phase !== 'idle'}
              placeholder={phase === 'review' ? 'Approve or decline above…' : phase === 'playing' ? 'Working on it…' : 'Describe a ticket…'}
              aria-label="Describe a ticket"
              className="min-w-0 flex-1 rounded-lg border border-ink/10 bg-cream-alt px-3 py-2 text-[13px] text-ink outline-none placeholder:text-muted focus:border-amber disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!draft.trim() || phase !== 'idle'}
              aria-label="Send"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white transition-all hover:bg-teal-700 active:scale-95 disabled:opacity-40"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
          </form>
          <div className="border-t border-ink/5 px-4 py-1.5 text-center text-[10px] text-muted">Scripted demo · sample org, no live data</div>
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* greeting nudge / label */}
        <div
          className={`hidden max-w-[220px] rounded-2xl rounded-br-md border border-ink/10 bg-surface px-3.5 py-2 text-xs font-medium text-ink shadow-lg shadow-ink/10 transition-all duration-300 sm:block ${hint && !open && !away ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-2 opacity-0'}`}
          aria-hidden={!hint}
        >
          Hi, I’m PP. Give me a Salesforce ticket to fix.
        </div>

        <div
          className="relative h-14 w-14"
          style={{
            transform: away ? `translate(${off.x}px, ${off.y}px) scale(2.4)` : 'translate(0,0) scale(1)',
            transition: instant || prefersReduce ? 'none' : mode === 'boot' ? 'transform 800ms cubic-bezier(0.34, 1.3, 0.5, 1)' : 'transform 600ms cubic-bezier(0.34, 1.3, 0.5, 1)',
          }}
        >
          <div className={away || open ? '' : 'bot-float'}>
            <div className="relative h-14 w-14">
              <div className="h-14 w-14 overflow-hidden rounded-full bg-surface shadow-xl shadow-ink/25 ring-2 ring-amber">
                <div style={{ marginLeft: -5, marginTop: 1 }}>
                  <Mascot
                    directions="/mascots/prateek-directions.webp"
                    reactions="/mascots/prateek-reactions.webp"
                    size={66}
                    label="PP"
                    scan={away}
                    disabled={away}
                    expanded={open}
                    ariaLabel={open ? 'Close the PP demo chat' : 'Open the PP demo chat'}
                    onPress={() => setOpen((v) => !v)}
                  />
                </div>
              </div>
              {open && !away && (
                <span className="pointer-events-none absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-navy text-on-navy ring-2 ring-surface" aria-hidden>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
