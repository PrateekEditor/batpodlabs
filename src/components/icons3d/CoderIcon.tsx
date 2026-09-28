import { usePoseGroup } from './usePoseGroup'
import type { IconProps } from './types'

/** A small stylized laptop with a glowing screen and an orbiting accent cube. */
export function CoderIcon({ poseRef, accent }: IconProps) {
  const ref = usePoseGroup(poseRef)
  return (
    <group ref={ref}>
      {/* base */}
      <mesh position={[0, -0.32, 0.15]} rotation={[-0.05, 0, 0]} castShadow>
        <boxGeometry args={[1.3, 0.08, 0.9]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.6} />
      </mesh>
      {/* screen */}
      <group position={[0, 0.2, -0.3]} rotation={[-0.25, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.3, 0.85, 0.06]} />
          <meshStandardMaterial color="#1c1c1c" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0, 0.035]}>
          <planeGeometry args={[1.14, 0.68]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.1} toneMapped={false} />
        </mesh>
      </group>
      {/* orbiting accent cube */}
      <mesh position={[1.0, 0.5, 0.2]} rotation={[0.4, 0.4, 0]}>
        <boxGeometry args={[0.22, 0.22, 0.22]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.7} toneMapped={false} />
      </mesh>
    </group>
  )
}
