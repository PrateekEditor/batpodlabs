import type { ReactNode } from 'react'
import { Link } from '../lib/router'
import { STAKYN_EMAIL, STAKYN_LINKS } from '../data/links'
import { SocialIcon } from './SocialIcon'
import { StakynLogo } from './StakynLogo'

/** Stakyn Labs brand colours, used on /stakyn and /shop whatever the site theme. */
export const SK = { bg: '#0b0b0f', panel: '#15151c', line: '#2a2a36', orange: '#E86A2F', lime: '#B7F23E', lav: '#B8A2FF' }

export function StakynSocials({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const box = size === 'sm' ? 'h-9 w-9' : 'h-11 w-11'
  return (
    <div className="flex flex-wrap gap-2.5">
      {STAKYN_LINKS.map((link) => (
        <a
          key={link.key}
          href={link.url}
          target={link.key === 'email' ? undefined : '_blank'}
          rel="noreferrer"
          aria-label={`Stakyn Labs on ${link.label}`}
          title={link.label}
          className={`inline-flex ${box} items-center justify-center rounded-full bg-white/10 text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#B7F23E] hover:text-[#0b0b0f] active:translate-y-0 active:scale-95 motion-reduce:transition-none`}
        >
          <SocialIcon name={link.key} size={size === 'sm' ? 16 : 18} />
        </a>
      ))}
    </div>
  )
}

/** Dark Stakyn Labs frame for the tech hub and the shop: page body, then a Stakyn footer. */
export function StakynShell({ children }: { children: ReactNode }) {
  return (
    <div className="stakyn-page relative min-h-screen overflow-hidden text-white" style={{ background: SK.bg }}>
      {/* faint stars, like the banner */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[620px] opacity-60"
        style={{
          backgroundImage:
            'radial-gradient(1px 1px at 12% 22%, #fff8 50%, transparent 51%), radial-gradient(1px 1px at 78% 14%, #fff6 50%, transparent 51%), radial-gradient(1.5px 1.5px at 64% 40%, #fff5 50%, transparent 51%), radial-gradient(1px 1px at 30% 62%, #fff5 50%, transparent 51%), radial-gradient(1px 1px at 90% 58%, #fff6 50%, transparent 51%), radial-gradient(1px 1px at 46% 8%, #fff7 50%, transparent 51%), radial-gradient(600px 320px at 30% 30%, #2b2560 0%, transparent 70%)',
        }}
      />
      <div className="relative">{children}</div>

      <footer className="relative border-t" style={{ borderColor: SK.line }}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <div className="flex items-center gap-4">
            <StakynLogo size={52} />
            <div>
              <div className="text-lg font-bold">
                stakyn <span style={{ color: SK.lav }}>labs</span>
              </div>
              <a href={`mailto:${STAKYN_EMAIL}`} className="text-sm underline-offset-2 hover:underline" style={{ color: SK.lime }}>
                {STAKYN_EMAIL}
              </a>
            </div>
          </div>
          <StakynSocials size="sm" />
        </div>
        <div className="mx-auto flex w-full max-w-6xl flex-wrap gap-x-5 gap-y-2 px-6 pb-8 text-xs text-white/50 sm:px-10">
          <Link to="/stakyn" className="hover:text-white">Repos &amp; fixes</Link>
          <Link to="/shop" className="hover:text-white">Print shop</Link>
          <Link to="/" className="hover:text-white">Prateek Patel, Salesforce developer</Link>
          <Link to="/batpod" className="hover:text-white">BatPod rides</Link>
        </div>
      </footer>
    </div>
  )
}

export function BackLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="inline-flex items-center gap-1.5 text-sm font-medium text-white/60 transition-colors hover:text-white">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M19 12H5M11 6l-6 6 6 6" />
      </svg>
      {children}
    </Link>
  )
}
