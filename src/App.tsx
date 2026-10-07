import { useLenis } from './lib/useLenis'
import { HeroSection } from './sections/HeroSection'
import { PipelineSection } from './sections/PipelineSection'
import { SkillsSection } from './sections/SkillsSection'
import { ContactSection } from './sections/ContactSection'
import { ProjectsSection } from './sections/ProjectsSection'
import { PersonalSection } from './sections/PersonalSection'
import { PipelinePage } from './pages/PipelinePage'
import { ProjectPage } from './pages/ProjectPage'
import { JourneyPage } from './pages/JourneyPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { BotWidget } from './components/BotWidget'
import { ThemeToggle } from './components/ThemeToggle'
import { Link, usePath } from './lib/router'

function App() {
  useLenis()
  const path = usePath().replace(/\/+$/, '') || '/'

  return (
    <main className="relative min-h-screen w-full bg-cream">
      <header className="fixed left-0 top-0 z-20 flex w-full items-center justify-between bg-cream/80 px-6 py-4 backdrop-blur-md sm:px-10 sm:py-5">
        <Link to="/" className="text-sm font-bold uppercase tracking-[0.25em] text-ink">
          Prateek Patel
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
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
      ) : path === '/journey' ? (
        <JourneyPage />
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
