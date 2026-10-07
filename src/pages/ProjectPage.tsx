import { useEffect } from 'react'
import { PROJECTS, PROJECT_PAGES } from '../data/projects'
import { SetupSteps } from '../components/SetupSteps'
import { ProjectIcon } from '../components/ProjectIcon'
import { TONE } from '../sections/ProjectsSection'
import { ContactSection } from '../sections/ContactSection'
import { Link } from '../lib/router'
import { useReveal } from '../lib/useReveal'
import { NotFoundPage } from './NotFoundPage'

function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  )
}

export function ProjectPage({ slug }: { slug: string }) {
  const project = PROJECTS.find((p) => p.slug === slug)
  const page = PROJECT_PAGES[slug]

  useEffect(() => {
    if (!project) return
    const prev = document.title
    document.title = `${project.name} — Prateek Patel`
    return () => {
      document.title = prev
    }
  }, [project])

  if (!project || !page) return <NotFoundPage />

  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-6 pb-10 pt-28 sm:px-10 sm:pt-36">
        <Link to="/#projects" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-amber-text">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
          All projects
        </Link>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber/20 text-amber-text">
            <ProjectIcon kind={project.icon} size={26} />
          </span>
          <span className="text-sm font-semibold uppercase tracking-[0.15em] text-amber-text">{page.eyebrow}</span>
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${TONE[project.status.tone]}`}>{project.status.label}</span>
        </div>
        <h1 className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl">{project.name}</h1>
        <p className="mt-3 text-xl font-medium text-amber-text">{project.tagline}</p>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">{page.overview}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {page.repo && (
            <a
              href={page.repo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-navy px-6 text-sm font-semibold text-on-navy transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber hover:text-on-amber active:translate-y-0 active:scale-95 motion-reduce:transition-none"
            >
              View on GitHub
            </a>
          )}
          <a
            href="#contact"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-ink/15 px-5 text-sm font-medium text-ink transition-colors duration-200 hover:border-amber hover:text-amber-text"
          >
            Get in touch
          </a>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-10 sm:py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {page.highlights.map((h, i) => (
            <Reveal key={h.title}>
              <div className="h-full rounded-2xl border border-ink/10 bg-cream-alt p-5" style={{ transitionDelay: `${(i % 3) * 60}ms` }}>
                <h3 className="text-base font-semibold text-ink">{h.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{h.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-10 sm:py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal className="flex flex-col gap-2 lg:sticky lg:top-28 lg:self-start">
            <span className="text-sm font-semibold uppercase tracking-[0.15em] text-amber-text">How to use it</span>
            <h2 className="text-2xl font-bold text-ink sm:text-3xl">{page.stepsTitle}</h2>
            {page.stepsIntro && <p className="text-sm leading-relaxed text-muted">{page.stepsIntro}</p>}
          </Reveal>
          <SetupSteps steps={page.steps} />
        </div>
      </section>

      {page.limits && (
        <section className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-10 sm:py-14">
          <Reveal className="rounded-2xl border border-ink/10 bg-cream-alt p-6 sm:p-8">
            <h2 className="text-lg font-bold text-ink">{page.limitsTitle}</h2>
            <ul className="mt-3 space-y-2">
              {page.limits.map((l) => (
                <li key={l} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" aria-hidden />
                  {l}
                </li>
              ))}
            </ul>
          </Reveal>
        </section>
      )}

      <section className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-10 sm:py-14">
        <Reveal className="flex flex-col items-start gap-4 rounded-3xl bg-navy p-8 text-on-navy sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <p className="max-w-lg text-base leading-relaxed text-on-navy/85">{page.ctaText}</p>
          <a
            href="#contact"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-amber px-6 text-sm font-semibold text-on-amber transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-hover active:translate-y-0 active:scale-95 motion-reduce:transition-none"
          >
            Get in touch
          </a>
        </Reveal>
      </section>

      <ContactSection />
    </>
  )
}
