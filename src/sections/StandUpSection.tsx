import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DissolveCharacter } from '../components/scene/DissolveCharacter'
import { SceneCanvas } from '../components/scene/SceneCanvas'

gsap.registerPlugin(ScrollTrigger)

/**
 * The "stand up" moment: character materializes from a blue hologram shell
 * into the full lit model as you scroll, tracked by a progress bar — the
 * dissolve-reveal stand-in described in DissolveCharacter (no skeleton to
 * animate a literal sit-to-stand pose from).
 */
export function StandUpSection() {
  const [progress, setProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
        invalidateOnRefresh: true,
        onUpdate: (self) => setProgress(self.progress),
      })
      requestAnimationFrame(() => ScrollTrigger.refresh())
      return () => trigger.kill()
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      data-theme="navy"
      className="relative min-h-[240vh] w-full overflow-hidden"
    >
      <div className="sticky top-0 h-screen w-full">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(95,216,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(95,216,255,0.08) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 55%, black 40%, transparent 80%)',
          }}
        />

        <SceneCanvas camera={{ position: [0, 0, 2.6], fov: 32 }}>
          <DissolveCharacter progress={progress} position={[0, -0.45, 0]} scale={0.2} rotation={[0, 0.25, 0]} />
        </SceneCanvas>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-6 pb-8 sm:px-10">
          <div className="pointer-events-auto mx-auto max-w-lg rounded-xl border border-[#2a3a6b] bg-[#0d1640]/80 p-5 backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#eaf3ff]">Prateek</span>
              <span className="text-xs text-[#7f93c9]">India</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[#b7c4e6]">
              Builds on Salesforce by day, rides and tinkers with 3D web experiments the rest of
              the time.
            </p>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[#1c2a55]">
              <div
                className="h-full rounded-full bg-[#5fd8ff]"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <div className="mt-1 text-right text-[11px] text-[#7f93c9]">
              {Math.round(progress * 100)}%
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
