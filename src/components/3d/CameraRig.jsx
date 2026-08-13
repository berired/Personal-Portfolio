import { useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useOfficeMetrics } from './useOfficeMetrics'
import { CAMERA_SECONDS } from '../../hooks/useIntroTimeline'
import { getSeatView } from './homeView'

// The camera opens wide on the cubicle, glides in past the desk, and settles
// into the seated POV — the same point InteractiveRig free-looks from, so
// handing off between the two never jumps. Keyframes are multiples of the
// room's own radius, so the shot composes correctly whatever size the office
// .glb is.
function buildCurve(d, roomCenter, seat) {
  return new THREE.CatmullRomCurve3([
    new THREE.Vector3(roomCenter.x + 0.97 * d, roomCenter.y + 0.42 * d, roomCenter.z + 0.465 * d),
    new THREE.Vector3(roomCenter.x + 0.6 * d, roomCenter.y + 0.28 * d, roomCenter.z - 0.2 * d),
    new THREE.Vector3(roomCenter.x + 0.2 * d, roomCenter.y + 0.15 * d, roomCenter.z - 0.05 * d),
    seat.position,
  ])
}

export default function CameraRig({ timelineRef, onReady }) {
  const { camera } = useThree()
  const { room, seat: seatMetrics } = useOfficeMetrics()
  const done = useRef(false)

  useEffect(() => {
    const tl = timelineRef?.current
    if (!tl || done.current) return
    done.current = true

    // Distance at which the room's bounding sphere fills the frame.
    const fit = room.radius / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2))
    const seat = getSeatView({ seat: seatMetrics })
    const curve = buildCurve(fit, room.center, seat)

    const lookStart = new THREE.Vector3(room.center.x, room.center.y + room.size.y * 0.1, room.center.z)
    const lookEnd = seat.lookAt
    const lookAt = new THREE.Vector3()

    const progress = { t: 0 }

    const onUpdate = () => {
      camera.position.copy(curve.getPointAt(progress.t))
      // Weighted late so the aim settles onto the screen as the move commits.
      lookAt.copy(lookStart).lerp(lookEnd, progress.t * progress.t)
      camera.lookAt(lookAt)
    }

    onUpdate()

    tl.to(progress, {
      t: 1,
      duration: CAMERA_SECONDS,
      ease: 'power2.in',
      onUpdate,
    }, 'camera')

    if (import.meta.env.DEV) {
      window.__intro = { tl, curve, camera, metrics: { room, seat, fit } }
    }

    // Releases the timeline's awaitScene hold — the model is loaded (this
    // component suspends on it) and the move is attached.
    onReady?.()
  }, [camera, room, seatMetrics, timelineRef, onReady])

  return null
}
