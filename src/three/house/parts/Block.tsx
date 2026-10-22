import { useMemo } from 'react'
import type { Material } from 'three'
import { metricBoxGeometry } from '../geometry'

/** Axis-aligned bounds: [minX, maxX, minY, maxY, minZ, maxZ] in metres. */
export type Bounds = readonly [number, number, number, number, number, number]

interface BlockProps {
  b: Bounds
  material: Material
  /** Skip gold blueprint edges (tiny or flat details). */
  noEdges?: boolean
}

/** A box placed by its bounds. The building block for slabs, furniture and trim. */
export function Block({ b, material, noEdges }: BlockProps) {
  const [x0, x1, y0, y1, z0, z1] = b
  const geometry = useMemo(() => metricBoxGeometry(x1 - x0, y1 - y0, z1 - z0), [x0, x1, y0, y1, z0, z1])
  return (
    <mesh
      geometry={geometry}
      material={material}
      position={[(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2]}
      userData={noEdges ? { noEdges: true } : undefined}
    />
  )
}
