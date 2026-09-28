import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh, MeshStandardMaterial } from 'three'
import { palette } from './palette'

function Screen({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  const glow = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    if (glow.current) {
      const mat = glow.current.material as MeshStandardMaterial
      mat.emissiveIntensity = 1.1 + Math.sin(clock.elapsedTime * 2 + position[0]) * 0.15
    }
  })
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* frame */}
      <mesh castShadow>
        <boxGeometry args={[0.62, 0.42, 0.04]} />
        <meshStandardMaterial color="#111214" roughness={0.6} />
      </mesh>
      {/* glowing panel */}
      <mesh ref={glow} position={[0, 0, 0.025]}>
        <planeGeometry args={[0.54, 0.34]} />
        <meshStandardMaterial
          color={palette.screenGlow}
          emissive={palette.screenGlow}
          emissiveIntensity={1.1}
          toneMapped={false}
        />
      </mesh>
      {/* stand */}
      <mesh position={[0, -0.32, -0.02]}>
        <cylinderGeometry args={[0.02, 0.03, 0.22, 6]} />
        <meshStandardMaterial color={palette.metal} roughness={0.5} metalness={0.4} />
      </mesh>
    </group>
  )
}

/** Desk with three angled glowing monitors, matching the reference triple-monitor setup. */
export function Desk() {
  return (
    <group position={[0.3, 1.0, 0.1]}>
      {/* tabletop */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.06, 0.75]} />
        <meshStandardMaterial color={palette.wood} roughness={0.7} />
      </mesh>
      {/* legs */}
      {[
        [-0.66, -0.33],
        [0.66, -0.33],
        [-0.66, 0.33],
        [0.66, 0.33],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, -0.32, z]} castShadow>
          <boxGeometry args={[0.05, 0.6, 0.05]} />
          <meshStandardMaterial color={palette.woodDark} roughness={0.8} />
        </mesh>
      ))}
      {/* three monitors, gently angled toward the character, spaced to read as separate panels */}
      <Screen position={[-0.58, 0.28, 0.02]} rotationY={0.55} />
      <Screen position={[0, 0.3, -0.12]} rotationY={0} />
      <Screen position={[0.58, 0.28, 0.02]} rotationY={-0.55} />
    </group>
  )
}

/** Simple low-poly seated figure at the desk, facing the monitors. */
export function Character() {
  return (
    <group position={[0.3, 0.98, 0.75]} rotation={[0, Math.PI, 0]}>
      {/* chair */}
      <group position={[0, -0.32, 0.05]}>
        <mesh castShadow>
          <boxGeometry args={[0.44, 0.06, 0.42]} />
          <meshStandardMaterial color="#242424" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.28, 0.2]} castShadow>
          <boxGeometry args={[0.44, 0.5, 0.06]} />
          <meshStandardMaterial color="#242424" roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.3, 6]} />
          <meshStandardMaterial color={palette.metal} metalness={0.6} roughness={0.4} />
        </mesh>
      </group>
      {/* torso */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <capsuleGeometry args={[0.15, 0.32, 4, 8]} />
        <meshStandardMaterial color={palette.clothes} roughness={0.8} />
      </mesh>
      {/* head */}
      <mesh position={[0, 0.42, 0]} castShadow>
        <sphereGeometry args={[0.13, 12, 12]} />
        <meshStandardMaterial color={palette.skin} roughness={0.7} />
      </mesh>
      {/* arms, angled forward toward the desk */}
      {[-0.19, 0.19].map((x, i) => (
        <mesh key={i} position={[x, 0.05, -0.18]} rotation={[0.9, 0, 0]} castShadow>
          <capsuleGeometry args={[0.05, 0.32, 4, 6]} />
          <meshStandardMaterial color={palette.clothes} roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

/** Small bench off to the side, echoing the reference's quiet-corner detail. */
export function Bench() {
  return (
    <group position={[2.1, 0.42, -0.6]} rotation={[0, -0.6, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.9, 0.06, 0.32]} />
        <meshStandardMaterial color={palette.woodDark} roughness={0.85} />
      </mesh>
      {[-0.36, 0.36].map((x, i) => (
        <mesh key={i} position={[x, -0.18, 0]}>
          <boxGeometry args={[0.06, 0.3, 0.28]} />
          <meshStandardMaterial color={palette.woodDark} roughness={0.85} />
        </mesh>
      ))}
    </group>
  )
}
