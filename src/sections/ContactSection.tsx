import { CONTACT_LINKS, STAKYN_EMAIL, STAKYN_LINKS } from '../data/links'
import { Link } from '../lib/router'
import { StakynLogo } from '../components/StakynLogo'
import { SocialIcon } from '../components/SocialIcon'

const YEAR = new Date().getFullYear()

export function ContactSection() {
  return (
    <footer id="contact" className="border-t border-ink/10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-6 py-14 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <div>
          <h2 className="text-2xl font-bold text-ink">Let&apos;s connect</h2>
          <p className="mt-1 max-w-sm text-sm text-muted">
            Open to Salesforce &amp; CPQ work, integrations, and the occasional AI side-quest.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {CONTACT_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-navy px-6 text-sm font-semibold text-on-navy transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber hover:text-on-amber active:translate-y-0 active:scale-95 motion-reduce:transition-none"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
      {/* Stakyn Labs — the tech channel */}
      <div className="mx-auto w-full max-w-6xl px-6 pb-12 sm:px-10">
        <div className="flex flex-col items-start gap-5 rounded-3xl bg-[#0b0b0f] p-6 text-white sm:flex-row sm:items-center sm:gap-7 sm:p-8">
          <div className="stakyn-float shrink-0">
            <StakynLogo size={84} className="drop-shadow-[0_8px_18px_rgba(232,106,47,0.35)]" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-bold">
              stakyn <span className="text-[#B8A2FF]">labs</span>
            </h3>
            <p className="mt-1 text-sm text-white/70">
              My tech channel. Prints and code, stacked layer by layer.
            </p>
            <a
              href={`mailto:${STAKYN_EMAIL}`}
              className="mt-2 inline-block text-sm font-medium text-[#B7F23E] underline-offset-2 hover:underline"
            >
              {STAKYN_EMAIL}
            </a>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {STAKYN_LINKS.map((link) => (
              <a
                key={link.key}
                href={link.url}
                target={link.key === 'email' ? undefined : '_blank'}
                rel="noreferrer"
                aria-label={`Stakyn Labs on ${link.label}`}
                title={link.label}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#B7F23E] hover:text-[#0b0b0f] active:translate-y-0 active:scale-95 motion-reduce:transition-none"
              >
                <SocialIcon name={link.key} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-6xl px-6 pb-8 text-xs text-muted sm:px-10">
        © {YEAR} Prateek Patel — BatpodLabs
        {/* TODO: temporary link so the 404 page can be tested — remove later */}
        <span className="mx-2">·</span>
        <Link to="/404" className="underline-offset-2 hover:text-amber-text hover:underline">
          404 page (test)
        </Link>
      </div>
    </footer>
  )
}
