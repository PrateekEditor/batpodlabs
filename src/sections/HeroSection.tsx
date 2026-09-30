import { Model } from '../components/scene/Model'
import { SceneCanvas } from '../components/scene/SceneCanvas'

export function HeroSection() {
  return (
    <section data-theme="cream" className="relative flex min-h-screen w-full flex-col overflow-hidden">
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pt-16 text-center sm:pt-20">
        <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
          Prateek
        </h1>
        <div className="mt-3 inline-block rounded-md bg-[#0d1640] px-3 py-1 text-sm font-semibold uppercase tracking-wide text-[#eaf3ff]">
          Salesforce Developer
        </div>
        <p className="mt-6 max-w-md text-base text-[#4a4535]">
          Coder, biker, AI enthusiast — building BatpodLabs one scroll at a time.
        </p>
      </div>

      <div className="relative h-[55vh] min-h-[340px] w-full">
        <SceneCanvas camera={{ position: [1.15, 0.7, 1.75], fov: 36 }}>
          <group position={[0.25, -0.2, 0]}>
            <Model src="/models/Desk.glb" scale={1} rotation={[0, 0.5, 0]} />
            {/* Man.glb has a x100 scale baked into its own node (FBX cm->m
                export quirk) — 0.22 here nets a ~1-unit-tall figure that
                matches the desk's own scale, not a literal "0.22x shrink". */}
            <Model
              src="/models/Man.glb"
              scale={0.22}
              position={[-0.5, -0.53, 0.1]}
              rotation={[0, 0.9, 0]}
            />
          </group>
        </SceneCanvas>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-[#4a4535]">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  )
}
