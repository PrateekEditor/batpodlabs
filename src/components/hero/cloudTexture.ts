import * as THREE from 'three'

let cached: THREE.CanvasTexture | null = null

/**
 * Generates a soft, puffy radial-gradient sprite texture entirely in-browser —
 * no network fetch, so it never depends on a third-party CDN being up.
 */
export function getCloudTexture(): THREE.CanvasTexture {
  if (cached) return cached
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  // layer a few overlapping soft blobs so the silhouette isn't a perfect circle
  const blobs = [
    { x: 0.5, y: 0.55, r: 0.42 },
    { x: 0.32, y: 0.5, r: 0.28 },
    { x: 0.68, y: 0.5, r: 0.3 },
    { x: 0.5, y: 0.35, r: 0.26 },
  ]
  ctx.clearRect(0, 0, size, size)
  for (const b of blobs) {
    const cx = b.x * size
    const cy = b.y * size
    const r = b.r * size
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
    grad.addColorStop(0, 'rgba(255,255,255,0.9)')
    grad.addColorStop(0.6, 'rgba(255,255,255,0.35)')
    grad.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fill()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  cached = texture
  return texture
}
