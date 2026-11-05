import type { ReactNode } from 'react'
import { RIDES, TRAVEL, type JourneyEntry } from '../data/journey'
import { BATPOD_LINKS } from '../data/links'
import { BATPOD_BASES, BATPOD_BIKE, BATPOD_TAGLINE, GEAR } from '../data/batpod'
import { SocialIcon } from '../components/SocialIcon'
import { usePageTitle } from '../lib/usePageTitle'
import { useReveal } from '../lib/useReveal'

// Asphalt, chalk and fuel orange. Fixed colours: this page keeps its look in light and dark.
const C = { tar: '#111111', smoke: '#1b1b1b', edge: '#2c2c2c', chalk: '#EDE6DA', dim: '#EDE6DA99', fuel: '#FF6A1A', hazard: '#F5C518' }
const moto = { fontFamily: '"Oswald", "Space Grotesk", sans-serif' }

const YT = BATPOD_LINKS.find((l) => l.key === 'youtube')!
const IG = BATPOD_LINKS.find((l) => l.key === 'instagram')!

/** Rev counter for "Chasing the RPM": the needle swings up to the red line, then idles. */
function Tacho() {
  const cx = 160
  const cy = 160
  const r = 128
  const start = 225 // degrees, 0 rpm
  const sweep = 270 // to 10k rpm
  const pt = (deg: number, rr: number) => {
    const a = ((deg - 90) * Math.PI) / 180
    return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)]
  }
  const arc = (from: number, to: number, rr: number) => {
    const [x1, y1] = pt(from, rr)
    const [x2, y2] = pt(to, rr)
    return `M${x1} ${y1} A${rr} ${rr} 0 ${to - from > 180 ? 1 : 0} 1 ${x2} ${y2}`
  }
  const at = (rpm: number) => start + (rpm / 10) * sweep
  return (
    <svg viewBox="0 0 320 320" className="h-auto w-full max-w-[340px]" aria-label="Rev counter: chasing the RPM" role="img">
      <circle cx={cx} cy={cy} r={r + 18} fill={C.smoke} stroke={C.edge} strokeWidth="2" />
      <path d={arc(at(0), at(8), r)} stroke={C.chalk} strokeOpacity="0.25" strokeWidth="10" fill="none" />
      <path d={arc(at(8), at(10), r)} stroke={C.fuel} strokeWidth="10" fill="none" />
      {Array.from({ length: 11 }, (_, i) => {
        const [x1, y1] = pt(at(i), r - 14)
        const [x2, y2] = pt(at(i), r - 30)
        const [tx, ty] = pt(at(i), r - 48)
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={i >= 8 ? C.fuel : C.chalk} strokeWidth="4" strokeLinecap="round" />
            <text x={tx} y={ty + 7} textAnchor="middle" fill={i >= 8 ? C.fuel : C.chalk} fontSize="20" fontWeight="600" style={moto}>
              {i}
            </text>
          </g>
        )
      })}
      <text x={cx} y={cy + 42} textAnchor="middle" fill={C.dim} fontSize="12" letterSpacing="3" style={moto}>
        × 1000 RPM
      </text>
      <g className="tacho-idle" style={{ transformOrigin: `${cx}px ${cy}px` }}>
        <g className="tacho-needle" style={{ transformOrigin: `${cx}px ${cy}px` }}>
          <line x1={cx} y1={cy} x2={cx} y2={cy - r + 22} stroke={C.fuel} strokeWidth="5" strokeLinecap="round" />
        </g>
      </g>
      <circle cx={cx} cy={cy} r="13" fill={C.tar} stroke={C.fuel} strokeWidth="4" />
    </svg>
  )
}

function Plate({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-3 rounded-md border-[3px] border-[#111] bg-[#F5C518] px-4 py-1.5 text-[#111] shadow-[0_0_0_2px_#F5C518]" style={moto}>
      <span className="text-xs font-bold leading-none">IND</span>
      <span className="text-2xl font-bold tracking-[0.2em] sm:text-3xl">{children}</span>
    </span>
  )
}

function SectionTitle({ kicker, children }: { kicker: string; children: ReactNode }) {
  return (
    <div>
      <div className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ ...moto, color: C.fuel }}>
        {kicker}
      </div>
      <h2 className="mt-1 text-4xl font-bold uppercase leading-none sm:text-5xl" style={{ ...moto, color: C.chalk }}>
        {children}
      </h2>
    </div>
  )
}

