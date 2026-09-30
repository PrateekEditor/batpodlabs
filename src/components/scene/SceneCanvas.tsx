import { Canvas } from '@react-three/fiber'
import type { ReactNode } from 'react'

export function SceneCanvas({
  children,
  camera = { position: [2.4, 1.6, 4.2], fov: 35 },
}: {
  children: ReactNode
  camera?: { position: [number, number, number]; fov: number }
}) {
  return (
    <Canvas camera={camera} dpr={[1, 1.8]} gl={{ antialias: true }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 2]} intensity={1.1} />
      <hemisphereLight args={['#ffffff', '#3a3550', 0.5]} />
      {children}
    </Canvas>
  )
}
