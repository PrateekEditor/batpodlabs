import { Canvas } from '@react-three/fiber'
import type { ComponentType } from 'react'
import type { IconProps } from './types'

export function IconCanvas({
  Icon,
  poseRef,
  accent,
}: {
  Icon: ComponentType<IconProps>
  poseRef: IconProps['poseRef']
  accent: string
}) {
  return (
    <Canvas camera={{ position: [1.9, 1.0, 3.6], fov: 32 }} dpr={[1, 2]} gl={{ antialias: true }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 2]} intensity={1.4} castShadow />
      <hemisphereLight args={['#b6c7d6', '#1a1a1a', 0.6]} />
      <Icon poseRef={poseRef} accent={accent} />
    </Canvas>
  )
}
