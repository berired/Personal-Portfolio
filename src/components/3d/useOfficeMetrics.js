import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'
import officeUrl from '@asset/low-poly_office.glb'

// The office .glb is a Sketchfab/FBX export with fully generic node names
// (Cube, Cube.001, Cube.002, ...) — nothing is labelled "chair" or "monitor".
// These were identified by loading the raw model in a throwaway viewer,
// raycasting against each node on click, and reading back its name and
// world-space bounding box. The numbers below are that model's own native
// coordinates (no rescaling needed — they're already a usable size for the
// camera math), just grounded so the floor sits at y = 0.
//
//   Cube002_Material003_0  — CRT monitor on the desk (chosen over the second,
//                             flat-panel monitor on the same desk, to keep the
//                             site's CRT/terminal identity consistent)
//   Cube014_...             — the desk chair
//   tabletop_Material_0     — the desk surface
//   Cube006_...              — cubicle partition walls
//   Plane_Material005_0     — floor
const FLOOR_Y = 0.19

function grounded(x, y, z) {
  return new THREE.Vector3(x, y - FLOOR_Y, z)
}

// Seated POV: eye position pulled back from the desk (not perched right on
// top of the monitor) and aimed at the desk's own center rather than the
// screen, so the resting frame reads as "the whole desk is in front of you,"
// not "zoomed in on one thing." Free-look then turns the head from here —
// it never re-centers on or orbits toward the monitor.
const SEAT_EYE = grounded(3.0, 2.79, -1.5)
const SEAT_LOOK = grounded(2.9, 2.14, 0.6)

// CRT monitor screen: bounding box center, and the z of its front (glass)
// face — the face nearer the chair, i.e. the smaller-z side of the box.
const MONITOR_CENTER = grounded(3.188, 2.533, 1.721)
const MONITOR_SIZE = new THREE.Vector3(1.126, 0.875, 0.968)
// Front (glass) face is the box's min-z side — the side facing the chair.
const MONITOR_FRONT_Z = MONITOR_CENTER.z - MONITOR_SIZE.z * 0.5
// Screen faces -z (toward the chair).
const MONITOR_FACING = new THREE.Vector3(0, 0, -1)

// Cubicle walls' own bounding box — stands in for "the room" when the intro's
// establishing shot needs a wide distance to frame the whole scene from.
const ROOM_CENTER = grounded(3.039, 1.993, -1.228)
const ROOM_SIZE = new THREE.Vector3(6.865, 3.507, 7.101)
const ROOM_RADIUS = ROOM_SIZE.length() / 2

export function useOfficeMetrics() {
  const { scene } = useGLTF(officeUrl)

  return useMemo(() => {
    if (import.meta.env.DEV) window.__office = { scene }
    return {
      offset: new THREE.Vector3(0, -FLOOR_Y, 0),
      room: { center: ROOM_CENTER, size: ROOM_SIZE, radius: ROOM_RADIUS },
      seat: { eye: SEAT_EYE, look: SEAT_LOOK },
      monitor: {
        center: MONITOR_CENTER,
        size: MONITOR_SIZE,
        frontZ: MONITOR_FRONT_Z,
        facing: MONITOR_FACING,
      },
    }
  }, [scene])
}

useGLTF.preload(officeUrl)
