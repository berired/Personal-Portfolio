import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'
import computerUrl from '@asset/old_computer.glb'

// The GLB arrives with a Sketchfab/FBX node chain that composes to net scale 1.0,
// leaving the model roughly 0.66 × 0.39 × 0.87 world units — far too small for the
// distances the camera works in. Rather than hardcode a fudge factor, measure the
// model at runtime and express every camera keyframe as a multiple of its own size.
// Swapping the .glb then costs nothing.
const TARGET_SIZE = 3 // largest dimension, in world units, after normalization

export function useComputerMetrics() {
  const { scene } = useGLTF(computerUrl)

  return useMemo(() => {
    // Measure a detached clone: once the real scene is parented under the scaled
    // group below, setFromObject would fold our own scale back into the result.
    // clone() shares geometry and materials, so this is cheap.
    const probe = scene.clone(true)
    probe.updateMatrixWorld(true)

    const box = new THREE.Box3().setFromObject(probe)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())

    const scale = TARGET_SIZE / Math.max(size.x, size.y, size.z)
    const scaled = size.clone().multiplyScalar(scale)

    // Re-seat the model: centred on X/Z, base sitting on the desk at y = 0.
    const offset = new THREE.Vector3(
      -center.x * scale,
      -box.min.y * scale,
      -center.z * scale
    )

    return {
      scale,
      offset,
      size: scaled,
      radius: scaled.length() / 2,
      // Monitor screen centre, as a fraction of the normalized bounding box.
      //
      // The mesh is a single 180-vertex blob with no named sub-objects, so
      // these came from measuring the geometry in the browser: the desk runs
      // along X, and the screen faces +X — *not* +Z as the bounding box's
      // longest axis would suggest. The box's +Z face is the front edge of the
      // mousepad; the monitor body sits at x [-1.14, -0.11], y [0.30, 1.20],
      // z [-0.22, 1.02] in normalized units.
      screen: new THREE.Vector3(
        scaled.x * -0.048,
        scaled.y * 0.585,
        scaled.z * 0.133
      ),
      // Unit normal pointing out of the screen — the side the viewer sits on.
      facing: new THREE.Vector3(1, 0, 0),
    }
  }, [scene])
}

useGLTF.preload(computerUrl)
