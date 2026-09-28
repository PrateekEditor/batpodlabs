import { useMemo } from 'react'
import { getCloudTexture } from './cloudTexture'

type Puff = { pos: [number, number, number]; scale: number; color: string; opacity: number }

/** One drifting cluster of billboarded cloud sprites, self-contained (no CDN texture). */
function CloudCluster({ center, spread = 3, count = 6, color, baseOpacity = 0.6 }: {
  center: [number, number, number]
  spread?: number
  count?: number
  color: string
  baseOpacity?: number
}) {
  const texture = getCloudTexture()
  const puffs = useMemo<Puff[]>(() => {
    const items: Puff[] = []
    for (let i = 0; i < count; i++) {
      items.push({
        pos: [
          center[0] + (Math.random() - 0.5) * spread * 2,
          center[1] + (Math.random() - 0.5) * spread * 0.5,
          center[2] + (Math.random() - 0.5) * spread,
        ],
        scale: spread * (0.7 + Math.random() * 0.7),
        color,
        opacity: baseOpacity * (0.7 + Math.random() * 0.5),
      })
    }
    return items
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center[0], center[1], center[2], spread, count, color, baseOpacity])

  return (
    <group>
      {puffs.map((p, i) => (
        <sprite key={i} position={p.pos} scale={[p.scale, p.scale * 0.6, 1]}>
          <spriteMaterial
            map={texture}
            color={p.color}
            opacity={p.opacity}
            transparent
            depthWrite={false}
            fog
          />
        </sprite>
      ))}
    </group>
  )
}

/** Layered cloud clusters surrounding the island at different depths, dusk-toned. */
export function CloudField() {
  return (
    <group>
      <CloudCluster center={[-7, 1.5, -9]} spread={4} count={7} color="#f2c79a" baseOpacity={0.7} />
      <CloudCluster center={[7, 0.6, -11]} spread={4.5} count={7} color="#e6a679" baseOpacity={0.65} />
      <CloudCluster center={[0, -0.8, -13]} spread={5.5} count={8} color="#c98a63" baseOpacity={0.75} />
      <CloudCluster center={[2.5, 3.5, -10]} spread={3} count={5} color="#f7ddb8" baseOpacity={0.45} />
      <CloudCluster center={[-4, -1.5, -6]} spread={3.5} count={6} color="#d99a6e" baseOpacity={0.55} />
    </group>
  )
}
