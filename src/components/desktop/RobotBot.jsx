import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import robotUrl from '@asset/robot_playground.glb'

// A near-stationary press counts as a click (opens the chat); anything that
// dragged further is a horizontal spin instead — the same click-vs-drag
// distance check Office.jsx uses for the monitor, since a plain onClick
// can't tell the two apart once a drag handler is already listening.
const CLICK_DRAG_TOLERANCE = 6
const DRAG_SENSITIVITY = 0.012
const IDLE_SPIN_SPEED = 0.18

function findNodeIndexByName(parser, name) {
  return parser.json.nodes.findIndex((n) => n.name === name)
}

function localMatrixOf(jsonNode) {
  const m = new THREE.Matrix4()
  if (jsonNode.matrix) {
    m.fromArray(jsonNode.matrix)
  } else {
    m.compose(
      new THREE.Vector3(...(jsonNode.translation ?? [0, 0, 0])),
      new THREE.Quaternion(...(jsonNode.rotation ?? [0, 0, 0, 1])),
      new THREE.Vector3(...(jsonNode.scale ?? [1, 1, 1]))
    )
  }
  return m
}

// child index -> parent index, built once by scanning every node's own
// children list (the glTF node array has no back-reference).
function buildParentMap(jsonNodes) {
  const parentOf = new Map()
  jsonNodes.forEach((n, i) => {
    ;(n.children ?? []).forEach((c) => parentOf.set(c, i))
  })
  return parentOf
}

// World matrix of `nodeIndex`, relative to `rootIndex` treated as the top of
// the chain (i.e. rootIndex's own local matrix included, nothing above it).
// Pure data — reads only the static JSON node list, so unlike walking
// `object.matrixWorld` on the live (shared, mutable) Object3D graph, this
// gives the identical answer no matter how many times or in what order it's
// called.
function worldMatrixOf(jsonNodes, parentOf, nodeIndex, rootIndex, cache) {
  if (cache.has(nodeIndex)) return cache.get(nodeIndex)
  const local = localMatrixOf(jsonNodes[nodeIndex])
  let world = local
  if (nodeIndex !== rootIndex) {
    const parentIndex = parentOf.get(nodeIndex)
    if (parentIndex != null) {
      const parentWorld = worldMatrixOf(jsonNodes, parentOf, parentIndex, rootIndex, cache)
      world = parentWorld.clone().multiply(local)
    }
  }
  cache.set(nodeIndex, world)
  return world
}

// The source file's node named "Group" holds the actual bot character (mesh
// + its own self-contained skin) — but Sketchfab's export left it orphaned
// from the glTF scene's node list, alongside a large decorative "holo"
// sculpture that *is* attached and would otherwise be all that renders.
//
// This is a static idle mascot, not an animated one, so the bind pose only
// ever needs computing once — and it's computed entirely from the raw JSON
// node transforms (see worldMatrixOf above) rather than by re-parenting the
// shared Object3D graph useGLTF/getDependency hands back by reference and
// reading live matrixWorld off of it. That live-graph approach both risks
// two builds mutating the same cached objects, and — this asset's mesh parts
// are each authored at their own arbitrary scale, up to 15-20x apart, so it
// only reads back correctly once each part gets the right per-bone
// correction — was occasionally reading a bone's world transform before its
// full ancestor chain had actually been reattached, silently producing a
// stretched or empty model. Deriving bone matrices from JSON data alone has
// no such ordering to get wrong.
async function buildRobot(parser) {
  const groupIndex = findNodeIndexByName(parser, 'Group')
  const jsonNodes = parser.json.nodes
  const parentOf = buildParentMap(jsonNodes)
  const matrixCache = new Map()
  const skin = parser.json.skins[0]
  const boneWorldMatrices = skin.joints.map((jointIndex) =>
    worldMatrixOf(jsonNodes, parentOf, jointIndex, groupIndex, matrixCache)
  )

  // Only ever read from the mesh nodes below — never reparented or moved,
  // so touching this shared cache is safe.
  const meshNodeIndices = jsonNodes
    .map((n, i) => (n.mesh !== undefined && n.skin !== undefined ? i : -1))
    .filter((i) => parentOf.has(i) && isDescendantOf(parentOf, i, groupIndex))

  const group = new THREE.Group()
  group.name = 'RedBotRig'

  const vertex = new THREE.Vector3()
  const skinnedVertex = new THREE.Vector3()
  const transformed = new THREE.Vector3()

  for (const nodeIndex of meshNodeIndices) {
    const sm = await parser.getDependency('node', nodeIndex)
    if (!sm.isSkinnedMesh) continue

    const boneMatrices = sm.skeleton.bones.map((_, i) =>
      new THREE.Matrix4().multiplyMatrices(boneWorldMatrices[i], sm.skeleton.boneInverses[i])
    )

    const geo = sm.geometry
    const posAttr = geo.attributes.position
    const skinIndexAttr = geo.attributes.skinIndex
    const skinWeightAttr = geo.attributes.skinWeight
    const positions = new Float32Array(posAttr.count * 3)

    for (let i = 0; i < posAttr.count; i++) {
      vertex.fromBufferAttribute(posAttr, i)
      skinnedVertex.set(0, 0, 0)
      for (let j = 0; j < 4; j++) {
        const weight = skinWeightAttr.getComponent(i, j)
        if (weight === 0) continue
        const boneIndex = skinIndexAttr.getComponent(i, j)
        transformed.copy(vertex).applyMatrix4(boneMatrices[boneIndex])
        skinnedVertex.addScaledVector(transformed, weight)
      }
      positions[i * 3] = skinnedVertex.x
      positions[i * 3 + 1] = skinnedVertex.y
      positions[i * 3 + 2] = skinnedVertex.z
    }

    const bakedGeo = geo.clone()
    bakedGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    bakedGeo.computeVertexNormals()

    const mesh = new THREE.Mesh(bakedGeo, sm.material)
    mesh.name = sm.name
    mesh.frustumCulled = false
    group.add(mesh)
  }

  return group
}

