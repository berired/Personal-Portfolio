import * as THREE from 'three'

// The "square on the glass" shot — the intro's docking position, deliberately
// close enough that the emissive screen fills the frame for the bloom
// blowout that carries the transition into the portfolio. Never seen at rest
// (it's covered by the wash, then hidden behind the opaque portfolio UI), so
// it is *not* a usable resting shot — see getOrbitView for that.
export function getHomeView({ radius, size, screen }, fov) {
  const fit = radius / Math.sin(THREE.MathUtils.degToRad(fov / 2))
  const clearance = size.x * 0.2
  return {
    position: new THREE.Vector3(screen.x + clearance, screen.y, screen.z),
    lookAt: new THREE.Vector3(screen.x - size.x * 0.22, screen.y, screen.z),
  }
}

// A pulled-back three-quarter view of the whole machine — the resting shot
// for free-look mode. Reuses the intro's own establishing-shot direction (its
// very first curve keyframe) so the framing feels like part of the same
// visual language, just not zoomed into the blowout.
const ORBIT_DIR = new THREE.Vector3(0.97, 0.42, 0.465).normalize()

export function getOrbitView({ radius, size }, fov) {
  const fit = radius / Math.sin(THREE.MathUtils.degToRad(fov / 2))
  return {
    position: ORBIT_DIR.clone().multiplyScalar(fit * 1.05),
    lookAt: new THREE.Vector3(size.x * -0.09, size.y * 0.53, size.z * 0.1),
  }
}
