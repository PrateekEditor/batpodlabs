import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import type { IconPose } from './types'

/** Applies a shared pose (tweened externally by anime.js) to a group each frame. */
export function usePoseGroup(poseRef: { current: IconPose }) {
  const ref = useRef<Group>(null)
  const idle = useRef(0)
  useFrame((_, delta) => {
    if (!ref.current) return
    idle.current += delta * 0.15
    ref.current.rotation.y = poseRef.current.rotationY + idle.current
    const targetScale = 1 + poseRef.current.bounce * 0.12
    ref.current.scale.x += (targetScale - ref.current.scale.x) * Math.min(1, delta * 6)
    ref.current.scale.y = ref.current.scale.x
    ref.current.scale.z = ref.current.scale.x
  })
  return ref
}
