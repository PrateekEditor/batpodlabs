import { PROJECTS, type Tone } from '../data/projects'
import { ProjectIcon } from '../components/ProjectIcon'
import { Link } from '../lib/router'
import { useReveal } from '../lib/useReveal'

export const TONE: Record<Tone, string> = {
  live: 'bg-emerald-600/15 text-emerald-800 dark:text-emerald-300',
  service: 'bg-teal-600/15 text-teal-800 dark:text-teal-300',
  soon: 'bg-amber/20 text-amber-text',
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export function ProjectsSection() {
  const head = useReveal<HTMLDivElement>()
  return (
    <section id="projects" className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 sm:py-24">
      <div ref={head} className="reveal mb-10 flex flex-col gap-2">
        <span className="text-sm font-semibold uppercase tracking-[0.15em] text-amber-text">Things I’m building</span>
        <h2 className="text-3xl font-bold text-ink sm:text-4xl">Projects</h2>
        <p className="max-w-xl text-base leading-relaxed text-muted">Open one to see what it does and how to set it up for yourself.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {PROJECTS.map((p, i) => (
          <Card key={p.slug} index={i} project={p} />
        ))}
      </div>
    </section>
  )
}

function Card({ project: p, index }: { project: (typeof PROJECTS)[number]; index: number }) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} className="reveal h-full" style={{ transitionDelay: `${index * 70}ms` }}>
      <Link
        to={p.to}
        className="group flex h-full flex-col rounded-2xl border border-ink/10 bg-cream-alt p-6 transition-all duration-200 hover:-translate-y-1 hover:border-amber/60 hover:shadow-xl hover:shadow-ink/5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      >
        <div className="flex items-start justify-between gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber/20 text-amber-text">
            <ProjectIcon kind={p.icon} />
          </span>
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${TONE[p.status.tone]}`}>{p.status.label}</span>
        </div>
        <h3 className="mt-5 text-xl font-bold text-ink">{p.name}</h3>
        <p className="mt-1 text-sm font-medium text-amber-text">{p.tagline}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{p.blurb}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {p.tags.map((t) => (
            <span key={t} className="rounded-full bg-ink/5 px-2.5 py-0.5 text-[11px] font-medium text-ink">
              {t}
            </span>
          ))}
        </div>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors group-hover:text-amber-text">
          {p.cta}
          <span className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none">
            <Arrow />
          </span>
        </span>
      </Link>
    </div>
  )
}
