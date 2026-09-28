import { Canvas } from '@react-three/fiber'
import { Sky } from '@react-three/drei'
import { Cliff, Shed, UtilityPoles } from './hero/Island'
import { Desk, Character, Bench } from './hero/Workstation'
import { Hotspots } from './hero/Hotspots'
import { CloudField } from './hero/CloudField'
import { IslandRig } from './hero/IslandRig'
import { palette } from './hero/palette'

function DuskSky() {
  return (
    <>
      <Sky
        distance={450000}
        sunPosition={[-8, 0.15, -6]}
        turbidity={8}
        rayleigh={1.4}
        mieCoefficient={0.015}
        mieDirectionalG={0.85}
      />
      <CloudField />
    </>
  )
}

export function Scene() {
  return (
    <Canvas
      shadows
      camera={{ position: [6.5, 3.4, 7], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ toneMappingExposure: 0.85 }}
    >
      <color attach="background" args={[palette.sunsetDeep]} />
      <fog attach="fog" args={[palette.sunsetDeep, 8, 26]} />

      <ambientLight intensity={0.35} color="#8fa0c9" />
      <directionalLight
        position={[-9, 5, -4]}
        intensity={2.2}
        color={palette.sunset}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[0.3, 1.6, 0.4]} intensity={0.6} color={palette.screenGlow} distance={3} />

      <DuskSky />
      <hemisphereLight args={['#f0c9a0', '#2a2436', 0.5]} />

      <IslandRig>
        <Cliff />
        <Shed />
        <UtilityPoles />
        <Desk />
        <Character />
        <Bench />
        <Hotspots />
      </IslandRig>
    </Canvas>
  )
}
