import { useMemo } from 'react'
import * as THREE from 'three'
import { palette } from './palette'

/** Scatter of low-poly grass tufts across the island top, avoiding the desk footprint. */
function GrassTufts({ count = 140, radius = 3.1 }: { count?: number; radius?: number }) {
  const tufts = useMemo(() => {
    const items: { pos: [number, number, number]; scale: number; rot: number }[] = []
    let guard = 0
    while (items.length < count && guard < count * 6) {
      guard++
      const r = Math.sqrt(Math.random()) * radius
      const a = Math.random() * Math.PI * 2
      const x = Math.cos(a) * r
      const z = Math.sin(a) * r
      // keep the desk area (front-center) clear
      if (x > -1.6 && x < 2.4 && z > -1.2 && z < 1.6) continue
      items.push({ pos: [x, 0, z], scale: 0.12 + Math.random() * 0.16, rot: Math.random() * Math.PI })
    }
    return items
  }, [count, radius])

  return (
    <group position={[0, 0.16, 0]}>
      {tufts.map((t, i) => (
        <mesh key={i} position={t.pos} rotation={[0, t.rot, 0]} scale={t.scale} castShadow>
          <coneGeometry args={[0.5, 1, 4]} />
          <meshStandardMaterial color={i % 3 === 0 ? palette.grassDark : palette.grassTop} roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

/** Jagged rock outcrops jutting from the cliff sides for silhouette variety. */
function RockOutcrops() {
  const rocks = useMemo(
    () => [
      { pos: [2.6, -1.0, 0.8] as const, scale: [0.9, 0.7, 0.8] as const, rot: 0.4 },
      { pos: [-2.3, -1.6, -1.2] as const, scale: [1.1, 0.9, 1.0] as const, rot: 1.1 },
      { pos: [0.5, -2.4, 2.4] as const, scale: [1.3, 1.0, 1.1] as const, rot: 2.0 },
      { pos: [-1.6, -2.8, 1.6] as const, scale: [1.0, 1.4, 0.9] as const, rot: 0.7 },
    ],
    [],
  )
  return (
    <group>
      {rocks.map((r, i) => (
        <mesh key={i} position={r.pos as unknown as [number, number, number]} rotation={[0.3, r.rot, 0.2]} scale={r.scale as unknown as [number, number, number]} castShadow receiveShadow>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={i % 2 === 0 ? palette.rock : palette.rockDark} roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  )
}

/** The floating cliff itself: a low-poly tapered rock body capped with a flat grassy top. */
export function Cliff() {
  return (
    <group>
      {/* main tapered cliff body */}
      <mesh position={[0, -2.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[3.3, 0.5, 4.6, 7, 1]} />
        <meshStandardMaterial color={palette.rock} roughness={1} flatShading />
      </mesh>
      <RockOutcrops />
      {/* grassy cap */}
      <mesh position={[0, 0.05, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[3.35, 3.3, 0.3, 7]} />
        <meshStandardMaterial color={palette.grassTop} roughness={0.95} flatShading />
      </mesh>
      <GrassTufts />
    </group>
  )
}

/** Small wooden shed set back-left on the island, matching the reference composition. */
export function Shed() {
  return (
    <group position={[-2.1, 0.55, -1.5]} rotation={[0, 0.5, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.9, 1.0]} />
        <meshStandardMaterial color={palette.wood} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.65, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[0.85, 0.6, 4]} />
        <meshStandardMaterial color={palette.roof} roughness={0.9} flatShading />
      </mesh>
      {/* plank pile beside the shed */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0.9, -0.35 + i * 0.08, 0.5]} rotation={[0, 0.15 * i, 0]} castShadow>
          <boxGeometry args={[0.7, 0.06, 0.16]} />
          <meshStandardMaterial color={palette.woodDark} roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

/** Twin utility poles with a crossbar and drooping wires, silhouetted behind the island. */
export function UtilityPoles() {
  const wireGeom = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.9, 3.1, -2.4),
      new THREE.Vector3(-0.4, 2.7, -2.5),
      new THREE.Vector3(1.1, 3.15, -2.6),
    ])
    const pts = curve.getPoints(20)
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [])

  return (
    <group>
      {[-1.9, 1.1].map((x, i) => (
        <group key={i} position={[x, 0, -2.5]}>
          <mesh position={[0, 1.6, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.07, 3.2, 6]} />
            <meshStandardMaterial color={palette.woodDark} roughness={0.9} />
          </mesh>
          <mesh position={[0, 3.05, 0]} castShadow>
            <boxGeometry args={[0.9, 0.06, 0.06]} />
            <meshStandardMaterial color={palette.woodDark} roughness={0.9} />
          </mesh>
        </group>
      ))}
      <line>
        <primitive object={wireGeom} attach="geometry" />
        <lineBasicMaterial color="#1a1a1a" transparent opacity={0.55} />
      </line>
    </group>
  )
}
