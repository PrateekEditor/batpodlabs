import { Canvas } from '@react-three/fiber'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'

/**
 * Placeholder 3D piece proving the react-three-fiber pipeline works end to
 * end. Swap this for a real ThreeUI hero component once one is picked.
 */
function SpinningShape() {
  const ref = useRef<Mesh>(null)
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.25
      ref.current.rotation.y += delta * 0.35
    }
  })
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.4, 0]} />
      <meshStandardMaterial color="#d68a3d" wireframe />
    </mesh>
  )
}

export function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 4] }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={1.2} />
      <SpinningShape />
    </Canvas>
  )
}
