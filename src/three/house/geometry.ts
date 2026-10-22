import { BoxGeometry, ExtrudeGeometry, Path, Shape } from 'three'
import { WALL_T } from './layout'
import type { Opening, Rect, WallSpec } from './layout'

export function rectPath(target: Path | Shape, minX: number, maxX: number, minY: number, maxY: number): void {
  target.moveTo(minX, minY)
  target.lineTo(maxX, minY)
  target.lineTo(maxX, maxY)
  target.lineTo(minX, maxY)
  target.closePath()
}

export function roundedRectShape(minX: number, maxX: number, minY: number, maxY: number, r: number): Shape {
  const s = new Shape()
  s.moveTo(minX + r, minY)
  s.lineTo(maxX - r, minY)
  s.quadraticCurveTo(maxX, minY, maxX, minY + r)
  s.lineTo(maxX, maxY - r)
  s.quadraticCurveTo(maxX, maxY, maxX - r, maxY)
  s.lineTo(minX + r, maxY)
  s.quadraticCurveTo(minX, maxY, minX, maxY - r)
  s.lineTo(minX, minY + r)
  s.quadraticCurveTo(minX, minY, minX + r, minY)
  return s
}

/**
 * A horizontal slab (extruded shape) with optional rectangular holes, in house x/z coordinates.
 * The shape is drawn in (x, −z) and rotated flat, so `depth` extrudes upwards from y = 0.
 */
export function slabGeometry(outline: Shape, holes: readonly Rect[], depth: number, curveSegments = 6): ExtrudeGeometry {
  for (const h of holes) {
    const path = new Path()
    rectPath(path, h.minX, h.maxX, -h.maxZ, -h.minZ)
    outline.holes.push(path)
  }
  const geometry = new ExtrudeGeometry(outline, { depth, bevelEnabled: false, curveSegments })
  geometry.rotateX(-Math.PI / 2)
  return geometry
}

export const rectShape = (r: Rect): Shape => {
  const s = new Shape()
  rectPath(s, r.minX, r.maxX, -r.maxZ, -r.minZ)
  return s
}

/** Placement of a wall: its start corner (extended by half the thickness) and its yaw. */
export interface WallFrame {
  position: [number, number, number]
  rotationY: number
  length: number
  /** Opening offsets shifted for the corner extension. */
  openings: Opening[]
}

export function wallFrame(spec: WallSpec, thickness = WALL_T): WallFrame {
  const dx = spec.end[0] - spec.start[0]
  const dz = spec.end[1] - spec.start[1]
  const length = Math.hypot(dx, dz)
  const ux = dx / length
  const uz = dz / length
  const half = thickness / 2
  return {
    position: [spec.start[0] - ux * half, spec.base, spec.start[1] - uz * half],
    rotationY: -Math.atan2(dz, dx),
    length: length + thickness,
    openings: spec.openings.map((o) => ({ ...o, offset: o.offset + half })),
  }
}

/** Wall slab with real openings, extruded through its thickness and centred on the wall line. */
export function wallGeometry(length: number, height: number, openings: readonly Opening[], thickness = WALL_T): ExtrudeGeometry {
  const shape = new Shape()
  rectPath(shape, 0, length, 0, height)
  for (const o of openings) {
    // Holes must sit strictly inside the outline, so doors keep a 2 cm threshold.
    const path = new Path()
    rectPath(path, o.offset, o.offset + o.width, Math.max(o.sill, 0.02), Math.min(o.sill + o.height, height - 0.02))
    shape.holes.push(path)
  }
  const geometry = new ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false })
  geometry.translate(0, 0, -thickness / 2)
  return geometry
}

/** Triangular gable infill in the local XY plane, extruded along z. */
export function gableGeometry(width: number, rise: number, thickness = WALL_T): ExtrudeGeometry {
  const shape = new Shape()
  shape.moveTo(0, 0)
  shape.lineTo(width, 0)
  shape.lineTo(width / 2, rise)
  shape.closePath()
  const geometry = new ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false })
  geometry.translate(0, 0, -thickness / 2)
  return geometry
}

/**
 * Box whose UVs are in metres (like the extruded walls), so tiling textures keep a constant scale.
 * BoxGeometry face order: ±x, ±y, ±z, four vertices each.
 */
export function metricBoxGeometry(w: number, h: number, d: number): BoxGeometry {
  const geometry = new BoxGeometry(w, h, d)
  const uv = geometry.attributes.uv
  const dims: [number, number][] = [
    [d, h],
    [d, h],
    [w, d],
    [w, d],
    [w, h],
    [w, h],
  ]
  for (let face = 0; face < 6; face++) {
    const [su, sv] = dims[face]
    for (let i = face * 4; i < face * 4 + 4; i++) uv.setXY(i, uv.getX(i) * su, uv.getY(i) * sv)
  }
  uv.needsUpdate = true
  return geometry
}
