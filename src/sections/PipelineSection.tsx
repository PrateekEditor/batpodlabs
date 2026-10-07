import { useEffect, useRef, useState } from 'react'
import { useReveal } from '../lib/useReveal'

type Stage = { label: string; caption: string; icon: string }

const STAGES: Stage[] = [
  { label: 'Intake', caption: 'Any tracker — Jira, Asana or Salesforce Cases', icon: 'M3 13l3-8h12l3 8v6H3v-6zM3 13h5l1 3h6l1-3h5' },
  { label: 'Triage', caption: 'Claude classifies, de-dupes and sets priority', icon: 'M3 4h18l-7 8v6l-4 2v-8z' },
  { label: 'Debug', caption: 'Reads flows, Apex, metadata and logs to find the root cause', icon: 'M8 9h8v7a4 4 0 0 1-8 0V9zM9 5l2 2M15 5l-2 2M4 12h4M16 12h4M4 18h4M16 18h4' },
  { label: 'Fix + tests', caption: 'Drafts the Apex / Flow / LWC change with test classes', icon: 'M8 7l-5 5 5 5M16 7l5 5-5 5' },
  { label: 'Review', caption: 'A human approves — you stay in control', icon: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM8 12l3 3 5-6' },
  { label: 'Ship', caption: 'Deploys, updates the ticket, tells the team', icon: 'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z' },
]

const TICKETS = [
  { id: 'TKT-101', title: 'Quote totals off after an amendment', color: '#1F5FD6' },
  { id: 'TKT-102', title: 'Renewal flow throws a null error', color: '#7040D8' },
  { id: 'TKT-103', title: 'Batch job hits the CPU limit', color: '#0F7F7B' },
  { id: 'TKT-104', title: 'Order page component won’t load', color: '#E8862D' },
]

const STATUS = ['Received', 'Triaged', 'Debugging', 'Fix drafted', 'In review', 'Deployed']
const CHIP = [
  'bg-navy/10 text-ink',
  'bg-blue-600/15 text-blue-800',
  'bg-amber/20 text-amber-text',
  'bg-violet-600/15 text-violet-800',
  'bg-teal-600/15 text-teal-800',
  'bg-emerald-600/15 text-emerald-800',
]

const S = STAGES.length
const CYCLE = S + 2 // two extra beats where a finished ticket sits at "closed"
const OFFSETS = [0, 2, 4, 6]
const TICK_MS = 1500

/**
 * "Tickets in, fixes out." A looping pipeline: sample tickets ride along the
 * stages (intake → triage → debug → fix → review → ship) while a mock tracker
 * below shows their status changing — the point being that the client only
 * has to watch the tracker. Illustrative data, no real client tickets.
 */
export function PipelineSection() {
  const headRef = useReveal<HTMLDivElement>()
  const wrap = useRef<HTMLElement>(null)
  const [tick, setTick] = useState(2)
  const [inView, setInView] = useState(false)
  const [reduce, setReduce] = useState(false)

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    const el = wrap.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || reduce) return
    const id = window.setInterval(() => setTick((t) => t + 1), TICK_MS)
    return () => window.clearInterval(id)
  }, [inView, reduce])

  const stages = TICKETS.map((_, k) => (tick + OFFSETS[k]) % CYCLE)
  const activeNodes = new Set(stages.filter((s) => s <= S).map((s) => Math.min(s, S - 1)))

  return (
    <section ref={wrap} id="pipeline" className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 sm:py-24">
      <div ref={headRef} className="reveal mb-10 flex max-w-2xl flex-col gap-3">
        <span className="text-sm font-semibold uppercase tracking-[0.15em] text-amber-text">What I can set up for your org</span>
        <h2 className="text-3xl font-bold text-ink sm:text-4xl">Tickets in, fixes out. You just watch the tracker.</h2>
        <p className="text-base leading-relaxed text-muted">
          I wire Claude into your Salesforce org and your ticket tracker as an auto-debugger: it picks up every ticket,
          finds the root cause, drafts the fix with tests, and keeps the ticket updated at each step. A person approves
          what ships — nobody has to babysit it.
        </p>
      </div>

      <div className="rounded-3xl border border-navy/10 bg-cream-alt p-5 sm:p-8">
        {/* the pipeline */}
        <div className="relative">
          {/* track the tickets ride on */}
          <div className="relative h-7" aria-hidden>
            <div className="absolute left-[8.33%] right-[8.33%] top-1/2 h-0.5 -translate-y-1/2 rounded bg-navy/15" />
            {TICKETS.map((t, k) => {
              const s = stages[k]
              const x = ((Math.min(s, S - 1) + 0.5) / S) * 100
              return (
                <span
                  key={t.id}
                  className="absolute top-1/2 block h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-cream-alt"
                  style={{
                    left: `${x}%`,
                    background: t.color,
                    opacity: s >= S + 1 ? 0 : 1,
                    boxShadow: `0 0 12px ${t.color}`,
                    transition: s === 0 ? 'none' : 'left 900ms cubic-bezier(.4,0,.2,1), opacity 300ms',
                  }}
                />
              )
            })}
          </div>

          <ol className="mt-1 grid grid-cols-6 gap-1 sm:gap-3">
            {STAGES.map((st, i) => {
              const on = activeNodes.has(i)
              return (
                <li key={st.label} className="flex flex-col items-center text-center">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all duration-500 motion-reduce:transition-none sm:h-14 sm:w-14 ${
                      on ? 'scale-110 border-amber bg-navy text-amber shadow-lg shadow-amber/30' : 'border-navy/15 bg-white text-ink'
                    }`}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d={st.icon} />
                    </svg>
                  </span>
                  <span className="mt-2 text-[11px] font-bold leading-tight text-ink sm:text-sm">{st.label}</span>
                  <span className="mt-1 hidden text-xs leading-snug text-muted lg:block">{st.caption}</span>
                </li>
              )
            })}
          </ol>
          {/* captions don't fit under six columns on small screens — list them instead */}
          <ul className="mt-5 grid gap-1.5 text-xs text-muted sm:grid-cols-2 lg:hidden">
            {STAGES.map((st, i) => (
              <li key={st.label}>
                <span className="font-semibold text-ink">{i + 1}. {st.label}</span> — {st.caption}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.7fr_1fr]">
          {/* mock tracker */}
          <div className="overflow-hidden rounded-2xl border border-navy/10 bg-white" role="img" aria-label="Illustrative ticket tracker: sample tickets moving from received to deployed">
            <div className="flex items-center justify-between border-b border-navy/10 px-4 py-2.5">
              <span className="text-xs font-bold uppercase tracking-wide text-ink">Your tracker</span>
              <span className="shrink-0 text-[11px] text-muted">all you watch · sample tickets</span>
            </div>
            <ul>
              {TICKETS.map((t, k) => {
                const s = stages[k]
                const done = s >= S
                const idx = Math.min(s, S - 1)
                return (
                  <li key={t.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-navy/5 px-4 py-3 last:border-b-0">
                    <span className="font-mono text-[11px] font-semibold text-muted">{t.id}</span>
                    <div className="min-w-0">
                      <div className="text-sm font-medium leading-snug text-ink">{t.title}</div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-navy/10">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${done ? 100 : ((idx + 1) / S) * 100}%`,
                            background: done ? '#2A7F50' : t.color,
                            transition: s === 0 ? 'none' : 'width 900ms cubic-bezier(.4,0,.2,1), background 300ms',
                          }}
                        />
                      </div>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${done ? 'bg-emerald-600/15 text-emerald-800' : CHIP[idx]}`}>
                      {done ? 'Closed ✓' : STATUS[idx]}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* call to action */}
          <div className="flex flex-col justify-between gap-5 rounded-2xl bg-navy p-6 text-cream">
            <div>
              <h3 className="text-xl font-bold leading-snug">Want this running on your org?</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/75">
                Auto-debugging, ticket upkeep and full automation, set up once and maintained — so your team only
                monitors. Tell me about your org and we’ll map the pipeline.
              </p>
            </div>
            <a
              href="#contact"
              className="inline-flex h-11 w-fit items-center gap-2 rounded-full bg-amber px-6 text-sm font-semibold text-navy transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-hover active:translate-y-0 active:scale-95 motion-reduce:transition-none"
            >
              Get in touch
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
