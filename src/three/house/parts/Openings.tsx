import { useMemo } from 'react'
import { PlaneGeometry } from 'three'
import { useHouseMaterials } from '../materials'
import { wallFrame, wallGeometry } from '../geometry'
import type { WallFrame } from '../geometry'
import { GROUND_TOP, SLAB_TOP, UPPER_BASE, UPPER_TOP, WALL_T, groundWalls, upperWalls } from '../layout'
import type { Opening } from '../layout'
import { Block } from './Block'

/** Black steel frame section (face width) and depth. */
const F = 0.07
const D = 0.14
/** Frames sit slightly proud of the wall's centre line, towards the outside. */
const FRAME_Z = 0.03

const allFrames: readonly WallFrame[] = [...groundWalls, ...upperWalls].map((spec) => wallFrame(spec))

/** Vertical mullion positions (local x) dividing wide openings into panes of about 1.2 m. */
function mullions(o: Opening): number[] {
  const panes = o.kind === 'slider' ? 2 : Math.max(1, Math.round(o.width / 1.2))
  return Array.from({ length: panes - 1 }, (_, i) => o.offset + ((i + 1) * o.width) / panes)
}

function OpeningFrame({ o }: { o: Opening }) {
  const m = useHouseMaterials()
  const x0 = o.offset
  const x1 = o.offset + o.width
  const y0 = o.sill
  const y1 = o.sill + o.height
  const z0 = FRAME_Z - D / 2
  const z1 = FRAME_Z + D / 2

  if (o.kind === 'entry') {
    // Timber double door in a black frame, with gold pulls on both faces.
    return (
      <group>
        <Block b={[x0, x0 + F, y0, y1, z0, z1]} material={m.charcoal} />
        <Block b={[x1 - F, x1, y0, y1, z0, z1]} material={m.charcoal} />
        <Block b={[x0, x1, y1 - F, y1, z0, z1]} material={m.charcoal} />
        <Block b={[x0 + F, x1 - F, y0, y1 - F, -0.03, 0.03]} material={m.timber} />
        <Block b={[(x0 + x1) / 2 - 0.006, (x0 + x1) / 2 + 0.006, y0 + 0.02, y1 - F, 0.03, 0.035]} material={m.charcoal} noEdges />
        {[-1, 1].map((side) => (
          <Block
            key={side}
            b={[(x0 + x1) / 2 + side * 0.12 - 0.02, (x0 + x1) / 2 + side * 0.12 + 0.02, 0.75, 1.45, side > 0 ? 0.03 : -0.07, side > 0 ? 0.07 : -0.03]}
            material={m.gold}
            noEdges
          />
        ))}
      </group>
    )
  }

  return (
    <group>
      <Block b={[x0, x0 + F, y0, y1, z0, z1]} material={m.charcoal} />
      <Block b={[x1 - F, x1, y0, y1, z0, z1]} material={m.charcoal} />
      <Block b={[x0, x1, y1 - F, y1, z0, z1]} material={m.charcoal} />
      <Block b={[x0, x1, y0, y0 + F, z0, z1 + (o.sill > 0 ? 0.06 : 0)]} material={m.charcoal} />
      {mullions(o).map((x) => (
        <Block key={x} b={[x - F / 2, x + F / 2, y0, y1, z0 + 0.02, z1 - 0.02]} material={m.charcoal} />
      ))}
    </group>
  )
}

/** Black window and door frames for every opening. */
export function Frames() {
  return (
    <group>
      {allFrames.map((frame, i) => (
        <group key={i} position={frame.position} rotation={[0, frame.rotationY, 0]}>
          {frame.openings.map((o) => (
            <OpeningFrame key={o.offset} o={o} />
          ))}
        </group>
      ))}
    </group>
  )
}

/** Glass panes. Plain transparent physical material (no transmission pass); glows warm at dusk. */
export function Glazing() {
  const m = useHouseMaterials()
  const panes = useMemo(
    () =>
      allFrames.map((frame) =>
        frame.openings
          .filter((o) => o.kind !== 'entry')
          .map((o) => ({ o, geometry: new PlaneGeometry(o.width - F * 2, o.height - F * 2) })),
      ),
    [],
  )
  return (
    <group>
      {allFrames.map((frame, i) => (
        <group key={i} position={frame.position} rotation={[0, frame.rotationY, 0]}>
          {panes[i].map(({ o, geometry }) => (
            <mesh key={o.offset} geometry={geometry} material={m.glass} position={[o.offset + o.width / 2, o.sill + o.height / 2, FRAME_Z]} />
          ))}
        </group>
      ))}
    </group>
  )
}

/** Stone cladding on the front-left piers of both storeys (wipes across during stage 04). */
export function Cladding() {
  const m = useHouseMaterials()
  const front = WALL_T / 2
  const upperFront = useMemo(() => wallGeometry(3.95, UPPER_TOP - UPPER_BASE, [], 0.06), [])
  return (
    <group>
      <Block b={[-8.18, -4.35, SLAB_TOP, GROUND_TOP, 5 + front, 5 + front + 0.06]} material={m.stone} />
      <mesh geometry={upperFront} material={m.stone} position={[-8.18, UPPER_BASE, 2.5 + front + 0.03]} />
      <Block b={[-8.22, -4.31, GROUND_TOP - 0.06, GROUND_TOP, 5 + front, 5 + front + 0.1]} material={m.stoneTrim} noEdges />
    </group>
  )
}
