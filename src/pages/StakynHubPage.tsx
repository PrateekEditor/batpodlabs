import { useMemo, useState } from 'react'
import { STAKYN_CATEGORIES, STAKYN_INTRO, STAKYN_POSTS, STAKYN_SERIES, type StakynCategory, type StakynPost } from '../data/stakyn'
import { STAKYN_EMAIL } from '../data/links'
import { Link } from '../lib/router'
import { usePageTitle } from '../lib/usePageTitle'
import { SK, StakynShell, StakynSocials } from '../components/StakynShell'
import { StakynLogo } from '../components/StakynLogo'

const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
const catLabel = (id: StakynCategory) => STAKYN_CATEGORIES.find((c) => c.id === id)?.label ?? id

function matches(p: StakynPost, q: string) {
  if (!q) return true
  const hay = [p.name, p.title, p.tagline, p.hook, p.series, p.keyword, catLabel(p.category), ...p.keywords, ...p.facts].join(' ').toLowerCase()
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((w) => hay.includes(w))
}

function PostCard({ p, guide }: { p: StakynPost; guide?: boolean }) {
  return (
    <Link
      to={`/stakyn/${p.slug}`}
      data-guide={guide ? 'Tap a card for the repo & setup' : undefined}
      className="group flex flex-col gap-3 rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#B7F23E]/60 motion-reduce:transition-none"
      style={{ background: SK.panel, borderColor: SK.line }}
    >
      <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wide">
        <span className="rounded-full px-2.5 py-1" style={{ background: '#B8A2FF1f', color: SK.lav }}>
          {p.series} · {p.episode.replace(/\s*\(.*\)/, '')}
        </span>
        <span className="text-white/45">{catLabel(p.category)}</span>
      </div>
      <div>
        <h3 className="text-lg font-bold leading-snug text-white">{p.name}</h3>
        <p className="mt-0.5 text-sm text-white/70">{p.tagline}</p>
      </div>
      <p className="text-sm italic leading-relaxed text-white/50">“{p.hook}”</p>
      <div className="mt-auto flex items-center justify-between pt-1 text-xs">
        <span className="text-white/40">Posted {fmtDate(p.postedOn)}</span>
        <span className="inline-flex items-center gap-1 font-semibold transition-transform group-hover:translate-x-0.5" style={{ color: SK.lime }}>
          Repo &amp; setup
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  )
}

