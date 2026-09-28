import { useEffect, useRef, useState, type ComponentType } from 'react'
import { animate } from 'animejs'
import type { SectionDef } from '../../data/sections'
import type { IconProps, IconPose } from '../icons3d/types'
import { createPose } from '../icons3d/types'
import { IconCanvas } from '../icons3d/IconCanvas'

/**
 * Left column: stacked text steps tracked via IntersectionObserver.
 * Right column: a sticky 3D icon canvas whose pose is tweened by anime.js
 * whenever the active step changes, so the model visibly reacts to scroll.
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
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const idx = stepRefs.current.findIndex((el) => el === entry.target)
          if (idx !== -1) setActiveStep(idx)
        })
      },
      { threshold: 0.6 }
    )
    stepRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [section.id])

  useEffect(() => {
    const totalSteps = Math.max(section.steps.length - 1, 1)
    animate(poseRef.current, {
      rotationY: (activeStep / totalSteps - 0.5) * (Math.PI / 1.7),
      bounce: 1,
      duration: 650,
      ease: 'outElastic(1, .6)',
      onComplete: () => {
        animate(poseRef.current, { bounce: 0, duration: 400, ease: 'outQuad' })
      },
    })
  }, [activeStep, section.steps.length])

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="order-2 flex flex-col gap-[30vh] px-6 py-[20vh] sm:px-10 md:order-1 md:gap-[40vh] md:px-16 md:py-[30vh]">
        {section.steps.map((step, i) => (
          <div
            key={step.title}
            ref={(el) => {
              stepRefs.current[i] = el
            }}
            className="max-w-md transition-opacity duration-500"
            style={{ opacity: activeStep === i ? 1 : 0.35 }}
          >
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">{step.title}</h2>
            <p className="mt-4 text-base leading-relaxed text-white/70">{step.body}</p>
          </div>
        ))}
      </div>
      <div className="order-1 sticky top-0 h-[45vh] md:order-2 md:h-screen">
        <IconCanvas Icon={Icon} poseRef={poseRef} accent={section.accent} />
      </div>
    </div>
  )
}
