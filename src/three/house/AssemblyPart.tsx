import { useLayoutEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import {
  BufferGeometry,
  EdgesGeometry,
  Float32BufferAttribute,
  InstancedMesh,
  Line,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  Mesh,
  Vector3,
} from 'three'
import type { Group, Material, Object3D } from 'three'
import { smoothstep } from '../../components/home/HeroStory/storyRuntime'
import { tokenColor } from '../palette'
import { roleMaterials, sceneState } from '../sceneState'
import type { MaterialRole } from '../sceneState'
import { createPose, samplePose } from './assembly'
import type { PartId, Pose, Vec3 } from './assembly'
import { partConfig } from './assemblyConfig'
import { PartProgressContext, partRegistry } from './partContext'
import type { PartProgress } from './partContext'

const ORIGIN: Vec3 = [0, 0, 0]
/** Damping (seconds to settle) on top of the scrubbed progress: gives each part a little inertia. */
const POSE_SMOOTH = 0.14
const OPACITY_SMOOTH = 0.12
const IDLE_BOB = 0.35
const WIRE_MAX = 0.85

interface PartRuntime {
  setOpacity: (solid: number, wire: number) => void
  dispose: () => void
}

/**
 * Takes over a subtree: clones its materials (so the part fades independently), registers time-of-day
 * roles, and merges gold blueprint edges for every mesh into a single LineSegments draw call.
 */
function preparePart(root: Object3D, blueprint: boolean): PartRuntime {
  const clones = new Map<Material, Material>()
  const objects: { obj: Mesh | Line; original: Material | Material[] }[] = []
  const positions: number[] = []
  const toRoot = new Matrix4()
  const v = new Vector3()

  root.updateWorldMatrix(true, true)
  const inverseRoot = root.matrixWorld.clone().invert()

  const cloneOf = (material: Material): Material => {
    let clone = clones.get(material)
    if (!clone) {
      clone = material.clone()
      clone.userData.baseOpacity = material.opacity
      clone.userData.baseTransparent = material.transparent
      clone.userData.baseDepthWrite = material.depthWrite
      const role = material.userData.role as MaterialRole | undefined
      if (role) roleMaterials[role].add(clone)
      clones.set(material, clone)
    }
    return clone
  }

  root.traverse((obj) => {
    if (!(obj instanceof Mesh || obj instanceof Line) || obj.userData.assemblyIgnore) return
    objects.push({ obj, original: obj.material })
    obj.material = Array.isArray(obj.material) ? obj.material.map(cloneOf) : cloneOf(obj.material)

    if (blueprint && obj instanceof Mesh && !(obj instanceof InstancedMesh) && !obj.userData.noEdges) {
      const edges = new EdgesGeometry(obj.geometry, 25)
      toRoot.multiplyMatrices(inverseRoot, obj.matrixWorld)
      const array = edges.attributes.position.array
      for (let i = 0; i < array.length; i += 3) {
        v.fromArray(array, i).applyMatrix4(toRoot)
        positions.push(v.x, v.y, v.z)
      }
      edges.dispose()
    }
  })

  let lines: LineSegments | null = null
  if (positions.length) {
    const geometry = new BufferGeometry()
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
    const material = new LineBasicMaterial({ color: tokenColor('--gold'), transparent: true, opacity: 0, depthWrite: false })
    lines = new LineSegments(geometry, material)
    lines.userData.assemblyIgnore = true
    lines.raycast = () => {}
    root.add(lines)
  }

  let meshesVisible = true
  return {
    setOpacity(solid, wire) {
      const show = solid > 0.003
      if (show !== meshesVisible) {
        meshesVisible = show
        objects.forEach(({ obj }) => (obj.visible = show))
      }
      if (show) {
        clones.forEach((m) => {
          const transparent = m.userData.baseTransparent || solid < 0.999
          if (m.transparent !== transparent) {
            m.transparent = transparent
            m.needsUpdate = true
          }
          m.opacity = m.userData.baseOpacity * solid
          m.depthWrite = m.userData.baseDepthWrite && solid > 0.6
        })
      }
      if (lines) {
        lines.visible = wire > 0.003
        ;(lines.material as LineBasicMaterial).opacity = wire
      }
    },
    dispose() {
      objects.forEach(({ obj, original }) => {
        obj.material = original
        obj.visible = true
      })
      clones.forEach((clone) => {
        const role = clone.userData.role as MaterialRole | undefined
        if (role) roleMaterials[role].delete(clone)
        clone.dispose()
      })
      if (lines) {
        root.remove(lines)
        lines.geometry.dispose()
        ;(lines.material as Material).dispose()
      }
    },
  }
}

interface FrameState {
  pose: Pose
  target: Vector3
  solid: number
  wire: number
  phase: number
  snapped: boolean
}

const phaseOf = (id: string) => [...id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) * 0.37

interface AssemblyPartProps {
  id: PartId
  /** Quality tier allows the blueprint edge pass. */
  blueprint: boolean
  children: ReactNode
}

/** Drives one house part from scroll progress using its entry in assemblyConfig.ts. */
export function AssemblyPart({ id, blueprint, children }: AssemblyPartProps) {
  const config = partConfig[id]
  const pivot = config.pivot ?? ORIGIN
  const useBlueprint = blueprint && config.blueprint !== false
  const outer = useRef<Group>(null)
  const inner = useRef<Group>(null)
  const runtime = useRef<PartRuntime | null>(null)
  const progress = useRef<PartProgress>({ t: 0, solid: 0 })
  const frameRef = useRef<FrameState | null>(null)

  useLayoutEffect(() => {
    if (!inner.current || !outer.current) return
    const rt = preparePart(inner.current, useBlueprint)
    runtime.current = rt
    partRegistry.set(id, outer.current)
    return () => {
      rt.dispose()
      runtime.current = null
      partRegistry.delete(id)
    }
  }, [id, useBlueprint])

  useFrame((_, delta) => {
    const group = outer.current
    const rt = runtime.current
    if (!group || !rt) return
    frameRef.current ??= { pose: createPose(), target: new Vector3(), solid: 0, wire: 0, phase: phaseOf(id), snapped: false }
    const frame = frameRef.current
    const { pose, target } = frame
    const t = samplePose(config, sceneState.p, pose)
    progress.current.t = t

    const bob = t < 1 ? Math.sin(sceneState.time * 0.7 + frame.phase) * IDLE_BOB * (1 - t) : 0
    target.set(pivot[0] + pose.position[0], pivot[1] + pose.position[1] + bob, pivot[2] + pose.position[2])

    // Opacity: blueprint parts stay as gold line-work until late in their range, then turn solid.
    let solid = pose.opacity
    let wire = 0
    if (config.blueprint !== false) {
      if (useBlueprint) {
        solid = Math.min(pose.opacity, config.from.opacity + (1 - config.from.opacity) * smoothstep(0.55, 1, t))
        const assembling = (1 - smoothstep(0.7, 1, t)) * WIRE_MAX
        const ghost = t >= 1 ? (1 - pose.opacity) * 0.6 : 0
        wire = Math.max(assembling, ghost)
      } else {
        solid = Math.max(pose.opacity, 0.4 * (1 - t))
      }
    }

    // First frame snaps to the pose (no fly-in from the origin on load or after a quality change).
    if (!frame.snapped) {
      frame.snapped = true
      group.position.copy(target)
      group.rotation.set(pose.rotation[0], pose.rotation[1], pose.rotation[2])
      group.scale.set(pose.scale[0], pose.scale[1], pose.scale[2])
      frame.solid = solid
      frame.wire = wire
    } else {
      easing.damp3(group.position, target, POSE_SMOOTH, delta)
      easing.dampE(group.rotation, pose.rotation, POSE_SMOOTH, delta)
      easing.damp3(group.scale, pose.scale, POSE_SMOOTH, delta)
      easing.damp(frame, 'solid', solid, OPACITY_SMOOTH, delta)
      easing.damp(frame, 'wire', wire, OPACITY_SMOOTH, delta)
    }
    progress.current.solid = frame.solid
    rt.setOpacity(frame.solid, frame.wire)
  })

  return (
    <group ref={outer} name={id}>
      <group ref={inner} position={[-pivot[0], -pivot[1], -pivot[2]]}>
        <PartProgressContext value={progress}>{children}</PartProgressContext>
      </group>
    </group>
  )
}
