import { CONTACT_LINKS } from '../data/links'
import { Link } from '../lib/router'
import { StakynLogo } from '../components/StakynLogo'

const YEAR = new Date().getFullYear()

export function ContactSection() {
  return (
    <footer id="contact" data-tour="Need a Salesforce hand? LinkedIn is the quickest way to reach him." data-tour-cta="Say hi" className="border-t border-ink/10">
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
              key={link.label} data-guide={link.label === 'LinkedIn' ? "Say hi on LinkedIn" : undefined}
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
      {/* the other sides: tech channel, print shop, rides */}
      <div className="mx-auto w-full max-w-6xl px-6 pb-12 sm:px-10">
        <div className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">Also me</div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Link to="/stakyn" data-guide="My tech channel lives here" className="group flex items-center gap-3.5 rounded-2xl bg-[#0b0b0f] p-4 text-white transition-transform hover:-translate-y-0.5 motion-reduce:transition-none">
            <span className="stakyn-float shrink-0"><StakynLogo size={44} /></span>
            <span className="min-w-0">
              <span className="block font-bold">stakyn <span className="text-[#B8A2FF]">labs</span></span>
              <span className="block text-sm text-white/60">Tech channel: free repos &amp; dev fixes</span>
            </span>
          </Link>
          <Link to="/shop" className="group flex items-center gap-3.5 rounded-2xl bg-[#E86A2F] p-4 text-[#0b0b0f] transition-transform hover:-translate-y-0.5 motion-reduce:transition-none">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0b0b0f]/10">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5" /></svg>
            </span>
            <span className="min-w-0">
              <span className="block font-bold">Print shop</span>
              <span className="block text-sm text-[#0b0b0f]/70">3D prints, made to order</span>
            </span>
          </Link>
          <Link to="/batpod" className="group flex items-center gap-3.5 rounded-2xl bg-navy p-4 text-on-navy transition-transform hover:-translate-y-0.5 motion-reduce:transition-none">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber text-[#0d1640]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5.5 17a3.5 3.5 0 1 0 0-.01M18.5 17a3.5 3.5 0 1 0 0-.01M5.5 17L9 9h6l3.5 8M9 9L7.5 6H5" /></svg>
            </span>
            <span className="min-w-0">
              <span className="block font-bold">BatPod With PP</span>
              <span className="block text-sm text-on-navy/70">Rides, motovlogs &amp; gear</span>
            </span>
          </Link>
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
