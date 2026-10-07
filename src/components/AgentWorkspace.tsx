import { useEffect, useRef, useState } from 'react'

/**
 * A looping mock of an agent workspace — the debugger takes a ticket from
 * "received" to "deployed" in a chat, with a review card where a human
 * approves before anything is changed. Layout follows the open-source
 * OpenDots agent UI (sidebar of spaces + conversations, a chat with tool
 * cards, an approve-before-it-runs card). All content is illustrative.
 */

type Item =
  | { kind: 'user'; text: string }
  | { kind: 'agent'; text: string }
  | { kind: 'tool'; label: string; detail: string }
  | { kind: 'review' }
  | { kind: 'done'; text: string }

const ITEMS: Item[] = [
  { kind: 'user', text: 'TKT-101 — Quote totals are wrong after an amendment.' },
  { kind: 'agent', text: 'On it. Pulling the quote, its flows and the Apex around it.' },
  { kind: 'tool', label: 'Reading org metadata', detail: '3 flows · 2 triggers · 1 batch job' },
  { kind: 'agent', text: 'Found it: the amendment flow recalculates totals before the new segments exist.' },
  { kind: 'tool', label: 'Drafting the fix', detail: '1 flow change · 4 test classes passing' },
  { kind: 'review' },
  { kind: 'done', text: 'Deployed to the sandbox. TKT-101 is updated and the team has been notified.' },
]

// how long each step stays on screen (ms); step 6 is the "approved" beat
const DURATIONS = [1100, 1300, 1500, 1700, 1500, 2600, 1000, 1500, 3400]
const LAST = DURATIONS.length - 1

export function Avatar({ size = 36 }: { size?: number }) {
  // PP wears Prateek's face: the centre cell of the direction sheet, cropped round.
  return (
    <span
      aria-hidden
      className="inline-block shrink-0 overflow-hidden rounded-full bg-amber/25 ring-1 ring-ink/10"
      style={{ width: size, height: size }}
    >
      <span
        className="block"
        style={{
          width: size * 1.45,
          height: size * 1.45,
          marginLeft: -size * 0.225,
          marginTop: -size * 0.12,
          backgroundImage: 'url(/mascots/prateek-directions.webp)',
          backgroundSize: '300% 300%',
          backgroundPosition: '50% 50%',
        }}
      />
    </span>
  )
}

export function Spinner() {
  return <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink/20 border-t-teal-500 motion-reduce:animate-none" aria-hidden />
}

export function Check({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  )
}

function SideLabel({ children }: { children: string }) {
  return <div className="mb-1.5 mt-5 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">{children}</div>
}

function Sidebar() {
  return (
    <aside className="hidden w-[190px] shrink-0 flex-col border-r border-ink/10 bg-cream-alt p-4 md:flex" aria-hidden>
      <div className="flex items-center gap-2 px-1">
        <Avatar size={22} />
        <span className="font-display text-sm font-semibold tracking-tight text-ink">PP</span>
      </div>
      <div className="mt-4 rounded-lg bg-ink/5 px-3 py-2 text-xs text-muted">+ New conversation</div>
      <SideLabel>Orgs</SideLabel>
      <div className="rounded-md bg-ink/5 px-2 py-1.5 text-xs font-medium text-ink">Sandbox</div>
      <div className="px-2 py-1.5 text-xs text-muted">Production</div>
      <SideLabel>Tickets</SideLabel>
      <div className="rounded-md bg-teal-500/15 px-2 py-1.5 text-xs font-medium text-teal-800 dark:text-teal-300">TKT-101 Quote totals</div>
      <div className="px-2 py-1.5 text-xs text-muted">TKT-102 Renewal flow</div>
      <div className="px-2 py-1.5 text-xs text-muted">TKT-103 Batch CPU limit</div>
      <div className="mt-auto space-y-1 border-t border-ink/10 pt-3 text-xs text-muted">
        <div className="px-2">Connections</div>
        <div className="px-2">Activity log</div>
      </div>
    </aside>
  )
}

