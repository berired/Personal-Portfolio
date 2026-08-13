import * as THREE from 'three'

// The resting free-look shot: sitting in the desk chair, looking at the CRT
// monitor. Only the camera moves from here — InteractiveRig orbits around
// this point, CameraRig's intro glide ends here.
export function getSeatView({ seat }) {
  return { position: seat.eye.clone(), lookAt: seat.look.clone() }
}

// Docking position for the click-to-enter transition: pushed in right up
// against the screen glass, just outside the mesh, so the zoom reads as
// pushing *into* the screen rather than a camera move that stops short.
// `facing` points outward from the glass (toward the chair) — "in front of
// the screen" is a step further out along that same direction. Position
// only: the transition holds whatever direction the camera was already
// facing rather than turning to square up on the screen, so there's no
// orientation to compute here.
export function getMonitorDockView({ monitor }) {
  const front = new THREE.Vector3(monitor.center.x, monitor.center.y, monitor.frontZ)
  const clearance = monitor.size.z * 0.12
  return front.clone().addScaledVector(monitor.facing, clearance)
}
