import { useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import * as THREE from 'three'
import { useBootSound } from '../../hooks/useBootSound'

// Camera sweeps from back-left, arcs around the right side, then plunges
// into the monitor screen. CatmullRomCurve3 gives a smooth continuous path
// instead of waypoint-to-waypoint segments.
const CURVE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-4, 2.5, 5),    // KF1 — wide establishing shot
  new THREE.Vector3(5, 2, 4.5),     // KF2 — arc to right-front
  new THREE.Vector3(4, 1.2, 1),     // KF3 — right side, mid-distance
  new THREE.Vector3(0.05, 0.15, 0), // KF4 — push through the screen
])

const LOOK_AT = new THREE.Vector3(0, 0.2, 0)

export default function CameraRig({ onZoomComplete }) {
  const { camera } = useThree()
  const done = useRef(false)
  const { playWhoosh, playZoomIn } = useBootSound()

  useEffect(() => {
    if (done.current) return
    done.current = true

    const start = CURVE.getPointAt(0)
    camera.position.copy(start)
    camera.lookAt(LOOK_AT)

    const progress = { t: 0 }

    const onUpdate = () => {
      const pos = CURVE.getPointAt(progress.t)
      camera.position.copy(pos)
      camera.lookAt(LOOK_AT)
    }

    // Two-phase animation: smooth sweep then dramatic plunge
    const tl = gsap.timeline({ delay: 0.3 })

    // Phase 1 — wide arc sweep to just in front of the monitor
    tl.to(progress, {
      t: 0.78,
      duration: 3.6,
      ease: 'power2.inOut',
      onUpdate,
      onStart: () => playWhoosh(),
    })

    // Phase 2 — final plunge through the screen
    tl.to(progress, {
      t: 1,
      duration: 1.6,
      ease: 'power4.in',
      onUpdate,
      onStart: () => playZoomIn(),
      onComplete: () => onZoomComplete?.(),
    })

    return () => tl.kill()
  }, [camera, onZoomComplete, playWhoosh, playZoomIn])

  return null
}
