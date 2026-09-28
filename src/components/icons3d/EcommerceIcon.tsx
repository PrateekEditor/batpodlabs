import { usePoseGroup } from './usePoseGroup'
import type { IconProps } from './types'

/** A small stylized shopping bag with handles and a glowing price tag. */
export function EcommerceIcon({ poseRef, accent }: IconProps) {
  const ref = usePoseGroup(poseRef)
  return (
    <group ref={ref}>
      {/* bag body */}
      <mesh position={[0, -0.15, 0]} castShadow>
        <boxGeometry args={[0.95, 1.0, 0.55]} />
        <meshStandardMaterial color={accent} roughness={0.55} />
      </mesh>
      {/* fold at top */}
      <mesh position={[0, 0.36, 0]} castShadow>
        <boxGeometry args={[0.98, 0.1, 0.58]} />
        <meshStandardMaterial color="#1c1c1c" roughness={0.6} />
      </mesh>
      {/* handles */}
      <mesh position={[-0.28, 0.62, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.16, 0.035, 10, 20, Math.PI]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.6} />
      </mesh>
      <mesh position={[0.28, 0.62, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.16, 0.035, 10, 20, Math.PI]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.6} />
      </mesh>
      {/* price tag */}
      <mesh position={[0.15, -0.1, 0.29]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.28, 0.2, 0.03]} />
        <meshStandardMaterial color="#1c1c1c" emissive={accent} emissiveIntensity={0.9} toneMapped={false} />
      </mesh>
    </group>
  )
}
