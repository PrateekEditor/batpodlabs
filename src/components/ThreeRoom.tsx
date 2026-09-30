import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Bounds, useGLTF } from '@react-three/drei'
import type { Group } from 'three'

/**
 * Experimental viewer for the Spline-exported "mini room" GLTF — a quick
 * try to see whether it's worth wiring into the real hero. Tilts gently
 * toward wherever the mouse is over the canvas; nothing else is wired up
 * yet (no click interactions, no audio hooks).
 */
function Room() {
  const { scene } = useGLTF('/models/mini-room.gltf')
  const group = useRef<Group>(null)

  useFrame((state) => {
    if (!group.current) return
    const { x, y } = state.pointer
    group.current.rotation.y += (x * 0.5 - group.current.rotation.y) * 0.04
    group.current.rotation.x += (-y * 0.2 - group.current.rotation.x) * 0.04
  })

  return <primitive ref={group} object={scene} />
}

export function ThreeRoom() {
  return (
    <div className="h-[520px] w-full overflow-hidden rounded-2xl bg-[#f2e9d8]">
      <Canvas camera={{ position: [0, 0, 5], fov: 40 }} dpr={[1, 2]}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4, 5]} intensity={1.2} />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.2}>
            <Room />
          </Bounds>
        </Suspense>
      </Canvas>
    </div>
  )
}

useGLTF.preload('/models/mini-room.gltf')
