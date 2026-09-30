import { useLenis } from './lib/useLenis'
import { HeroSection } from './sections/HeroSection'
import { SkillsSection } from './sections/SkillsSection'
import { ContactSection } from './sections/ContactSection'

function App() {
  useLenis()

  return (
    <main className="relative min-h-screen w-full bg-cream">
      <header className="fixed left-0 top-0 z-20 w-full px-6 py-5 sm:px-10">
        <span className="text-sm font-bold uppercase tracking-[0.25em] text-ink">
          Prateek Patel
        </span>
      </header>

      <HeroSection />
      <SkillsSection />
      <ContactSection />
    </main>
  )
}

export default App
