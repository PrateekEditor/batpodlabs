import { useLenis } from './lib/useLenis'
import { Scene } from './components/Scene'
import { HeroNav } from './components/hero/HeroNav'

function Section({
  id,
  eyebrow,
  title,
  children,
  accent,
}: {
  id: string
  eyebrow: string
  title: string
  children: React.ReactNode
  accent: string
}) {
  return (
    <section id={id} className="mx-auto max-w-3xl px-8 py-28 sm:px-0 scroll-mt-10">
      <p className="mb-3 text-xs font-semibold tracking-[0.18em] uppercase" style={{ color: accent }}>
        {eyebrow}
      </p>
      <h2 className="mb-5 text-3xl font-semibold sm:text-4xl">{title}</h2>
      <div className="space-y-4 text-white/70 leading-relaxed">{children}</div>
    </section>
  )
}

function App() {
  useLenis()

  return (
    <main>
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <Scene />
        </div>
        <HeroNav />
        <div className="pointer-events-none relative z-10 flex h-full flex-col items-start justify-end px-8 pb-20 sm:px-16">
          <p className="mb-3 text-sm tracking-wide text-white/70">developer &middot; biker &middot; builder</p>
          <h1 className="max-w-xl text-5xl font-semibold leading-tight text-white sm:text-7xl">BatpodLabs</h1>
          <p className="mt-3 max-w-sm text-sm text-white/60">Pick a side to explore — or keep scrolling.</p>
        </div>
      </section>

      <Section id="coder" eyebrow="01 — Build" title="Coder" accent="#55ac9f">
        <p>
          Placeholder copy — this becomes the developer portfolio: Salesforce work, the Real Field Tracker package,
          side projects, and the stack behind this very site.
        </p>
        <p>Fake project cards, a skills strip, and links to GitHub go here once the content ticket is picked up.</p>
      </Section>

      <Section id="biker" eyebrow="02 — Ride" title="Biker" accent="#d67f74">
        <p>
          Placeholder copy — the motovlog journey. Ride logs, the Batpod itself, routes, and video content will
          live in this section.
        </p>
        <p>Eventually pulls in real content once the Batpod social project has something to feed it.</p>
      </Section>

      <Section id="ecommerce" eyebrow="03 — Shop" title="E-Commerce" accent="#d6c23d">
        <p>
          Placeholder copy — products to buy later: merch, gear, or whatever comes out of the builder side of
          things. Parked until there's something real to sell.
        </p>
        <p>Checkout, product schema, and payment-form security tickets are already parked for when this goes live.</p>
      </Section>

      <Section id="about" eyebrow="04 — Who" title="About Me" accent="#9186d9">
        <p>
          Placeholder copy — the short version of who's behind BatpodLabs: coder, biker, AI enthusiast, and
          whatever else earns a mention.
        </p>
        <p>Real bio copy comes once Fix Things settles on consistent language across profiles.</p>
      </Section>
    </main>
  )
}

export default App
