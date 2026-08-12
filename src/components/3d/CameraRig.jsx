import { useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useBootSound } from '../../hooks/useBootSound'
import { useComputerMetrics } from './useComputerMetrics'
import { CAMERA_SECONDS, PLUNGE_AT } from '../../hooks/useIntroTimeline'

// The camera opens wide on the whole desk, glides across the front of the
// machine, and finishes square on the monitor. Keyframes are multiples of the
// distance needed to frame the model at the current fov, so the shot composes
// correctly whatever size the .glb is; the last one is anchored to the screen.
function buildCurve(d, screen, clearance) {
  return new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.97 * d, 0.42 * d, 0.465 * d), // wide establishing shot
    new THREE.Vector3(0.89 * d, 0.32 * d, -0.34 * d), // glide across the front
    new THREE.Vector3(0.465 * d, 0.22 * d, -0.106 * d), // closing, still off-axis
    // Square on the glass, and *outside* the mesh. The old rig ended inside the
    // bounding box, looking at backfaces through a clipped near plane.
    new THREE.Vector3(screen.x + clearance, screen.y, screen.z),
  ])
}

export default function CameraRig({ timelineRef, onReady }) {
  const { camera } = useThree()
  const { radius, size, screen } = useComputerMetrics()
  const done = useRef(false)
  const { playZoomIn } = useBootSound()

  useEffect(() => {
    const tl = timelineRef?.current
    if (!tl || done.current) return
    done.current = true

    // Distance at which the model's bounding sphere fills the frame.
    const fit = radius / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2))
    const clearance = size.x * 0.2
    const curve = buildCurve(fit, screen, clearance)

    // The look target travels too, ending *behind* the screen. The old rig aimed
    // at a fixed point 0.07 units from the camera's final position, so lookAt's
    // direction vector collapsed and the orientation snapped at the climax.
    const lookStart = new THREE.Vector3(size.x * -0.09, size.y * 0.53, size.z * 0.1)
    const lookEnd = new THREE.Vector3(screen.x - size.x * 0.22, screen.y, screen.z)
    const lookAt = new THREE.Vector3()

    const progress = { t: 0 }

    const onUpdate = () => {
      camera.position.copy(curve.getPointAt(progress.t))
      // Weighted late so the aim settles onto the screen as the move commits.
      lookAt.copy(lookStart).lerp(lookEnd, progress.t * progress.t)
      camera.lookAt(lookAt)
    }

    onUpdate()

    // One tween, not two. Chaining an `inOut` sweep into an `in` plunge parked
    // the camera at zero velocity between them — a visible stall right where the
    // move was supposed to build. A single accelerating ease holds the
    // establishing shot, then commits, with no seam in the middle.
    tl.to(progress, {
      t: 1,
      duration: CAMERA_SECONDS,
      ease: 'power2.in',
      onUpdate,
    }, 'camera')

    // Audio still has two beats even though the motion is continuous.
    tl.call(() => playZoomIn(CAMERA_SECONDS - PLUNGE_AT), null, `camera+=${PLUNGE_AT}`)

    if (import.meta.env.DEV) {
      window.__intro = { tl, curve, camera, metrics: { radius, size, screen, fit } }
    }

    // Releases the timeline's awaitScene hold — the model is loaded (this
    // component suspends on it) and the move is attached.
    onReady?.()
  }, [camera, playZoomIn, radius, size, screen, timelineRef, onReady])

  return null
}
