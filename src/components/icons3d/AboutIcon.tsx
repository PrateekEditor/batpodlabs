import { usePoseGroup } from './usePoseGroup'
import type { IconProps } from './types'

/** A small stylized character bust: head, shoulders, and a glowing collar accent. */
export function AboutIcon({ poseRef, accent }: IconProps) {
  const ref = usePoseGroup(poseRef)
  return (
    <group ref={ref} position={[0, -0.25, 0]}>
      {/* head */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <sphereGeometry args={[0.34, 20, 20]} />
        <meshStandardMaterial color="#e3c9a8" roughness={0.7} />
      </mesh>
      {/* hair cap */}
      <mesh position={[0, 0.58, -0.02]} castShadow>
        <sphereGeometry args={[0.36, 20, 20, 0, Math.PI * 2, 0, Math.PI / 1.9]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.6} />
      </mesh>
      {/* shoulders / body */}
      <mesh position={[0, -0.15, 0]} castShadow>
        <capsuleGeometry args={[0.42, 0.4, 8, 16]} />
        <meshStandardMaterial color={accent} roughness={0.55} />
      </mesh>
      {/* collar accent */}
      <mesh position={[0, 0.14, 0.3]}>
        <boxGeometry args={[0.22, 0.06, 0.06]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.1} toneMapped={false} />
      </mesh>
    </group>
  )
}
