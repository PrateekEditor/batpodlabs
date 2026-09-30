import { CONTACT_LINKS } from '../data/links'

const YEAR = new Date().getFullYear()

export function ContactSection() {
  return (
    <footer className="border-t border-navy/10">
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
              className="inline-flex h-11 items-center gap-2 rounded-full bg-navy px-6 text-sm font-semibold text-cream transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber hover:text-navy active:translate-y-0 active:scale-95 motion-reduce:transition-none"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
      <div className="mx-auto w-full max-w-6xl px-6 pb-8 text-xs text-muted sm:px-10">
        © {YEAR} Prateek Patel — BatpodLabs
      </div>
    </footer>
  )
}
