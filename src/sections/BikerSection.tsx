import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { Model } from '../components/scene/Model'
import { SceneCanvas } from '../components/scene/SceneCanvas'

function SpinningBike() {
  const ref = useRef<Group>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.25
  })
  return (
    <group ref={ref} position={[0, -0.55, 0]} rotation={[0, 0.5, 0]}>
      <Model src="/models/Motorcycle.glb" scale={0.18} position={[0, 0.473, 0]} />
    </group>
  )
}

export function BikerSection() {
  return (
    <section data-theme="cream" className="relative grid min-h-screen w-full grid-cols-1 md:grid-cols-2">
      <div className="order-2 flex flex-col justify-center gap-4 px-6 py-16 sm:px-10 md:order-1 md:px-16">
        <span className="text-sm font-semibold uppercase tracking-wide text-[#8a6b2a]">
          Off the keyboard
        </span>
        <h2 className="text-4xl font-bold text-[#1c1a16] sm:text-5xl">Meet the Batpod</h2>
        <p className="max-w-md text-base leading-relaxed text-[#4a4535]">
          The bike this whole brand is named after. Ride logs, routes, and motovlog content land
          here as the channel grows.
        </p>
      </div>
      <div className="order-1 h-[45vh] md:order-2 md:h-screen">
        <SceneCanvas camera={{ position: [1.2, 1.6, 5.2], fov: 38 }}>
          <SpinningBike />
        </SceneCanvas>
      </div>
    </section>
  )
}
