import { useEffect, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import type { ThreeElements } from '@react-three/fiber'
import * as THREE from 'three'
import { DissolveMaterial } from './DissolveMaterial'

/**
 * Renders the Man.glb model twice, stacked:
 *  - a faint blue wireframe "hologram shell" that's always visible, so the
 *    silhouette reads even at progress 0
 *  - the real, lit model clipped by DissolveMaterial, which fills in from
 *    the feet up as `progress` goes 0 -> 1
 * Man.glb has no skeleton/animations (confirmed by inspecting the file), so
 * there's no rig to blend a sit-to-stand pose from — this dissolve-reveal
 * is the stand-in for that "stands up" moment instead.
 */
export function DissolveCharacter({
  progress,
  ...props
}: { progress: number } & ThreeElements['group']) {
  const { scene } = useGLTF('/models/Man.glb')

  const revealScene = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        const src = obj.material as THREE.MeshStandardMaterial
        const mat = new DissolveMaterial({
          map: src.map ?? null,
          color: src.color ?? new THREE.Color('#ffffff'),
          roughness: src.roughness ?? 0.6,
          metalness: src.metalness ?? 0.1,
        })
        obj.geometry.computeBoundingBox()
        const bbox = obj.geometry.boundingBox
        if (bbox) {
          mat.uniforms.uMinY.value = bbox.min.y
          mat.uniforms.uMaxY.value = bbox.max.y
        }
        obj.material = mat
      }
    })
    return clone
  }, [scene])

  const shellScene = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.material = new THREE.MeshBasicMaterial({
          color: '#5fd8ff',
          wireframe: true,
          transparent: true,
          opacity: 0.3,
          depthWrite: false,
        })
      }
    })
    return clone
  }, [scene])

  const materials = useRef<DissolveMaterial[]>([])
  useEffect(() => {
    materials.current = []
    revealScene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) materials.current.push(obj.material as DissolveMaterial)
    })
  }, [revealScene])

  useEffect(() => {
    for (const mat of materials.current) mat.uniforms.uProgress.value = progress
  }, [progress])

  return (
    <group {...props}>
      <primitive object={shellScene} />
      <primitive object={revealScene} />
    </group>
  )
}

useGLTF.preload('/models/Man.glb')
