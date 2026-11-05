import { useLenis } from './lib/useLenis'
import { HeroSection } from './sections/HeroSection'
import { PipelineSection } from './sections/PipelineSection'
import { SkillsSection } from './sections/SkillsSection'
import { ContactSection } from './sections/ContactSection'
import { ProjectsSection } from './sections/ProjectsSection'
import { PersonalSection } from './sections/PersonalSection'
import { PipelinePage } from './pages/PipelinePage'
import { ProjectPage } from './pages/ProjectPage'
import { BatpodPage } from './pages/BatpodPage'
import { StakynHubPage } from './pages/StakynHubPage'
import { StakynPostPage } from './pages/StakynPostPage'
import { ShopPage } from './pages/ShopPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { BotWidget } from './components/BotWidget'
import { ThemeToggle } from './components/ThemeToggle'
import { Link, usePath } from './lib/router'

function App() {
  useLenis()
  const path = usePath().replace(/\/+$/, '') || '/'
  const dark = path === '/shop' || path === '/stakyn' || path.startsWith('/stakyn/')
  const NAV = [
    { to: '/', label: 'Work', on: path === '/' || path.startsWith('/projects') || path === '/pipeline' },
    { to: '/stakyn', label: 'Stakyn Labs', on: path.startsWith('/stakyn') },
    { to: '/shop', label: 'Print shop', on: path === '/shop' },
    { to: '/batpod', label: 'BatPod', on: path === '/batpod' || path === '/journey' },
  ]

  return (
    <main className="relative min-h-screen w-full bg-cream">
      <header className={`fixed left-0 top-0 z-20 w-full backdrop-blur-md ${dark ? 'bg-[#0b0b0f]/80 text-white' : 'bg-cream/80 text-ink'}`}>
        <div className="flex w-full items-center justify-between gap-4 px-6 py-4 sm:px-10 sm:py-5">
        <Link to={dark ? '/stakyn' : '/'} className="shrink-0 text-sm font-bold uppercase tracking-[0.25em]">
          {dark ? (
            <span className="normal-case tracking-tight text-base">stakyn <span className="text-[#B8A2FF]">labs</span></span>
          ) : (
            'Prateek Patel'
          )}
        </Link>
        <nav aria-label="Site" className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              aria-current={n.on ? 'page' : undefined}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${n.on ? (dark ? 'bg-white/10 text-white' : 'bg-ink/[0.07] text-ink') : dark ? 'text-white/60 hover:text-white' : 'text-muted hover:text-ink'}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className={`items-center gap-2 sm:gap-3 ${dark ? "hidden" : "flex"}`}>
          <ThemeToggle />
          <a
            href="/Prateek_Patel_Resume.pdf"
            download
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-navy px-4 text-xs font-semibold text-on-navy shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber hover:text-on-amber active:translate-y-0 active:scale-95 motion-reduce:transition-none sm:h-10 sm:px-5 sm:text-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 3v12" />
              <path d="M7 10l5 5 5-5" />
              <path d="M5 21h14" />
            </svg>
            Resume
          </a>
        </div>
        </div>
        {/* phones: the same links as a scrollable row */}
        <nav aria-label="Site" className="flex gap-1 overflow-x-auto px-4 pb-2.5 md:hidden">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              aria-current={n.on ? 'page' : undefined}
              className={`shrink-0 rounded-full px-3 py-1 text-[13px] font-semibold ${n.on ? (dark ? 'bg-white/10 text-white' : 'bg-ink/[0.07] text-ink') : dark ? 'text-white/60' : 'text-muted'}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </header>

      {path === '/' ? (
        <>
          <HeroSection />
          <PipelineSection />
          <ProjectsSection />
          <SkillsSection />
          <PersonalSection />
          <ContactSection />
        </>
      ) : path === '/pipeline' ? (
        <PipelinePage />
      ) : path === '/batpod' || path === '/journey' ? (
        <BatpodPage />
      ) : path === '/stakyn' ? (
        <StakynHubPage />
      ) : path.startsWith('/stakyn/') ? (
        <StakynPostPage slug={path.slice('/stakyn/'.length)} />
      ) : path === '/shop' ? (
        <ShopPage />
      ) : path.startsWith('/projects/') ? (
        <ProjectPage slug={path.slice('/projects/'.length)} />
      ) : (
        <NotFoundPage />
      )}

      <BotWidget />
    </main>
  )
}

export default App
