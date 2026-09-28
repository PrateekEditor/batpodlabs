import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { Group } from 'three'

/**
 * Wraps its children in a group that gently tilts toward the cursor —
 * the "island responds to your mouse" interactivity from the reference repo,
 * without a full orbit control (keeps the framing intentional).
 */
export function IslandRig({ children }: { children: React.ReactNode }) {
  const ref = useRef<Group>(null)
  const { pointer } = useThree()

  useFrame((_, delta) => {
    if (!ref.current) return
    const targetY = pointer.x * 0.35
    const targetX = -pointer.y * 0.12
    // smooth, spring-like ease toward the target rather than snapping to it
    ref.current.rotation.y += (targetY - ref.current.rotation.y) * Math.min(1, delta * 2.5)
    ref.current.rotation.x += (targetX - ref.current.rotation.x) * Math.min(1, delta * 2.5)
  })

  return (
    <group position={[0, -0.5, 0]} ref={ref}>
      {children}
    </group>
  )
}
