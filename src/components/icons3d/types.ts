import type { MutableRefObject } from 'react'

export type IconPose = {
  rotationY: number
  bounce: number
}

export function createPose(): MutableRefObject<IconPose>['current'] {
  return { rotationY: 0, bounce: 0 }
}

export type IconProps = {
  poseRef: { current: IconPose }
  accent: string
}