function LogEntry({ e }: { e: JourneyEntry }) {
  const ref = useReveal<HTMLElement>()
  return (
    <article ref={ref} className="reveal overflow-hidden rounded-xl border" style={{ background: C.smoke, borderColor: C.edge }}>
      {e.image && <img src={e.image} alt="" loading="lazy" className="h-48 w-full object-cover" />}
      <div className="p-5">
        <div className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ ...moto, color: C.fuel }}>
          {new Date(e.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {e.place}
          {e.distanceKm ? ` · ${e.distanceKm} km` : ''}
        </div>
        <h3 className="mt-1.5 text-xl font-bold uppercase" style={{ ...moto, color: C.chalk }}>
          {e.title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed" style={{ color: C.dim }}>
          {e.note}
        </p>
      </div>
    </article>
  )
}

function Log({ title, items, empty }: { title: string; items: JourneyEntry[]; empty: ReactNode }) {
  const sorted = [...items].sort((a, b) => b.date.localeCompare(a.date))
  return (
    <div>
      <h3 className="text-2xl font-bold uppercase" style={{ ...moto, color: C.chalk }}>
        {title}
      </h3>
      <div className="mt-4 space-y-4">
        {sorted.length ? (
          sorted.map((e) => <LogEntry key={e.title + e.date} e={e} />)
        ) : (
          <div className="rounded-xl border-2 border-dashed p-6 text-sm leading-relaxed" style={{ borderColor: C.edge, color: C.dim }}>
            {empty}
          </div>
        )}
      </div>
    </div>
  )
}

function RideButton({ href, primary, children }: { href: string; primary?: boolean; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-13 -skew-x-6 items-center gap-2.5 px-6 py-3.5 text-base font-bold uppercase tracking-[0.12em] transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0 motion-reduce:transition-none"
      style={{ ...moto, background: primary ? C.fuel : 'transparent', color: primary ? C.tar : C.chalk, border: `2px solid ${primary ? C.fuel : C.chalk}` }}
    >
      <span className="inline-flex skew-x-6 items-center gap-2.5">{children}</span>
    </a>
  )
}

export function BatpodPage() {
  usePageTitle('BatPod With PP: rides, roads and the gear I ride with')

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: C.tar, color: C.chalk }}>
      {/* hero: the road at night */}
      <section className="relative">
        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMax slice" aria-hidden>
          <defs>
            <linearGradient id="bp-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#111" />
              <stop offset="0.55" stopColor="#1d1410" />
              <stop offset="1" stopColor="#111" />
            </linearGradient>
          </defs>
          <rect width="1200" height="700" fill="url(#bp-sky)" />
          <circle cx="860" cy="360" r="260" fill={C.fuel} opacity="0.08" />
          {/* road */}
          <path d="M830 380 L890 380 L1300 700 L560 700 Z" fill="#1a1a1a" />
          <path d="M830 380 L560 700 M890 380 L1300 700" stroke={C.chalk} strokeOpacity="0.3" strokeWidth="4" />
          <path className="road-dash" d="M860 380 L930 700" stroke={C.hazard} strokeOpacity="0.8" strokeWidth="8" strokeDasharray="34 40" />
        </svg>

        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-8 px-6 pb-24 pt-32 sm:px-10 sm:pt-36 md:grid-cols-[1.25fr_1fr]">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.35em]" style={{ ...moto, color: C.fuel }}>
              Motovlogs · rides · road trips
            </div>
            <h1 className="mt-3 text-[clamp(4.5rem,15vw,9.5rem)] font-bold uppercase leading-[0.85] tracking-tight" style={moto}>
              Batpod
              <span className="block text-[0.48em] tracking-[0.08em]" style={{ color: C.fuel }}>
                with PP
              </span>
            </h1>
            <p className="mt-6 max-w-md text-xl font-medium uppercase leading-snug tracking-wide sm:text-2xl" style={moto}>
              {BATPOD_TAGLINE}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <RideButton href={YT.url} primary>
                <SocialIcon name="youtube" size={20} /> Watch the rides
              </RideButton>
              <RideButton href={IG.url}>
                <SocialIcon name="instagram" size={20} /> Follow the road
              </RideButton>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {BATPOD_BASES.map((b) => (
                <span key={b} className="rounded-sm border-2 px-3 py-1 text-sm font-bold uppercase tracking-[0.2em]" style={{ ...moto, borderColor: C.chalk, color: C.chalk }}>
                  {b}
                </span>
              ))}
            </div>
          </div>
          <div className="mx-auto w-full max-w-[340px]">
            <Tacho />
          </div>
        </div>
      </section>

      {/* hazard strip */}
      <div aria-hidden className="h-3 w-full" style={{ background: `repeating-linear-gradient(-45deg, ${C.hazard} 0 18px, ${C.tar} 18px 36px)` }} />

      {/* the machine + gear */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 sm:py-24">
        <div className="grid gap-8 md:grid-cols-[1fr_1.3fr]">
          <div className="rounded-2xl border p-7 sm:p-8" style={{ background: C.smoke, borderColor: C.edge }}>
            <SectionTitle kicker="The machine">{BATPOD_BIKE.model}</SectionTitle>
            <div className="mt-6">
              <Plate>{BATPOD_BIKE.name.toUpperCase()}</Plate>
            </div>
            <p className="mt-6 text-base leading-relaxed" style={{ color: C.dim }}>
              {BATPOD_BIKE.blurb}
            </p>
            <a href={IG.url} target="_blank" rel="noreferrer" className="mt-5 inline-block text-sm font-bold uppercase tracking-[0.15em] underline-offset-4 hover:underline" style={{ ...moto, color: C.fuel }}>
              #WhereIsYourDominar
            </a>
          </div>

          <div className="rounded-2xl border p-7 sm:p-8" style={{ background: C.smoke, borderColor: C.edge }}>
            <SectionTitle kicker="What I ride with">Gear &amp; brands</SectionTitle>
            {GEAR.length ? (
              <ul className="mt-6 divide-y" style={{ borderColor: C.edge }}>
                {GEAR.map((g) => (
                  <li key={g.kind + g.name} className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t py-3.5 first:border-t-0" style={{ borderColor: C.edge }}>
                    <span className="w-28 shrink-0 text-xs font-bold uppercase tracking-[0.2em]" style={{ ...moto, color: C.fuel }}>
                      {g.kind}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">
                        {g.brand ? `${g.brand} ` : ''}
                        {g.name}
                      </span>
                      {g.note && (
                        <span className="block text-sm" style={{ color: C.dim }}>
                          {g.note}
                        </span>
                      )}
                    </span>
                    {g.code && (
                      <span className="rounded-sm px-2 py-0.5 text-xs font-bold tracking-wider" style={{ ...moto, background: C.hazard, color: C.tar }}>
                        CODE {g.code}
                      </span>
                    )}
                    {g.link && (
                      <a href={g.link} target="_blank" rel="noreferrer" className="text-sm font-bold uppercase tracking-wider underline-offset-4 hover:underline" style={{ ...moto, color: C.fuel }}>
                        Get it
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 text-base leading-relaxed" style={{ color: C.dim }}>
                Helmet, riding gear, camera and mounts: the full list is coming soon. Spotted something in a video?{' '}
                <a href={IG.url} target="_blank" rel="noreferrer" className="font-semibold underline-offset-4 hover:underline" style={{ color: C.chalk }}>
                  Ask me on Instagram
                </a>
                .
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ride log */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-16 sm:px-10 sm:pb-24">
        <SectionTitle kicker="Kilometres, not clicks">The ride log</SectionTitle>
        <div className="mt-8 grid gap-10 md:grid-cols-2">
          <Log
            title="Rides"
            items={RIDES}
            empty={
              <>
                The first ride write-up is on its way. Till then, every ride is on{' '}
                <a href={YT.url} target="_blank" rel="noreferrer" className="font-semibold hover:underline" style={{ color: C.chalk }}>
                  YouTube
                </a>
                .
              </>
            }
          />
          <Log title="Road trips" items={TRAVEL} empty="Road trip stories and a map of every place the Batpod has been are coming soon." />
        </div>
      </section>

      {/* brands */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-20 sm:px-10">
        <div className="flex -skew-y-1 flex-col items-start justify-between gap-5 p-8 sm:flex-row sm:items-center sm:p-10" style={{ background: C.fuel, color: C.tar }}>
          <div className="skew-y-1">
            <div className="text-4xl font-bold uppercase leading-none sm:text-5xl" style={moto}>
              Ride with us
            </div>
            <p className="mt-2 max-w-md text-base font-medium">Brands, gear, a destination or a group ride to feature? Send a DM.</p>
          </div>
          <a
            href="https://ig.me/m/batpod.with.pp"
            target="_blank"
            rel="noreferrer"
            className="inline-flex skew-y-1 items-center gap-2 px-6 py-3.5 text-base font-bold uppercase tracking-[0.12em] transition-transform hover:-translate-y-0.5"
            style={{ ...moto, background: C.tar, color: C.chalk }}
          >
            <SocialIcon name="instagram" size={18} /> DM {IG.handle}
          </a>
        </div>
      </section>

      <footer className="border-t" style={{ borderColor: C.edge }}>
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-5 px-6 py-10 sm:flex-row sm:items-center sm:px-10">
          <div>
            <div className="text-2xl font-bold uppercase" style={moto}>
              Batpod <span style={{ color: C.fuel }}>with PP</span>
            </div>
            <div className="mt-1 text-sm" style={{ color: C.dim }}>
              Ride safe. Gear up. See you on the road.
            </div>
          </div>
          <div className="flex gap-3">
            {BATPOD_LINKS.map((l) => (
              <a
                key={l.key}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`BatPod With PP on ${l.label}`}
                className="flex h-11 w-11 items-center justify-center rounded-full border-2 transition-colors hover:bg-[#FF6A1A] hover:text-[#111]"
                style={{ borderColor: C.edge }}
              >
                <SocialIcon name={l.key} size={19} />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
