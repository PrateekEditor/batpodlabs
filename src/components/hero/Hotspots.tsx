export type HotspotDef = {
  id: string
  label: string
  position: [number, number, number]
  color: string
}

export const HOTSPOTS: HotspotDef[] = [
  { id: 'coder', label: 'Coder', position: [1.9, 1.55, 1.9], color: '#55ac9f' },
  { id: 'biker', label: 'Biker', position: [3.1, 1.3, -1.3], color: '#d67f74' },
  { id: 'ecommerce', label: 'E-Commerce', position: [0, 1.9, -3.0], color: '#d6c23d' },
  { id: 'about', label: 'About Me', position: [-3.1, 1.3, -1.0], color: '#9186d9' },
]

/** Small glowing markers in the 3D scene — decorative only. The actual clickable
 *  labels live in the 2D HeroNav overlay so they don't depend on drei's Html
 *  screen-space projection (which was unreliable with several instances at once). */
export function Hotspots() {
  return (
    <group>
      {HOTSPOTS.map((h) => (
        <mesh key={h.id} position={h.position}>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshStandardMaterial color={h.color} emissive={h.color} emissiveIntensity={0.9} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}
