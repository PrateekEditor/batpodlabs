import { useEffect } from 'react'
import { AgentWorkspace } from '../components/AgentWorkspace'
import { PipelineFlow } from '../components/PipelineFlow'
import { ContactSection } from '../sections/ContactSection'
import { Link } from '../lib/router'
import { useReveal } from '../lib/useReveal'

const OFFERS = [
  {
    title: 'Claude auto-debugger',
    body: 'Reads your flows, Apex and metadata to find the root cause, then drafts the fix with test classes.',
  },
  {
    title: 'Ticket upkeep',
    body: 'Bugs, enhancements, data fixes — any ticket type is picked up, updated at every step and closed with notes.',
  },
  {
    title: 'Automation you only monitor',
    body: 'End-to-end automation, set up once and maintained, so your team watches a tracker instead of working a queue.',
  },
]

const CONTROLS = [
  'Read-only steps run on their own.',
  'Anything that changes your org waits for a person to approve it.',
  'Every step is written back to the ticket, so there is a clear trail.',
]

function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  )
}

export function PipelinePage() {
  useEffect(() => {
    const prev = document.title
    document.title = 'Auto-debugger for your Salesforce org — Prateek Patel'
    return () => {
      document.title = prev
    }
  }, [])

  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-6 pb-10 pt-28 sm:px-10 sm:pt-36">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-amber-text">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
          Back
        </Link>
        <div className="mt-6 grid items-end gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl">
            An auto-debugger for<br />
            <span className="text-amber-text">your Salesforce org</span>
          </h1>
          <p className="max-w-md text-base leading-relaxed text-muted">
            Claude connected to your org and your ticket tracker, working tickets from received to deployed — with a
            person approving every change.
          </p>
        </div>
        <div className="mt-10">
          <AgentWorkspace />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10 sm:py-16">
        <Reveal className="mb-8 flex flex-col gap-2">
          <span className="text-sm font-semibold uppercase tracking-[0.15em] text-amber-text">What you get</span>
          <h2 className="text-2xl font-bold text-ink sm:text-3xl">Three things, working together</h2>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {OFFERS.map((o, i) => (
            <Reveal key={o.title}>
              <div className="h-full rounded-2xl border border-ink/10 bg-cream-alt p-6" style={{ transitionDelay: `${i * 60}ms` }}>
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-amber/20 text-sm font-bold text-amber-text">{i + 1}</div>
                <h3 className="text-lg font-semibold text-ink">{o.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{o.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10 sm:py-16">
        <Reveal className="mb-8 flex flex-col gap-2">
          <span className="text-sm font-semibold uppercase tracking-[0.15em] text-amber-text">How a ticket moves</span>
          <h2 className="text-2xl font-bold text-ink sm:text-3xl">Six steps, one tracker to watch</h2>
        </Reveal>
        <PipelineFlow />
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10 sm:py-16">
        <Reveal className="grid gap-8 rounded-3xl bg-navy p-8 text-on-navy sm:p-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">You stay in control</h2>
            <ul className="mt-4 space-y-2.5">
              {CONTROLS.map((c) => (
                <li key={c} className="flex gap-2.5 text-sm leading-relaxed text-on-navy/80">
                  <svg className="mt-0.5 shrink-0 text-amber" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M5 12.5l4.5 4.5L19 7" />
                  </svg>
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-start gap-4 lg:items-end lg:text-right">
            <p className="max-w-sm text-sm leading-relaxed text-on-navy/80">
              Tell me about your org and your tracker, and we’ll map the pipeline together.
            </p>
            <a
              href="#contact"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-amber px-6 text-sm font-semibold text-on-amber transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-hover active:translate-y-0 active:scale-95 motion-reduce:transition-none"
            >
              Get in touch
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </Reveal>
      </section>

      <ContactSection />
    </>
  )
}
