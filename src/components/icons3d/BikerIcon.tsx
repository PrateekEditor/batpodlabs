import { usePoseGroup } from './usePoseGroup'
import type { IconProps } from './types'

/** A small stylized motorcycle: two wheels, a body, and a headlamp. */
export function BikerIcon({ poseRef, accent }: IconProps) {
  const ref = usePoseGroup(poseRef)
  return (
    <group ref={ref}>
      {/* wheels */}
      <mesh position={[-0.6, -0.35, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.32, 0.09, 12, 24]} />
        <meshStandardMaterial color="#1c1c1c" roughness={0.7} />
      </mesh>
      <mesh position={[0.6, -0.35, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.32, 0.09, 12, 24]} />
        <meshStandardMaterial color="#1c1c1c" roughness={0.7} />
      </mesh>
      {/* body */}
      <mesh position={[0, -0.05, 0]} rotation={[0, 0, -0.08]} castShadow>
        <boxGeometry args={[1.1, 0.26, 0.32]} />
        <meshStandardMaterial color={accent} roughness={0.5} />
      </mesh>
      {/* seat */}
      <mesh position={[-0.1, 0.16, 0]} castShadow>
        <boxGeometry args={[0.55, 0.1, 0.3]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.6} />
      </mesh>
      {/* handlebar + headlamp */}
      <mesh position={[0.62, 0.12, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.08, 0.35, 0.08]} />
        <meshStandardMaterial color="#1c1c1c" roughness={0.6} />
      </mesh>
      <mesh position={[0.72, 0.02, 0]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
    </group>
  )
}
