import { RIDES, TRAVEL, type JourneyEntry } from '../data/journey'
import { Link } from '../lib/router'
import { usePageTitle } from '../lib/usePageTitle'
import { BATPOD_LINKS } from '../data/links'
import { BATPOD_BASES, BATPOD_BIKE, BATPOD_TAGLINE, GEAR } from '../data/batpod'
import { SocialIcon } from '../components/SocialIcon'
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

export function BatpodPage() {
  usePageTitle('BatPod With PP: rides, roads and the gear I use')

  return (
    <>
      {/* hero: night road */}
      <section className="relative overflow-hidden bg-[#0d1640] text-[#f2e9d8]">
        <svg className="pointer-events-none absolute inset-0 h-full w-full text-[#e8862d]" viewBox="0 0 1200 520" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden>
          <path d="M-40 520 C 220 430, 380 330, 600 310 S 980 250, 1240 80" stroke="currentColor" strokeOpacity="0.16" strokeWidth="90" strokeLinecap="round" />
          <path d="M-40 520 C 220 430, 380 330, 600 310 S 980 250, 1240 80" stroke="currentColor" strokeOpacity="0.7" strokeWidth="3" strokeDasharray="18 22" strokeLinecap="round" />
        </svg>
        <div className="relative mx-auto w-full max-w-6xl px-6 pb-16 pt-36 sm:px-10 sm:pb-20 sm:pt-36">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#f2e9d8]/60 transition-colors hover:text-[#f2a050]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
            Prateek Patel
          </Link>
          <h1 className="mt-6 text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl">
            BatPod <span className="text-[#f2a050]">With PP</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-[#f2e9d8]/80 sm:text-xl">{BATPOD_TAGLINE}</p>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#f2e9d8]/50">
            Motovlogs · rides · road trips · {BATPOD_BASES.join(' | ')}
          </p>

          <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-2">
            {BATPOD_LINKS.map((l) => (
              <a
                key={l.key}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-[#f2e9d8]/15 bg-[#f2e9d8]/5 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#e8862d] hover:bg-[#e8862d]/10 motion-reduce:transition-none"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e8862d] text-[#0d1640]">
                  <SocialIcon name={l.key} size={22} />
                </span>
                <span className="min-w-0">
                  <span className="block font-bold">{l.label === 'YouTube' ? 'Watch the rides' : 'Photos & reels'}</span>
                  <span className="block truncate text-sm text-[#f2e9d8]/60">
                    {l.label} · {l.handle}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* the bike + gear */}
      <section className="mx-auto w-full max-w-6xl px-6 py-14 sm:px-10 sm:py-20">
        <div className="grid gap-6 md:grid-cols-[1fr_1.4fr]">
          <div className="rounded-3xl border border-ink/10 bg-cream-alt p-7">
            <span className="text-sm font-semibold uppercase tracking-[0.15em] text-amber-text">The bike</span>
            <h2 className="mt-2 text-3xl font-bold text-ink">{BATPOD_BIKE.name}</h2>
            <p className="mt-1 font-semibold text-ink/80">{BATPOD_BIKE.model}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{BATPOD_BIKE.blurb}</p>
          </div>
          <div className="rounded-3xl border border-ink/10 bg-cream-alt p-7">
            <span className="text-sm font-semibold uppercase tracking-[0.15em] text-amber-text">What I ride with</span>
            <h2 className="mt-2 text-2xl font-bold text-ink">Gear &amp; brands</h2>
            {GEAR.length ? (
              <ul className="mt-4 divide-y divide-ink/10">
                {GEAR.map((g) => (
                  <li key={g.kind + g.name} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3">
                    <span className="w-28 shrink-0 text-xs font-semibold uppercase tracking-wide text-muted">{g.kind}</span>
                    <span className="min-w-0 flex-1">
                      <span className="font-semibold text-ink">{g.brand ? `${g.brand} ` : ''}{g.name}</span>
                      {g.note && <span className="block text-sm text-muted">{g.note}</span>}
                    </span>
                    {g.code && <span className="rounded-md bg-amber/15 px-2 py-0.5 font-mono text-xs font-semibold text-amber-text">Code {g.code}</span>}
                    {g.link && (
                      <a href={g.link} target="_blank" rel="noreferrer" className="text-sm font-semibold text-amber-text underline-offset-2 hover:underline">
                        Get it
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-muted">
                The full list of helmet, gear, camera and mounts is coming soon. Ask about anything you see in a video on{' '}
                <a href={BATPOD_LINKS.find((l) => l.key === 'instagram')?.url} target="_blank" rel="noreferrer" className="font-semibold text-amber-text underline-offset-2 hover:underline">
                  Instagram
                </a>
                .
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-14 sm:px-10">
        <div className="grid gap-10 md:grid-cols-2">
          <Column title="Rides" blurb="Routes, distances and what the road was like." items={RIDES} empty="The first ride write-up is on its way. Until then, the rides are on YouTube." />
          <Column title="Travel" blurb="Places, people and the stories from the trip." items={TRAVEL} empty="Travel stories and a map of every place the Batpod has been are coming soon." />
        </div>
      </section>

      {/* brands */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-20 sm:px-10">
        <div className="flex flex-col items-start justify-between gap-4 rounded-3xl bg-amber p-7 sm:flex-row sm:items-center sm:p-9">
          <div>
            <div className="text-2xl font-bold text-on-amber">Brands &amp; collabs</div>
            <p className="mt-1 max-w-lg text-sm text-on-amber/80">Riding gear, accessories or a destination to feature? Send a DM on Instagram.</p>
          </div>
          <a
            href="https://ig.me/m/batpod.with.pp"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 shrink-0 items-center rounded-full bg-navy px-6 text-sm font-semibold text-on-navy transition-transform hover:-translate-y-0.5"
          >
            DM @batpod.with.pp
          </a>
        </div>
      </section>
    </>
  )
}
