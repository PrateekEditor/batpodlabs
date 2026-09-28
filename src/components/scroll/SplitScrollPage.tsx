import { useEffect, useRef, useState, type ComponentType } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { SectionDef } from '../../data/sections'
import type { IconProps, IconPose } from '../icons3d/types'
import { createPose } from '../icons3d/types'
import { IconCanvas } from '../icons3d/IconCanvas'

gsap.registerPlugin(ScrollTrigger)

/**
 * Left column: stacked text steps, highlighted discretely as you cross them.
 * Right column: a sticky 3D icon canvas whose pose is scrubbed continuously
 * by a GSAP ScrollTrigger tied to scroll progress through this section,
 * rather than jumping between fixed states.
 */
export function SplitScrollPage({
  section,
  Icon,
}: {
  section: SectionDef
  Icon: ComponentType<IconProps>
}) {
  const poseRef = useRef<IconPose>(createPose())
  const [activeStep, setActiveStep] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const totalSteps = section.steps.length
    const amplitude = Math.PI / 1.7

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress
          poseRef.current.rotationY = (progress - 0.5) * amplitude
          poseRef.current.bounce = Math.min(1, Math.abs(self.getVelocity()) / 2500)
          const idx = Math.min(totalSteps - 1, Math.floor(progress * totalSteps))
          setActiveStep((prev) => (prev === idx ? prev : idx))
        },
      })
      // Layout (esp. the R3F canvas) can settle a frame late; refresh once it has.
      requestAnimationFrame(() => ScrollTrigger.refresh())
      return () => trigger.kill()
    }, containerRef)

    return () => ctx.revert()
  }, [section.id, section.steps.length])

  return (
    <div ref={containerRef} className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="order-2 flex flex-col gap-[30vh] px-6 py-[20vh] sm:px-10 md:order-1 md:gap-[40vh] md:px-16 md:py-[30vh]">
        {section.steps.map((step, i) => (
          <div
            key={step.title}
            className="max-w-md transition-opacity duration-300"
            style={{ opacity: activeStep === i ? 1 : 0.35 }}
          >
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">{step.title}</h2>
            <p className="mt-4 text-base leading-relaxed text-white/70">{step.body}</p>
          </div>
        ))}
      </div>
      <div className="order-1 sticky top-0 h-[45vh] overflow-hidden md:order-2 md:h-screen md:border-l md:border-white/[0.06]">
        {/* Ambient accent glow — a flat dark panel with nothing but a small icon
            reads as empty; a soft radial tint gives the section a color identity. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 60% 50% at 65% 45%, ${section.accent}26, transparent 70%)`,
          }}
        />
        <IconCanvas Icon={Icon} poseRef={poseRef} accent={section.accent} />
      </div>
    </div>
  )
}
