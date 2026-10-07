import { useEffect } from 'react'
import { ContactSection } from '../sections/ContactSection'
import { Link } from '../lib/router'

/** Shown for any path the site doesn't have. */
export function NotFoundPage() {
  useEffect(() => {
    const prev = document.title
    document.title = 'Page not found — Prateek Patel'
    return () => {
      document.title = prev
    }
  }, [])

  return (
    <>
      <section className="mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col items-start justify-center gap-5 px-6 pb-12 pt-32 sm:px-10">
        <span className="font-display text-7xl font-bold leading-none tracking-tight text-amber-text sm:text-8xl">404</span>
        <h1 className="text-3xl font-bold text-ink sm:text-4xl">This page took a wrong turn.</h1>
        <p className="max-w-md text-base leading-relaxed text-muted">
          The link may be old or mistyped. The ticket never made it to the pipeline — let’s get you back on track.
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          <Link
            to="/"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-amber px-6 text-sm font-semibold text-on-amber shadow-md shadow-amber/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-hover active:translate-y-0 active:scale-95 motion-reduce:transition-none"
          >
            Back to home
          </Link>
          <Link
            to="/pipeline"
            className="inline-flex h-11 items-center rounded-full border border-ink/15 px-5 text-sm font-medium text-ink transition-colors hover:border-amber hover:text-amber-text"
          >
            See the auto-debugger
          </Link>
        </div>
      </section>
      <ContactSection />
    </>
  )
}
