import { Link } from '../lib/router'
import { useReveal } from '../lib/useReveal'

/** Home-page teaser for the personal side: rides and travel. */
export function PersonalSection() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="journey" className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 sm:py-24">
      <div ref={ref} className="reveal relative overflow-hidden rounded-3xl border border-ink/10 bg-cream-alt p-8 sm:p-12">
        {/* a road, winding off to the right */}
        <svg className="pointer-events-none absolute -right-10 top-0 h-full w-[60%] text-amber/40" viewBox="0 0 400 300" preserveAspectRatio="xMaxYMid slice" fill="none" aria-hidden>
          <path d="M-20 290 C 80 250, 120 180, 200 170 S 330 150, 330 90 S 380 20, 430 10" stroke="currentColor" strokeWidth="26" strokeLinecap="round" opacity="0.35" />
          <path d="M-20 290 C 80 250, 120 180, 200 170 S 330 150, 330 90 S 380 20, 430 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="10 14" />
        </svg>
        <div className="relative max-w-lg">
          <span className="text-sm font-semibold uppercase tracking-[0.15em] text-amber-text">Off the clock</span>
          <h2 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">Rides, roads and places worth the trip</h2>
          <p className="mt-3 text-base leading-relaxed text-muted">
            When I’m not in an org, I’m usually on the Batpod. This is where my biking journey and travel stories live.
          </p>
          <Link
            to="/journey"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-amber px-6 text-sm font-semibold text-on-amber shadow-md shadow-amber/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-hover active:translate-y-0 active:scale-95 motion-reduce:transition-none"
          >
            Follow the journey
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
