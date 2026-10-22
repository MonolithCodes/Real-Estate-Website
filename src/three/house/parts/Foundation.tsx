import { useLayoutEffect, useMemo, useRef } from 'react'
import { CylinderGeometry, Matrix4 } from 'three'
import type { InstancedMesh } from 'three'
import { useHouseMaterials } from '../materials'
import { wallFrame } from '../geometry'
import { SLAB_TOP, groundWalls } from '../layout'
import { Block } from './Block'

const REBAR_SPACING = 2
const REBAR_HEIGHT = 0.7

/** Concrete slab on a perimeter footing, with starter bars along the wall lines (hidden once walls rise). */
export function Foundation() {
  const m = useHouseMaterials()
  const rebar = useRef<InstancedMesh>(null)
  const geometry = useMemo(() => new CylinderGeometry(0.02, 0.02, REBAR_HEIGHT, 5), [])

  const points = useMemo(() => {
    const out: [number, number][] = []
    for (const spec of groundWalls) {
      const frame = wallFrame(spec)
      const steps = Math.floor(frame.length / REBAR_SPACING)
      for (let i = 1; i < steps; i++) {
        const u = (i / steps) * (frame.length - 0.25) + 0.125
        out.push([frame.position[0] + Math.cos(-frame.rotationY) * u, frame.position[2] + Math.sin(-frame.rotationY) * u])
      }
    }
    return out
  }, [])

  useLayoutEffect(() => {
    const mesh = rebar.current
    if (!mesh) return
    const matrix = new Matrix4()
    points.forEach(([x, z], i) => mesh.setMatrixAt(i, matrix.makeTranslation(x, SLAB_TOP + REBAR_HEIGHT / 2, z)))
    mesh.instanceMatrix.needsUpdate = true
  }, [points])

  return (
    <group>
      <Block b={[-8.55, 8.55, 0, 0.12, -5.55, 5.55]} material={m.stoneTrim} />
      <Block b={[-8.3, 8.3, 0.12, SLAB_TOP, -5.3, 5.3]} material={m.concrete} />
      <instancedMesh ref={rebar} args={[geometry, m.charcoal, points.length]} />
    </group>
  )
}