function isDescendantOf(parentOf, nodeIndex, ancestorIndex) {
  let i = nodeIndex
  while (parentOf.has(i)) {
    i = parentOf.get(i)
    if (i === ancestorIndex) return true
  }
  return false
}

// Built once per page load and reused by every mount — there's only ever
// one robot, and the build above, while safe to re-run, has no reason to.
let robotPromise = null
function getRobot(parser) {
  if (!robotPromise) robotPromise = buildRobot(parser)
  return robotPromise
}

function RobotRig({ rotationRef, draggingRef }) {
  const { parser } = useGLTF(robotUrl)
  const outer = useRef()
  // Framing is applied to this wrapper, not to `target` itself, so repeated
  // mounts can't compound a scale/position onto the one shared robot object.
  const fit = useRef()
  const [target, setTarget] = useState(null)

  useEffect(() => {
    if (!parser) return
    let cancelled = false
    getRobot(parser).then((obj) => {
      if (!cancelled) setTarget(obj)
    })
    return () => {
      cancelled = true
    }
  }, [parser])

  // The model's own scale/origin are unknown, so it's auto-framed from its
  // bounding box instead of hardcoding numbers that would only fit one glb.
  useEffect(() => {
    if (!fit.current || !target) return
    const box = new THREE.Box3().setFromObject(target)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    const scale = 1.7 / maxDim
    fit.current.scale.setScalar(scale)
    fit.current.position.set(-center.x * scale, -center.y * scale, -center.z * scale)
  }, [target])

  useFrame((_, delta) => {
    if (!draggingRef.current) rotationRef.current += delta * IDLE_SPIN_SPEED
    if (outer.current) outer.current.rotation.y = rotationRef.current
  })

  if (!target) return null

  return (
    <group ref={outer}>
      <group ref={fit}>
        <primitive object={target} />
      </group>
    </group>
  )
}

export default function RobotBot({ onOpen, chatOpen }) {
  const rotationRef = useRef(0)
  const draggingRef = useRef(false)
  const startRef = useRef(null)

  const handlePointerDown = (e) => {
    draggingRef.current = true
    startRef.current = { x: e.clientX, rotation: rotationRef.current, moved: 0 }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e) => {
    const start = startRef.current
    if (!start) return
    const dx = e.clientX - start.x
    start.moved = Math.max(start.moved, Math.abs(dx))
    rotationRef.current = start.rotation + dx * DRAG_SENSITIVITY
  }

  const handlePointerUp = (e) => {
    draggingRef.current = false
    const moved = startRef.current?.moved ?? 0
    startRef.current = null
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* pointer capture already released */
    }
    if (moved < CLICK_DRAG_TOLERANCE) onOpen?.()
  }

  return (
    // Taskbar is h-14 (56px) — parked just above it, in the desktop surface
    // itself, hovering over where the clock sits below.
    <div className="fixed z-40 bottom-16 right-2 sm:right-3 flex flex-col items-center gap-1">
      <div
        role="button"
        aria-label="Open RedBot chat"
        title="RedBot — drag to spin, click to chat"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={[
          'w-16 h-16 sm:w-20 sm:h-20 cursor-grab active:cursor-grabbing select-none rounded-full',
          'drop-shadow-[0_0_10px_rgba(0,255,65,0.35)]',
          chatOpen ? 'drop-shadow-[0_0_16px_rgba(0,255,65,0.6)]' : '',
        ].join(' ')}
        style={{ touchAction: 'none' }}
      >
        <Canvas
          camera={{ position: [0, 0.15, 3.1], fov: 28 }}
          gl={{ alpha: true, antialias: true }}
          style={{ background: 'transparent', pointerEvents: 'none' }}
          dpr={[1, 1.75]}
        >
          <ambientLight intensity={0.9} />
          <directionalLight position={[2, 3, 2]} intensity={1.1} />
          <directionalLight position={[-2, -1, -2]} intensity={0.35} color="#00ff41" />
          <Suspense fallback={null}>
            <RobotRig rotationRef={rotationRef} draggingRef={draggingRef} />
          </Suspense>
        </Canvas>
      </div>

      {!chatOpen && (
        <p
          aria-hidden="true"
          className="blink-slow whitespace-nowrap text-[10px] sm:text-[11px] text-[#00ff41] opacity-80 glow-sm select-none pointer-events-none"
        >
          interact with me
        </p>
      )}
    </div>
  )
}

useGLTF.preload(robotUrl)
