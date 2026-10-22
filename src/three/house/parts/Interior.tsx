import { useHouseMaterials } from '../materials'
import { GROUND_TOP, SLAB_TOP, UPPER_BASE, UPPER_TOP } from '../layout'
import { Block } from './Block'
import type { Bounds } from './Block'

const F0 = SLAB_TOP
const F1 = UPPER_BASE

/** Bounds helper for furniture: centre x/z, footprint w × d, from height y0 to y1. */
const at = (x: number, z: number, w: number, d: number, y0: number, y1: number): Bounds => [x - w / 2, x + w / 2, y0, y1, z - d / 2, z + d / 2]

function Pendant({ x, z, y, wide }: { x: number; z: number; y: number; wide?: boolean }) {
  const m = useHouseMaterials()
  return (
    <group>
      <Block b={at(x, z, 0.015, 0.015, y + 0.2, y + 1.3)} material={m.charcoal} noEdges />
      <mesh material={m.glow} position={[x, y + 0.1, z]}>
        <cylinderGeometry args={wide ? [0.3, 0.42, 0.22, 20] : [0.14, 0.2, 0.26, 16]} />
      </mesh>
    </group>
  )
}

/**
 * Furnished rooms in warm oak: kitchen with island and pendants, dining, living, study and two bedrooms.
 * Simple blocks, so the cutaway reads as lived-in without the polygon cost.
 */
export function Interior() {
  const m = useHouseMaterials()
  return (
    <group>
      {/* Floors */}
      <Block b={[-7.88, 7.88, F0, F0 + 0.02, -4.88, 4.88]} material={m.oak} noEdges />
      <Block b={[-7.88, 2.38, F1, F1 + 0.02, -4.88, 2.38]} material={m.oak} noEdges />

      {/* Partitions */}
      <Block b={[-4.06, -3.94, F0, GROUND_TOP, -4.88, 0.6]} material={m.render} />
      <Block b={[-2.56, -2.44, F1, UPPER_TOP, -4.88, 2.38]} material={m.render} />

      {/* Kitchen: run along the back wall, island with stools, pendants */}
      <Block b={at(-1.1, -4.5, 5.4, 0.62, F0, F0 + 0.86)} material={m.render} />
      <Block b={at(-1.1, -4.5, 5.5, 0.66, F0 + 0.86, F0 + 0.92)} material={m.stoneTrim} />
      <Block b={at(-1.1, -1.6, 2.8, 1, F0, F0 + 0.86)} material={m.oak} />
      <Block b={at(-1.1, -1.6, 3, 1.1, F0 + 0.86, F0 + 0.92)} material={m.stoneTrim} />
      {[-2, -1.1, -0.2].map((x) => (
        <Block key={x} b={at(x, -0.75, 0.4, 0.4, F0, F0 + 0.72)} material={m.charcoal} />
      ))}
      {[-2, -1.1, -0.2].map((x) => (
        <Pendant key={x} x={x} z={-1.6} y={F0 + 1.95} />
      ))}

      {/* Dining */}
      <Block b={at(-1.1, 3.5, 2.4, 1, F0 + 0.72, F0 + 0.78)} material={m.oak} />
      {[-2.1, -0.1].map((x) => (
        <Block key={x} b={at(x, 3.5, 0.08, 0.85, F0, F0 + 0.72)} material={m.charcoal} />
      ))}
      {[-1.9, -1.1, -0.3].flatMap((x) =>
        [2.72, 4.28].map((z) => (
          <group key={`${x}:${z}`}>
            <Block b={at(x, z, 0.46, 0.46, F0 + 0.28, F0 + 0.48)} material={m.fabric} />
            <Block b={at(x, z + (z < 3.5 ? -0.2 : 0.2), 0.46, 0.06, F0 + 0.48, F0 + 0.95)} material={m.fabric} />
          </group>
        )),
      )}
      <Pendant x={-1.1} z={3.5} y={F0 + 1.75} wide />

      {/* Living (vaulted wing) */}
      <Block b={at(5.3, 0.3, 3.8, 3, F0 + 0.02, F0 + 0.035)} material={m.fabricDark} noEdges />
      <Block b={at(5.5, -1.3, 3, 0.95, F0, F0 + 0.44)} material={m.fabric} />
      <Block b={at(5.5, -1.72, 3, 0.2, F0 + 0.44, F0 + 0.86)} material={m.fabric} />
      <Block b={at(6.55, -0.05, 0.95, 1.6, F0, F0 + 0.44)} material={m.fabric} />
      <Block b={at(5.1, 0.45, 1.3, 0.8, F0, F0 + 0.36)} material={m.oak} />
      <Block b={at(3.5, 1.5, 0.9, 0.9, F0, F0 + 0.75)} material={m.fabricDark} />
      <Block b={at(7.35, -2, 0.04, 0.04, F0, F0 + 1.5)} material={m.charcoal} noEdges />
      <Block b={at(7.35, -2, 0.36, 0.36, F0 + 1.5, F0 + 1.75)} material={m.glow} />

      {/* Study */}
      <Block b={at(-7.62, -2.6, 0.36, 2.4, F0, F0 + 2.2)} material={m.oak} />
      <Block b={at(-6, -3.9, 1.6, 0.7, F0 + 0.72, F0 + 0.77)} material={m.oak} />
      <Block b={at(-6, -3.2, 0.5, 0.5, F0, F0 + 0.9)} material={m.charcoal} />
      <Block b={at(-6, 1.6, 2.6, 2, F0 + 0.02, F0 + 0.035)} material={m.fabric} noEdges />

      {/* Primary suite */}
      <Block b={at(-5.3, -2.7, 3, 2.8, F1 + 0.02, F1 + 0.035)} material={m.fabricDark} noEdges />
      <Block b={at(-5.3, -2.8, 2, 2.2, F1, F1 + 0.32)} material={m.fabricDark} />
      <Block b={at(-5.3, -2.75, 1.9, 2.05, F1 + 0.32, F1 + 0.56)} material={m.fabric} />
      <Block b={at(-5.3, -3.94, 2.3, 0.12, F1, F1 + 1.15)} material={m.oak} />
      {[-5.75, -4.85].map((x) => (
        <Block key={x} b={at(x, -3.6, 0.62, 0.36, F1 + 0.56, F1 + 0.7)} material={m.fabric} noEdges />
      ))}
      {[-6.75, -3.85].map((x) => (
        <group key={x}>
          <Block b={at(x, -3.6, 0.5, 0.45, F1, F1 + 0.5)} material={m.oak} />
          <Block b={at(x, -3.6, 0.22, 0.22, F1 + 0.5, F1 + 0.78)} material={m.glow} />
        </group>
      ))}

      {/* Second bedroom */}
      <Block b={at(0, -3.1, 1.6, 2.1, F1, F1 + 0.5)} material={m.fabric} />
      <Block b={at(0, -4.1, 1.8, 0.12, F1, F1 + 1)} material={m.oak} />
      <Block b={at(1.6, 1.2, 0.9, 0.9, F1, F1 + 0.75)} material={m.fabricDark} />
    </group>
  )
}
