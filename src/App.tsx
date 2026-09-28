import { useLenis } from './lib/useLenis'
import { Scene } from './components/Scene'

function App() {
  useLenis()

  return (
    <main>
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <Scene />
        </div>
        <div className="relative z-10 flex h-full flex-col items-start justify-end px-8 pb-20 sm:px-16">
          <p className="mb-3 text-sm tracking-wide text-white/60">
            developer &middot; biker &middot; builder
          </p>
          <h1 className="max-w-xl text-5xl font-semibold leading-tight sm:text-7xl">
            BatpodLabs
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-8 py-32 sm:px-0">
        <h2 className="mb-4 text-2xl font-medium">Scaffold is live</h2>
        <p className="text-white/70">
          React + Vite + TypeScript + Tailwind, with Lenis smooth scroll and a
          react-three-fiber canvas wired in above. This is the starting point —
          real sections (portfolio, motovlog, the rest) come next as tickets
          move through the board.
        </p>
      </section>
    </main>
  )
}

export default App
