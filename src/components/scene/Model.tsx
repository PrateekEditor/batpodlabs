import { useGLTF } from '@react-three/drei'
import type { ThreeElements } from '@react-three/fiber'

/**
 * Drops a static .glb straight into the scene, unmodified. Used for the
 * desk and motorcycle models which keep their own baked-in materials.
 */
export function Model({
  src,
  ...props
}: { src: string } & ThreeElements['group']) {
  const { scene } = useGLTF(src)
  return <primitive object={scene} {...props} />
}

useGLTF.preload('/models/Desk.glb')
useGLTF.preload('/models/Man.glb')
useGLTF.preload('/models/Motorcycle.glb')
