import { useState } from 'react'
import { SHOP_CATEGORIES, SHOP_PRINTER, SHOP_PRODUCTS, type ShopProduct, type ShopStatus } from '../data/shop'
import { STAKYN_EMAIL } from '../data/links'
import { usePageTitle } from '../lib/usePageTitle'
import { SK, StakynShell } from '../components/StakynShell'
import { StakynLogo } from '../components/StakynLogo'

const STATUS: Record<ShopStatus, { label: string; color: string; bg: string }> = {
  ready: { label: 'Ready to order', color: '#0b0b0f', bg: SK.lime },
  testing: { label: 'Test prints done', color: SK.lav, bg: '#B8A2FF1f' },
  soon: { label: 'Coming soon', color: '#ffffffa6', bg: '#ffffff14' },
}

const DM = 'https://ig.me/m/stakynlabs'
const mail = (subject: string) => `mailto:${STAKYN_EMAIL}?subject=${encodeURIComponent(subject)}`

function Icon({ d, size = 22 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  )
}

function ProductCard({ p, icon, guide }: { p: ShopProduct; icon: string; guide?: boolean }) {
  const s = STATUS[p.status]
  return (
    <div className="flex flex-col gap-3 rounded-2xl border p-5" style={{ background: SK.panel, borderColor: SK.line }}>
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: '#E86A2F26', color: SK.orange }}>
          <Icon d={icon} />
        </span>
        <span className="rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: s.bg, color: s.color }}>
          {s.label}
        </span>
      </div>
      <div>
        <h3 className="text-base font-bold leading-snug">{p.name}</h3>
        {p.note && <p className="mt-1 text-sm leading-relaxed text-white/60">{p.note}</p>}
      </div>
      <div className="mt-auto flex items-center justify-between pt-1">
        <span className="text-sm font-semibold text-white/80">{p.price ? `₹${p.price}` : 'DM for price'}</span>
        <a href={mail(`Order: ${p.name} (${p.key})`)} data-guide={guide ? 'Ask about any piece' : undefined} className="text-sm font-bold underline-offset-2 hover:underline" style={{ color: SK.lime }}>
          Ask about this
        </a>
      </div>
    </div>
  )
}

export function ShopPage() {
  usePageTitle('Stakyn Labs print shop: 3D prints made to order')
  const [cat, setCat] = useState<string>('all')
  const cats = SHOP_CATEGORIES.filter((c) => SHOP_PRODUCTS.some((p) => p.category === c.id))
  const shownCats = cat === 'all' ? cats : cats.filter((c) => c.id === cat)

  return (
    <StakynShell>
      <section data-tour="Our print shop! Everything is made to order on a Bambu A1." data-tour-cta="Order in a DM" className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 pb-12 pt-36 sm:px-10 sm:pt-36 md:grid-cols-[1fr_auto]">
        <div>
          <span className="text-sm font-bold uppercase tracking-[0.15em]" style={{ color: SK.orange }}>
            Stakyn Labs · print shop
          </span>
          <h1 className="mt-2 text-4xl font-bold leading-[1.06] tracking-tight sm:text-6xl">
            Printed layer by layer,
            <br />
            <span style={{ color: SK.lime }}>made to order.</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/70">
            Useful prints for your desk, your games, your Hot Wheels and your bike, made on our {SHOP_PRINTER}. Pick a colour, we print it, you get it.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={DM} target="_blank" rel="noreferrer" data-guide="Order in one DM" className="inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-bold text-[#0b0b0f] transition-transform hover:-translate-y-0.5 active:scale-95 motion-reduce:transition-none" style={{ background: SK.lime }}>
              Order on Instagram DM
            </a>
            <a href={mail('Custom 3D print request')} className="inline-flex h-11 items-center rounded-full border px-5 text-sm font-semibold text-white/85 hover:text-white" style={{ borderColor: SK.line }}>
              Email a custom request
            </a>
          </div>
        </div>
        <div className="stakyn-float mx-auto hidden w-44 md:block">
          <StakynLogo size={176} />
        </div>
      </section>

      {/* how ordering works */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-12 sm:px-10">
        <ol className="grid gap-3 sm:grid-cols-3">
          {[
            ['Tell us what you want', 'DM or email the product, or send a photo or link of what you need printed.'],
            ['Pick colour and size', 'We confirm the colour, size and price before printing anything.'],
            ['We print and send it', 'Printed, checked and packed. We agree pickup or delivery with you.'],
          ].map(([t, b], i) => (
            <li key={t} className="flex gap-3.5 rounded-2xl border p-5" style={{ borderColor: SK.line }}>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-[#0b0b0f]" style={{ background: SK.orange }}>
                {i + 1}
              </span>
              <div>
                <div className="font-bold">{t}</div>
                <p className="mt-0.5 text-sm leading-relaxed text-white/60">{b}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-6 sm:px-10">
        <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter by category">
          {[{ id: 'all', name: 'Everything' }, ...cats].map((c) => {
            const active = cat === c.id
            const n = c.id === 'all' ? SHOP_PRODUCTS.length : SHOP_PRODUCTS.filter((p) => p.category === c.id).length
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={active}
                onClick={() => setCat(c.id)}
                className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold ${active ? 'border-transparent text-[#0b0b0f]' : 'text-white/70 hover:text-white'}`}
                style={active ? { background: SK.lime } : { borderColor: SK.line }}
              >
                {c.name}
                <span className={`text-xs ${active ? 'text-[#0b0b0f]/60' : 'text-white/35'}`}>{n}</span>
              </button>
            )
          })}
        </div>
      </section>

      <section data-tour="Pick a category, then tap Ask about this on anything you like." data-tour-cta="Ask about a piece" className="mx-auto w-full max-w-6xl space-y-10 px-6 pb-16 sm:px-10">
        {shownCats.map((c) => (
          <div key={c.id}>
            <h2 className="text-xl font-bold">{c.name}</h2>
            <p className="mt-0.5 text-sm text-white/55">{c.blurb}</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SHOP_PRODUCTS.filter((p) => p.category === c.id).map((p, i) => (
                <ProductCard key={p.key} p={p} icon={c.icon} guide={i === 0} />
              ))}
            </div>
          </div>
        ))}
      </section>

      <section data-tour="Broken clip or a custom name tag? Send a photo, we’ll print it." data-tour-cta="Custom request" className="mx-auto w-full max-w-6xl px-6 pb-20 sm:px-10">
        <div className="rounded-3xl p-7 sm:p-9" style={{ background: SK.orange }}>
          <div className="text-2xl font-bold text-[#0b0b0f] sm:text-3xl">Need something that isn’t here?</div>
          <p className="mt-1 max-w-xl text-sm text-[#0b0b0f]/75">
            A broken clip, a missing knob, a custom name tag. Send a photo and the size, and we’ll tell you if we can print it.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href={DM} target="_blank" rel="noreferrer" data-guide="Custom prints too" className="inline-flex h-11 items-center rounded-full bg-[#0b0b0f] px-6 text-sm font-bold text-white">
              DM @stakynlabs
            </a>
            <a href={mail('Custom 3D print request')} className="inline-flex h-11 items-center rounded-full border-2 border-[#0b0b0f] px-6 text-sm font-bold text-[#0b0b0f]">
              {STAKYN_EMAIL}
            </a>
          </div>
        </div>
      </section>
    </StakynShell>
  )
}