function Chip({ active, onClick, children, count }: { active: boolean; onClick: () => void; children: string; count: number }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors ${active ? 'border-transparent text-[#0b0b0f]' : 'text-white/70 hover:text-white'}`}
      style={active ? { background: SK.lime } : { borderColor: SK.line }}
    >
      {children}
      <span className={`text-xs ${active ? 'text-[#0b0b0f]/60' : 'text-white/35'}`}>{count}</span>
    </button>
  )
}

export function StakynHubPage() {
  usePageTitle('Stakyn Labs: free repos, dev fixes and setup guides')
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<StakynCategory | 'all'>('all')
  const [series, setSeries] = useState<string>('all')

  const posts = useMemo(() => [...STAKYN_POSTS].sort((a, b) => b.postedOn.localeCompare(a.postedOn)), [])
  const searched = posts.filter((p) => matches(p, q.trim()))
  const shown = searched.filter((p) => (cat === 'all' || p.category === cat) && (series === 'all' || p.series === series))
  const seriesWithPosts = STAKYN_SERIES.filter((s) => posts.some((p) => p.series === s.name))
  const yt = STAKYN_INTRO.live.find((l) => l.platform === 'YouTube')

  return (
    <StakynShell>
      {/* hero */}
      <section data-tour="Welcome to Stakyn Labs! One free repo or dev fix a day. Tap me for any repo." data-tour-cta="Ask me for a repo" data-tour-chat className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 pb-12 pt-36 sm:px-10 sm:pt-36 md:grid-cols-[auto_1fr] md:gap-14">
        <div className="stakyn-float mx-auto w-44 sm:w-56 md:mx-0">
          <StakynLogo size={224} ring={false} className="h-auto w-full drop-shadow-[0_18px_40px_rgba(232,106,47,0.35)]" />
        </div>
        <div>
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            stakyn <span style={{ color: SK.lav }}>labs</span>
          </h1>
          <p className="mt-3 max-w-xl text-lg text-white/75">
            Prints and code, stacked layer by layer. One free repo or dev fix a day, with the setup steps right here.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="https://ig.me/m/stakynlabs" data-guide="Want a repo or fix? DM us"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-bold text-[#0b0b0f] transition-transform hover:-translate-y-0.5 active:scale-95 motion-reduce:transition-none"
              style={{ background: SK.lime }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M4 4h16v12H8l-4 4z" />
              </svg>
              Requests open · DM us
            </a>
            {yt && (
              <a
                href={yt.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center rounded-full border px-5 text-sm font-semibold text-white/85 transition-colors hover:text-white"
                style={{ borderColor: SK.line }}
              >
                Start here: what is Stakyn Labs
              </a>
            )}
          </div>
          <div className="mt-6">
            <StakynSocials />
          </div>
        </div>
      </section>

      {/* search + filters */}
      <section id="repos" data-tour="Every repo from the reels. Type the comment keyword here, like GIT." data-tour-cta="Search" className="mx-auto w-full max-w-6xl px-6 pb-6 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Every repo &amp; fix we’ve posted</h2>
            <p className="mt-1 text-sm text-white/55">Saw it on a reel? Find it here, open the repo and follow the setup.</p>
          </div>
          <span className="text-sm text-white/40">{posts.length} posts</span>
        </div>

        <label className="relative mt-5 block">
          <span className="sr-only">Search posts</span>
          <svg className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input
            type="search" data-guide="Saw it on a reel? Search it"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search a tool, problem or comment keyword (e.g. git, localhost, LEAK)"
            className="h-12 w-full rounded-full border bg-transparent pl-11 pr-4 text-[15px] text-white outline-none placeholder:text-white/35 focus:border-[#B7F23E]"
            style={{ borderColor: SK.line, background: SK.panel }}
          />
        </label>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter by category">
          <Chip active={cat === 'all'} onClick={() => setCat('all')} count={searched.length}>
            All
          </Chip>
          {STAKYN_CATEGORIES.map((c) => (
            <Chip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)} count={searched.filter((p) => p.category === c.id).length}>
              {c.label}
            </Chip>
          ))}
        </div>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter by series">
          <Chip active={series === 'all'} onClick={() => setSeries('all')} count={searched.length}>
            Every series
          </Chip>
          {seriesWithPosts.map((s) => (
            <Chip key={s.name} active={series === s.name} onClick={() => setSeries(s.name)} count={searched.filter((p) => p.series === s.name).length}>
              {s.name}
            </Chip>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-16 sm:px-10">
        {shown.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p, i) => (
              <PostCard key={p.slug} p={p} guide={i === 0} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed p-8 text-center text-white/60" style={{ borderColor: SK.line }}>
            Nothing matches that yet.{' '}
            <a href={`mailto:${STAKYN_EMAIL}?subject=${encodeURIComponent('Repo request: ' + q)}`} className="font-semibold underline-offset-2 hover:underline" style={{ color: SK.lime }}>
              Ask for it
            </a>{' '}
            and it might be tomorrow’s video.
          </div>
        )}
      </section>

      {/* series */}
      <section data-tour="Four series. Steal This Repo and Ask Stakyn drop daily." className="mx-auto w-full max-w-6xl px-6 pb-16 sm:px-10">
        <h2 className="text-2xl font-bold">The series</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STAKYN_SERIES.map((s) => {
            const n = posts.filter((p) => p.series === s.name).length
            return (
              <div key={s.name} className="rounded-2xl border p-5" style={{ background: SK.panel, borderColor: SK.line }}>
                <div className="font-bold">{s.name}</div>
                <p className="mt-1 text-sm leading-relaxed text-white/60">{s.blurb}</p>
                <div className="mt-3 text-xs font-semibold" style={{ color: n ? SK.lime : '#ffffff59' }}>
                  {n ? `${n} posted` : 'Coming soon'}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* shop teaser */}
      <section data-tour="We 3D print too: desk, games, Hot Wheels and bike bits." data-tour-cta="Visit the shop" className="mx-auto w-full max-w-6xl px-6 pb-20 sm:px-10">
        <Link
          to="/shop" data-guide="Need a 3D print? This way"
          className="flex flex-col items-start justify-between gap-4 rounded-3xl p-7 transition-transform hover:-translate-y-0.5 sm:flex-row sm:items-center sm:p-9 motion-reduce:transition-none"
          style={{ background: SK.orange }}
        >
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.15em] text-[#0b0b0f]/60">The print shop</div>
            <div className="mt-1 text-2xl font-bold text-[#0b0b0f] sm:text-3xl">3D prints, made on our Bambu A1</div>
            <p className="mt-1 text-sm text-[#0b0b0f]/75">Daily essentials, home games, Hot Wheels props and bike parts. Custom requests welcome.</p>
          </div>
          <span className="inline-flex h-11 shrink-0 items-center rounded-full bg-[#0b0b0f] px-6 text-sm font-bold text-white">Visit the shop</span>
        </Link>
      </section>
    </StakynShell>
  )
}
