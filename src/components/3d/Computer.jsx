import { useGLTF } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import computerUrl from '@asset/old_computer.glb'

useGLTF.preload(computerUrl)

export default function Computer() {
  const { scene } = useGLTF(computerUrl)
  const ref = useRef()

  useEffect(() => {
    if (!scene) return
    scene.traverse((child) => {
      if (!child.isMesh) return
      child.castShadow = true
      child.receiveShadow = true

      const name = child.name.toLowerCase()

      // Make the monitor screen emit a subtle green glow
      if (name.includes('screen') || name.includes('display') || name.includes('monitor')) {
        child.material = new THREE.MeshStandardMaterial({
          color: '#001400',
          emissive: new THREE.Color('#00ff41'),
          emissiveIntensity: 0.5,
          roughness: 0.05,
          metalness: 0.1,
        })
      }
    })
  }, [scene])

  return (
    <group ref={ref}>
      {/* Desk surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#080808" roughness={0.85} metalness={0.05} />
      </mesh>

      {/* The GLB model — position/scale may need tuning to your specific file */}
      <primitive object={scene} />
    </group>
  )
}
