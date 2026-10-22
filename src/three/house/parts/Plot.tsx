import { useMemo } from 'react'
import { BufferGeometry, Float32BufferAttribute } from 'three'
import { useHouseMaterials } from '../materials'
import { roundedRectShape, slabGeometry } from '../geometry'
import { PLOT, POOL } from '../layout'
import { Block } from './Block'

const PIT_MARGIN = 0.05
const GRID_STEP = 4
const MARKER_INSET = 1.2
const PIT = { minX: POOL.minX - PIT_MARGIN, maxX: POOL.maxX + PIT_MARGIN, minZ: POOL.minZ - PIT_MARGIN, maxZ: POOL.maxZ + PIT_MARGIN }

/** Raised land slab with a survey grid, boundary markers and the excavated pool pit. */
export function Plot() {
  const m = useHouseMaterials()

  const slab = useMemo(() => {
    const geometry = slabGeometry(roundedRectShape(PLOT.minX, PLOT.maxX, -PLOT.maxZ, -PLOT.minZ, PLOT.radius), [PIT], PLOT.depth, 8)
    geometry.translate(0, -PLOT.depth, 0)
    return geometry
  }, [])

  const survey = useMemo(() => {
    const points: number[] = []
    const inset = 1.5
    const y = 0.012
    for (let x = Math.ceil((PLOT.minX + inset) / GRID_STEP) * GRID_STEP; x <= PLOT.maxX - inset; x += GRID_STEP) {
      points.push(x, y, PLOT.minZ + inset, x, y, PLOT.maxZ - inset)
    }
    for (let z = Math.ceil((PLOT.minZ + inset) / GRID_STEP) * GRID_STEP; z <= PLOT.maxZ - inset; z += GRID_STEP) {
      points.push(PLOT.minX + inset, y, z, PLOT.maxX - inset, y, z)
    }
    const geometry = new BufferGeometry()
    geometry.setAttribute('position', new Float32BufferAttribute(points, 3))
    return geometry
  }, [])

  const markers: [number, number][] = [
    [PLOT.minX + MARKER_INSET, PLOT.minZ + MARKER_INSET],
    [PLOT.maxX - MARKER_INSET, PLOT.minZ + MARKER_INSET],
    [PLOT.maxX - MARKER_INSET, PLOT.maxZ - MARKER_INSET],
    [PLOT.minX + MARKER_INSET, PLOT.maxZ - MARKER_INSET],
  ]

  return (
    <group>
      <mesh geometry={slab} material={[m.grass, m.earth]} />
      <lineSegments geometry={survey} material={m.surveyLines} />
      <Block b={[PIT.minX, PIT.maxX, POOL.floor - 0.05, 0, PIT.minZ, PIT.maxZ]} material={m.pit} noEdges />
      {markers.map(([x, z]) => (
        <group key={`${x}:${z}`}>
          <Block b={[x - 0.07, x + 0.07, 0, 0.8, z - 0.07, z + 0.07]} material={m.render} noEdges />
          <Block b={[x - 0.09, x + 0.09, 0.8, 0.9, z - 0.09, z + 0.09]} material={m.gold} noEdges />
        </group>
      ))}
    </group>
  )
}
