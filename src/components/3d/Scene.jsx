import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { Stars, Environment } from '@react-three/drei'
import Computer from './Computer'
import CameraRig from './CameraRig'

export default function Scene({ onZoomComplete }) {
  return (
    <Canvas
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      camera={{ fov: 50, near: 0.1, far: 200 }}
      shadows
      dpr={[1, 1.5]}
    >
      <color attach="background" args={['#020202']} />
      <fog attach="fog" args={['#020202', 18, 50]} />

      {/* Ambient fill — very dim */}
      <ambientLight intensity={0.04} color="#1a1a2e" />

      {/* Monitor glow — green cast from the screen */}
      <pointLight position={[0, 1.5, 0.8]} intensity={3} color="#00ff41" distance={6} decay={2} />

      {/* Weak desk lamp from upper-right */}
      <spotLight
        position={[4, 7, 4]}
        angle={0.25}
        penumbra={0.8}
        intensity={0.6}
        color="#ffe0b0"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Deep background stars */}
      <Stars radius={60} depth={60} count={1200} factor={2} fade speed={0.4} />

      {/* Computer model */}
      <Suspense fallback={null}>
        <Computer />
      </Suspense>

      {/* Camera animation controller */}
      <CameraRig onZoomComplete={onZoomComplete} />
    </Canvas>
  )
}
