import { useLayoutEffect, useMemo, useRef } from 'react'
import { BoxGeometry, Matrix4, MeshStandardMaterial, PlaneGeometry } from 'three'
import type { InstancedMesh, Mesh } from 'three'
import { useFrame } from '@react-three/fiber'
import { useHouseMaterials } from '../materials'
import { rectShape, slabGeometry } from '../geometry'
import { DECK, PORCH, POOL } from '../layout'
import { Block } from './Block'

const COLUMN_X = [-7.7, -5, -2.6, 0, 2.3] as const
const COLUMN_Z = 7.1
const PORCH_ROOF_Y = 3

/** Timber deck around the pool, the covered porch with columns, and outdoor seating. */
export function Exterior() {
  const m = useHouseMaterials()
  const columns = useRef<InstancedMesh>(null)
  const columnGeometry = useMemo(() => new BoxGeometry(0.24, PORCH_ROOF_Y - DECK.top, 0.24), [])
  const deck = useMemo(() => slabGeometry(rectShape(DECK), [POOL], DECK.top), [])

  useLayoutEffect(() => {
    const mesh = columns.current
    if (!mesh) return
    const matrix = new Matrix4()
    COLUMN_X.forEach((x, i) => mesh.setMatrixAt(i, matrix.makeTranslation(x, (PORCH_ROOF_Y + DECK.top) / 2, COLUMN_Z)))
    mesh.instanceMatrix.needsUpdate = true
  }, [])

  return (
    <group>
      <mesh geometry={deck} material={m.timber} />
      <Block b={[PORCH.minX, PORCH.maxX, 0, DECK.top, PORCH.minZ, PORCH.maxZ]} material={m.timber} />
      <Block b={[PORCH.minX - 0.2, PORCH.maxX + 0.1, PORCH_ROOF_Y, PORCH_ROOF_Y + 0.16, PORCH.minZ, PORCH.maxZ + 0.1]} material={m.roof} />
      <Block b={[PORCH.minX - 0.2, PORCH.maxX + 0.1, PORCH_ROOF_Y - 0.12, PORCH_ROOF_Y, PORCH.maxZ - 0.1, PORCH.maxZ + 0.1]} material={m.charcoal} noEdges />
      <instancedMesh ref={columns} args={[columnGeometry, m.render, COLUMN_X.length]} />
      {/* Porch steps */}
      <Block b={[-2.4, -0.4, 0, 0.15, PORCH.maxZ, PORCH.maxZ + 0.35]} material={m.timber} />

      {/* Outdoor sofa and fire table at the end of the pool */}
      <Block b={[10, 13.2, DECK.top, DECK.top + 0.4, 6.7, 7.5]} material={m.fabric} />
      <Block b={[10, 13.2, DECK.top + 0.4, DECK.top + 0.8, 7.3, 7.5]} material={m.fabric} />
      <Block b={[10.9, 12.3, DECK.top, DECK.top + 0.35, 5.8, 6.4]} material={m.charcoal} />
      {/* Loungers */}
      {[-0.5, 1.6].map((z) => (
        <group key={z}>
          <Block b={[14.3, 15, DECK.top + 0.1, DECK.top + 0.3, z - 0.95, z + 0.95]} material={m.fabric} />
          <Block b={[14.3, 15, DECK.top + 0.3, DECK.top + 0.65, z - 0.95, z - 0.75]} material={m.fabric} />
        </group>
      ))}
    </group>
  )
}

/** Pool basin with tiled, softly glowing walls, coping, and a rippling water surface. */
export function Pool() {
  const m = useHouseMaterials()
  const water = useRef<Mesh>(null)
  const waterGeometry = useMemo(() => {
    const g = new PlaneGeometry(POOL.maxX - POOL.minX, POOL.maxZ - POOL.minZ)
    g.rotateX(-Math.PI / 2)
    return g
  }, [])

  // Scroll the ripple normal map. The material is the part's clone, so read it from the mesh.
  useFrame((_, delta) => {
    const material = water.current?.material
    if (!(material instanceof MeshStandardMaterial) || !material.normalMap) return
    material.normalMap.offset.x += delta * 0.02
    material.normalMap.offset.y += delta * 0.035
  })

  const c = 0.32
  return (
    <group>
      <Block b={[POOL.minX, POOL.maxX, POOL.floor, DECK.top, POOL.minZ, POOL.maxZ]} material={m.poolTile} noEdges />
      <mesh
        ref={water}
        geometry={waterGeometry}
        material={m.water}
        position={[(POOL.minX + POOL.maxX) / 2, POOL.water, (POOL.minZ + POOL.maxZ) / 2]}
      />
      <Block b={[POOL.minX - c, POOL.maxX + c, DECK.top, DECK.top + 0.06, POOL.minZ - c, POOL.minZ]} material={m.render} />
      <Block b={[POOL.minX - c, POOL.maxX + c, DECK.top, DECK.top + 0.06, POOL.maxZ, POOL.maxZ + c]} material={m.render} />
      <Block b={[POOL.minX - c, POOL.minX, DECK.top, DECK.top + 0.06, POOL.minZ, POOL.maxZ]} material={m.render} />
      <Block b={[POOL.maxX, POOL.maxX + c, DECK.top, DECK.top + 0.06, POOL.minZ, POOL.maxZ]} material={m.render} />
    </group>
  )
}
