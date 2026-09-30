import { useLenis } from './lib/useLenis'
import { useSectionTheme } from './lib/useSectionTheme'
import { HeroSection } from './sections/HeroSection'
import { StandUpSection } from './sections/StandUpSection'
import { LinksSection } from './sections/LinksSection'
import { BikerSection } from './sections/BikerSection'
import { ProjectsSection } from './sections/ProjectsSection'

function App() {
  useLenis()
  useSectionTheme('theme-backdrop')

  return (
    <main className="relative">
      <div id="theme-backdrop" className="fixed inset-0 -z-10" style={{ background: '#f2e9d8' }} />

      <div
        className="pointer-events-none fixed left-6 top-6 z-20 text-xs font-semibold tracking-[0.2em] text-white opacity-60 sm:left-8 sm:top-8"
        style={{ mixBlendMode: 'difference' }}
      >
        BATPODLABS
      </div>

      <HeroSection />
      <StandUpSection />
      <LinksSection />
      <BikerSection />
      <ProjectsSection />
    </main>
  )
}

export default App