export function AgentWorkspace({ compact = false }: { compact?: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)
  const [inView, setInView] = useState(false)
  const [reduce, setReduce] = useState(false)

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (reduce || !inView) return
    const id = window.setTimeout(() => setStep((s) => (s >= LAST ? 0 : s + 1)), DURATIONS[step])
    return () => window.clearTimeout(id)
  }, [step, inView, reduce])

  const shown = reduce ? ITEMS.length : step <= 5 ? step + 1 : step === 6 ? 6 : 7
  const approved = reduce || step >= 6
  const typing = !reduce && [0, 2, 4, 6].includes(step)

  return (
    <div
      ref={root}
      role="img"
      aria-label="Illustrative agent workspace: PP, a Salesforce dev copilot, takes a support ticket, finds the cause in the org, drafts a fix, waits for a person to approve it, then deploys and updates the ticket."
      className="overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-xl shadow-ink/5"
    >
      {/* top bar */}
      <div className="flex items-center justify-between border-b border-ink/10 px-4 py-2.5 text-xs text-muted">
        <div className="flex items-center gap-2">
          <span className="flex gap-1.5" aria-hidden>
            <i className="h-2.5 w-2.5 rounded-full bg-ink/15" />
            <i className="h-2.5 w-2.5 rounded-full bg-ink/15" />
            <i className="h-2.5 w-2.5 rounded-full bg-ink/15" />
          </span>
          <span className="ml-2">Sandbox</span>
          <span>/</span>
          <span className="font-medium text-ink">PP</span>
        </div>
        <span className="rounded-md bg-ink/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">Sample</span>
      </div>

      <div className="flex">
        {!compact && <Sidebar />}

        <div className="flex min-w-0 flex-1 flex-col">
          {/* agent header */}
          <div className="flex items-center gap-3 border-b border-ink/10 px-4 py-3">
            <Avatar />
            <div className="leading-tight">
              <div className="text-sm font-semibold text-ink">PP</div>
              <div className="text-[11px] text-muted">Salesforce dev copilot</div>
            </div>
          </div>

          {/* conversation */}
          <div
            className={`flex flex-col justify-end gap-3 overflow-hidden px-4 py-4 ${compact ? 'h-[330px]' : 'h-[400px]'}`}
            style={{ maskImage: 'linear-gradient(to bottom, transparent 0, #000 22%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, #000 22%)' }}
          >
            {ITEMS.slice(0, shown).map((it, i) => {
              const base = 'msg-in'
              if (it.kind === 'user')
                return (
                  <div key={i} className={`${base} ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-teal-600 px-3.5 py-2 text-[13px] leading-snug text-white`}>
                    {it.text}
                  </div>
                )
              if (it.kind === 'agent')
                return (
                  <p key={i} className={`${base} max-w-[92%] text-[13px] leading-relaxed text-ink/80`}>
                    {it.text}
                  </p>
                )
              if (it.kind === 'tool') {
                const finished = shown > i + 1
                return (
                  <div key={i} className={`${base} flex items-center gap-2.5 rounded-lg border border-ink/10 bg-cream-alt px-3 py-2`}>
                    {finished ? <Check className="text-teal-600 dark:text-teal-400" /> : <Spinner />}
                    <div className="min-w-0 leading-tight">
                      <div className="text-xs font-semibold text-ink">{it.label}</div>
                      <div className="truncate text-[11px] text-muted">{it.detail}</div>
                    </div>
                  </div>
                )
              }
              if (it.kind === 'review')
                return (
                  <div key={i} className={`${base} rounded-xl border border-amber/40 bg-cream-alt p-3`}>
                    <div className="flex items-center gap-2 text-xs font-semibold text-ink">
                      <span className="rounded bg-amber/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-text">Review</span>
                      Deploy this fix to the sandbox?
                    </div>
                    <div className="mt-2 space-y-1 font-mono text-[11px] leading-snug">
                      <div className="text-emerald-700 dark:text-emerald-300">+ Amendment_Recalc.flow · recalc after segments are inserted</div>
                      <div className="text-muted">  4 test classes · all passing</div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      {approved ? (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600/15 px-3 py-1.5 text-xs font-semibold text-teal-800 dark:text-teal-300">
                          <Check /> Approved
                        </span>
                      ) : (
                        <>
                          <span className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white">Approve &amp; deploy</span>
                          <span className="rounded-lg border border-ink/15 px-3 py-1.5 text-xs font-medium text-muted">Decline</span>
                        </>
                      )}
                    </div>
                  </div>
                )
              return (
                <div key={i} className={`${base} space-y-2`}>
                  <p className="max-w-[92%] text-[13px] leading-relaxed text-ink/80">{it.text}</p>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/15 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                    <Check /> TKT-101 · Closed
                  </span>
                </div>
              )
            })}
            {typing && (
              <div className="msg-in flex gap-1 px-1" aria-hidden>
                <i className="typing-dot" />
                <i className="typing-dot" style={{ animationDelay: '0.15s' }} />
                <i className="typing-dot" style={{ animationDelay: '0.3s' }} />
              </div>
            )}
          </div>

          {/* composer */}
          <div className="flex items-center gap-3 border-t border-ink/10 px-4 py-3" aria-hidden>
            <span className="flex-1 text-xs text-muted">Message PP…</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 text-white">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
