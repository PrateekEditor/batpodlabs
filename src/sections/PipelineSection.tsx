import { AgentWorkspace } from '../components/AgentWorkspace'
import { Link } from '../lib/router'
import { useReveal } from '../lib/useReveal'

/** Home-page teaser: one line, one live mock, two buttons. The detail lives on /pipeline. */
export function PipelineSection() {
  const ref = useReveal<HTMLDivElement>()

  return (
    <section id="pipeline" className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 sm:py-24">
      <div ref={ref} className="reveal grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <div className="flex flex-col items-start gap-4">
          <span className="text-sm font-semibold uppercase tracking-[0.15em] text-amber-text">What I can set up for your org</span>
          <h2 className="text-3xl font-bold leading-tight text-ink sm:text-4xl">Tickets in, fixes out.</h2>
          <p className="max-w-md text-base leading-relaxed text-muted">
            Claude as an auto-debugger on your Salesforce org and your tracker. It picks up tickets, fixes them, keeps
            them updated — you just monitor.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/pipeline"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-amber px-6 text-sm font-semibold text-on-amber shadow-md shadow-amber/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-hover hover:shadow-lg active:translate-y-0 active:scale-95 motion-reduce:transition-none"
            >
              See how it works
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <a
              href="#contact"
              className="inline-flex h-11 items-center rounded-full border border-ink/15 px-5 text-sm font-medium text-ink transition-colors duration-200 hover:border-amber hover:text-amber-text"
            >
              Get in touch
            </a>
          </div>
        </div>

        <AgentWorkspace compact />
      </div>
    </section>
  )
}
