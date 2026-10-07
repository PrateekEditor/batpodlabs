import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Avatar, Check, Spinner } from './AgentWorkspace'

/**
 * The Debugger bot — a floating chat, bottom-right on every page, styled like
 * the demo window. Type a ticket (or pick one) and it plays a scripted
 * debug → fix → review → deploy run. It is a DEMO: nothing here calls a model
 * or touches an org; the point is to show what the real thing would do.
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
  text: 'Hi — describe a Salesforce ticket, or pick one below, and I’ll show how I’d debug and fix it.',
}

export function openBot() {
  window.dispatchEvent(new Event('bot:open'))
}

export function BotWidget() {
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
    if (open) window.setTimeout(() => input.current?.focus(), 50)
  }, [open])

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

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6" onKeyDown={onKey}>
      {open && (
        <div
          role="dialog"
          aria-label="Debugger demo chat"
          className="flex h-[min(560px,calc(100dvh-7.5rem))] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-2xl shadow-ink/20 msg-in"
        >
          <div className="flex items-center gap-3 border-b border-ink/10 px-4 py-3">
            <Avatar />
            <div className="min-w-0 flex-1 leading-tight">
              <div className="text-sm font-semibold text-ink">Debugger</div>
              <div className="text-[11px] text-muted">Demo · sample org</div>
            </div>
            {started && (
              <button type="button" onClick={reset} className="rounded-md px-2 py-1 text-[11px] font-medium text-muted transition-colors hover:bg-ink/5 hover:text-ink">
                New ticket
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

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Close the debugger demo' : 'Open the debugger demo'}
        className="group inline-flex h-14 items-center gap-2.5 rounded-full bg-navy pl-2 pr-2 text-on-navy shadow-xl shadow-ink/25 ring-2 ring-surface transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 motion-reduce:transition-none sm:pr-5"
      >
        {open ? (
          <span className="flex h-10 w-10 items-center justify-center" aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </span>
        ) : (
          <Avatar size={40} />
        )}
        <span className="hidden text-sm font-semibold sm:inline">{open ? 'Close' : 'Try the debugger'}</span>
      </button>
    </div>
  )
}
