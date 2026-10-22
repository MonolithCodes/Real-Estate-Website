import { useMemo } from 'react'
import type { Material } from 'three'
import { useHouseMaterials } from '../materials'
import { gableGeometry, metricBoxGeometry } from '../geometry'
import { GROUND_TOP, UPPER_TOP } from '../layout'
import { Block } from './Block'

const ROOF_T = 0.18
const OVERHANG = 0.45

/** Main gable (over the upper storey): ridge along x. */
const MAIN = { minZ: -5, maxZ: 2.5, minX: -8, maxX: 2.5, rise: 2.4 }
const MAIN_RIDGE_Z = (MAIN.minZ + MAIN.maxZ) / 2
const MAIN_SLOPE = MAIN.rise / ((MAIN.maxZ - MAIN.minZ) / 2)
const MAIN_EAVE_Y = UPPER_TOP - OVERHANG * MAIN_SLOPE

/** Single-storey wing (x 2.5..8): ridge along z. */
const WING = { minX: 2.5, maxX: 8, minZ: -5, maxZ: 5, rise: 1.55 }
const WING_RIDGE_X = (WING.minX + WING.maxX) / 2
const WING_SLOPE = WING.rise / ((WING.maxX - WING.minX) / 2)

interface PanelProps {
  /** Eave and ridge in the panel's cross-section (u across the ridge, y up). */
  eave: readonly [number, number]
  ridge: readonly [number, number]
  /** Extent along the ridge. */
  span: readonly [number, number]
  material: Material
}

/**
 * A roof plane spanning from eave to ridge, with the ridge along local x (u = local z). The standing
 * seams in the texture run down the slope. Wrap in a rotated group for ridges along z.
 */
function RoofPanel({ eave, ridge, span, material }: PanelProps) {
  const [a, b] = eave[0] < ridge[0] ? [eave, ridge] : [ridge, eave]
  const du = b[0] - a[0]
  const dy = b[1] - a[1]
  const length = Math.hypot(du, dy)
  const angle = Math.atan2(-dy, du)
  const geometry = useMemo(() => metricBoxGeometry(span[1] - span[0], ROOF_T, length), [span, length])
  // Lift the panel by half its thickness along its normal so it sits on the eave–ridge line.
  const ny = Math.cos(angle)
  const nz = Math.sin(angle)
  return (
    <mesh
      geometry={geometry}
      material={material}
      rotation={[angle, 0, 0]}
      position={[(span[0] + span[1]) / 2, (a[1] + b[1]) / 2 + (ny * ROOF_T) / 2, (a[0] + b[0]) / 2 + (nz * ROOF_T) / 2]}
    />
  )
}

/** Gabled standing-seam roof: main gable, the wing's lower gable, the flat front roof and gable infills. */
export function Roof() {
  const m = useHouseMaterials()
  const mainGable = useMemo(() => gableGeometry(MAIN.maxZ - MAIN.minZ, MAIN.rise), [])
  const wingGable = useMemo(() => gableGeometry(WING.maxX - WING.minX, WING.rise), [])
  const mainSpan = [MAIN.minX - OVERHANG, MAIN.maxX + OVERHANG] as const
  const wingSpan = [WING.minZ - OVERHANG, WING.maxZ + OVERHANG] as const
  const mainRidge = [MAIN_RIDGE_Z, UPPER_TOP + MAIN.rise] as const
  const wingRidge = [WING_RIDGE_X, GROUND_TOP + WING.rise] as const

  return (
    <group>
      <RoofPanel eave={[MAIN.minZ - OVERHANG, MAIN_EAVE_Y]} ridge={mainRidge} span={mainSpan} material={m.roof} />
      <RoofPanel eave={[MAIN.maxZ + OVERHANG, MAIN_EAVE_Y]} ridge={mainRidge} span={mainSpan} material={m.roof} />
      {[MAIN.minX, MAIN.maxX].map((x) => (
        <mesh key={x} geometry={mainGable} material={m.render} position={[x, UPPER_TOP, MAIN.maxZ]} rotation={[0, Math.PI / 2, 0]} />
      ))}

      {/* Ridge along z: rotate so local x runs along world −z and local z along world x. */}
      <group rotation={[0, Math.PI / 2, 0]}>
        <RoofPanel eave={[WING.maxX + OVERHANG, GROUND_TOP - OVERHANG * WING_SLOPE]} ridge={wingRidge} span={wingSpan} material={m.roof} />
        <RoofPanel eave={[WING.minX, GROUND_TOP]} ridge={wingRidge} span={wingSpan} material={m.roof} />
      </group>
      {[WING.minZ, WING.maxZ].map((z) => (
        <mesh key={z} geometry={wingGable} material={m.render} position={[WING.minX, GROUND_TOP, z]} />
      ))}

      <Block b={[-8.2, 2.5, GROUND_TOP, GROUND_TOP + 0.2, 2.5, 5.3]} material={m.roof} />
      <Block b={[-8.25, 2.55, GROUND_TOP + 0.2, GROUND_TOP + 0.26, 5.24, 5.34]} material={m.charcoal} noEdges />
    </group>
  )
}

/** Stone chimney on the rear slope; drops in last. */
export function Chimney() {
  const m = useHouseMaterials()
  return (
    <group>
      <Block b={[-7, -5.9, 7.2, 10.6, -3.75, -2.65]} material={m.stone} />
      <Block b={[-7.12, -5.78, 10.6, 10.75, -3.87, -2.53]} material={m.charcoal} />
      <Block b={[-6.6, -6.3, 10.75, 11.05, -3.35, -3.05]} material={m.charcoal} noEdges />
    </group>
  )
}
