import { Character } from '../components/Character'
import { CONTACT_LINKS } from '../data/links'

export function HeroSection() {
  return (
    <section className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 pb-16 pt-28 sm:px-10 sm:pt-36 md:grid-cols-2 md:gap-6 md:pb-24">
      <div className="order-2 flex flex-col items-start gap-5 md:order-1">
        <span className="inline-block rounded-full bg-navy px-4 py-1.5 text-sm font-semibold text-cream">
          Salesforce Developer + AI Automation Engineer
        </span>
        <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-ink sm:text-6xl">
          Hi, I&apos;m<br />
          <span className="text-amber-text">Prateek Patel</span>
        </h1>
        <blockquote className="max-w-lg border-l-2 border-amber py-1 pl-4 text-lg font-medium leading-snug text-ink sm:text-xl">
          I teach AI to do the repetitive Salesforce work — org health checks, CPQ
          fixes, automation debugging — so developers spend their time on what
          actually needs one.
        </blockquote>
        <p className="max-w-md text-base leading-relaxed text-muted">
          4+ years building scalable Salesforce &amp; CPQ solutions — Apex, LWC, Flows,
          integrations, and the AI tooling layered on top of them.
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <a
            href="#skills"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-amber px-6 text-sm font-semibold text-navy shadow-md shadow-amber/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-hover hover:shadow-lg active:translate-y-0 active:scale-95 motion-reduce:transition-none"
          >
            See my skills
          </a>
          {CONTACT_LINKS.slice(0, 2).map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="group relative inline-flex h-11 items-center gap-2 rounded-full border border-navy/15 px-5 text-sm font-medium text-ink transition-colors duration-200 hover:border-amber hover:text-amber-text"
            >
              <span className="relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-amber after:transition-all after:duration-200 group-hover:after:w-full">
                {link.label}
              </span>
            </a>
          ))}
        </div>
      </div>

      <div className="order-1 md:order-2">
        <Character />
      </div>
    </section>
  )
}
