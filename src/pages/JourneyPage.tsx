import { useEffect } from 'react'
import { RIDES, TRAVEL, type JourneyEntry } from '../data/journey'
import { ContactSection } from '../sections/ContactSection'
import { Link } from '../lib/router'
import { useReveal } from '../lib/useReveal'

function Entry({ e }: { e: JourneyEntry }) {
  const ref = useReveal<HTMLElement>()
  return (
    <article ref={ref} className="reveal overflow-hidden rounded-2xl border border-ink/10 bg-cream-alt">
      {e.image && <img src={e.image} alt="" loading="lazy" className="h-44 w-full object-cover" />}
      <div className="p-5">
        <div className="text-xs font-semibold uppercase tracking-wide text-amber-text">
          {new Date(e.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {e.place}
          {e.distanceKm ? ` · ${e.distanceKm} km` : ''}
        </div>
        <h3 className="mt-1.5 text-lg font-semibold text-ink">{e.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{e.note}</p>
      </div>
    </article>
  )
}

function Column({ title, blurb, items, empty }: { title: string; blurb: string; items: JourneyEntry[]; empty: string }) {
  const sorted = [...items].sort((a, b) => b.date.localeCompare(a.date))
  return (
    <div>
      <h2 className="text-2xl font-bold text-ink">{title}</h2>
      <p className="mt-1 text-sm text-muted">{blurb}</p>
      <div className="mt-5 space-y-4">
        {sorted.length ? (
          sorted.map((e) => <Entry key={e.title + e.date} e={e} />)
        ) : (
          <div className="rounded-2xl border border-dashed border-ink/20 p-6 text-sm leading-relaxed text-muted">{empty}</div>
        )}
      </div>
    </div>
  )
}

export function JourneyPage() {
  useEffect(() => {
    const prev = document.title
    document.title = 'Rides & travel — Prateek Patel'
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
        <span className="mt-6 block text-sm font-semibold uppercase tracking-[0.15em] text-amber-text">Off the clock</span>
        <h1 className="mt-2 text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl">
          The Batpod <span className="text-amber-text">journey</span>
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
          Rides, routes and the places they led to. Work pays the bills, the bike pays back everything else.
        </p>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-10 sm:py-14">
        <div className="grid gap-10 md:grid-cols-2">
          <Column title="Rides" blurb="Routes, distances and what the road was like." items={RIDES} empty="The first ride write-up is on its way. Check back soon." />
          <Column title="Travel" blurb="Places, people and the stories from the trip." items={TRAVEL} empty="Travel stories are coming. Check back soon." />
        </div>
      </section>

      <ContactSection />
    </>
  )
}
