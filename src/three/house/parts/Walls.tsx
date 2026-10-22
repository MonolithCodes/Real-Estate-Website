import { useMemo } from 'react'
import type { Material } from 'three'
import { useHouseMaterials } from '../materials'
import { wallFrame, wallGeometry } from '../geometry'
import { GROUND_TOP, UPPER_BASE, groundWalls, upperWalls } from '../layout'
import type { WallSpec } from '../layout'
import { Block } from './Block'

export function Wall({ spec, material }: { spec: WallSpec; material: Material }) {
  const frame = useMemo(() => wallFrame(spec), [spec])
  const geometry = useMemo(() => wallGeometry(frame.length, spec.height, frame.openings), [frame, spec.height])
  return <mesh geometry={geometry} material={material} position={frame.position} rotation={[0, frame.rotationY, 0]} />
}

/** Ground-floor render walls with real window and door openings. */
export function GroundWalls() {
  const m = useHouseMaterials()
  return (
    <group>
      {groundWalls.map((spec, i) => (
        <Wall key={i} spec={spec} material={m.render} />
      ))}
    </group>
  )
}

/** Upper storey: floor slab plus walls, set back from the front and east elevations. */
export function UpperWalls() {
  const m = useHouseMaterials()
  return (
    <group>
      <Block b={[-8.1, 2.6, GROUND_TOP, UPPER_BASE, -5.1, 2.6]} material={m.concrete} />
      {upperWalls.map((spec, i) => (
        <Wall key={i} spec={spec} material={m.render} />
      ))}
    </group>
  )
}
