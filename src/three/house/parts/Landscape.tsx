import { useLayoutEffect, useMemo, useRef } from 'react'
import type { ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color, ConeGeometry, CylinderGeometry, IcosahedronGeometry, Matrix4, PlaneGeometry, Quaternion, Vector3 } from 'three'
import type { BufferGeometry, Group, InstancedMesh, Material } from 'three'
import { EASINGS } from '../assembly'
import { usePartProgress } from '../partContext'
import { useHouseMaterials } from '../materials'
import { seededRandom, tokenColor } from '../../palette'
import { DRIVE, HOUSE_CENTER, KEEP_CLEAR, PATH_X, PLOT, PORCH, inRect } from '../layout'
import { Block } from './Block'

/** One grown item: where it stands, its full size, and when (0..1 of the part) it starts growing. */
interface Sprout {
  x: number
  y: number
  z: number
  scale: readonly [number, number, number]
  rotY: number
  delay: number
}

const GROW_SPAN = 0.4
const growAt = (t: number, delay: number) => EASINGS.easeOutBack(Math.min(1, Math.max(0, (t - delay) / GROW_SPAN)))

/** Live-oak positions around the plot edge, ordered so lower tiers still get an even spread. */
const TREE_SITES: readonly [number, number][] = [
  [-14, -10], [19, -9], [-12, 12], [20, 6], [4, -10.8], [-14.5, -3],
  [12, 12.8], [-6.5, 12.5], [12, -10.5], [-9, -10.5], [20.5, -2], [-3, -11], [-14, 5], [18.5, 12.5],
]

/** Canopy blobs per tree (offset x, y, z, scale x, y, z): wide, low and spreading. */
const CANOPY: readonly (readonly [number, number, number, number, number, number])[] = [
  [0, 3.3, 0, 2.6, 1.4, 2.4],
  [1.5, 3, 0.6, 1.7, 1.1, 1.6],
  [-1.4, 3.1, -0.5, 1.8, 1.1, 1.7],
  [0.3, 3.9, -0.9, 1.6, 1, 1.5],
]

/**
 * Instanced items that scale up from zero (back-ease) with per-item stagger as the part progresses.
 * Re-composes matrices only while the part's progress changes.
 */
function GrowingInstances({ sprouts, geometry, material, colors }: { sprouts: readonly Sprout[]; geometry: BufferGeometry; material: Material; colors?: readonly Color[] }) {
  const ref = useRef<InstancedMesh>(null)
  const part = usePartProgress()
  const last = useRef(-1)
  const tmp = useMemo(() => ({ m: new Matrix4(), q: new Quaternion(), p: new Vector3(), s: new Vector3(), up: new Vector3(0, 1, 0) }), [])

  useLayoutEffect(() => {
    const mesh = ref.current
    if (!mesh || !colors) return
    colors.forEach((c, i) => mesh.setColorAt(i, c))
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [colors])

  useFrame(() => {
    const mesh = ref.current
    const t = part.current.t
    if (!mesh || Math.abs(t - last.current) < 1e-4) return
    last.current = t
    sprouts.forEach((sp, i) => {
      const k = growAt(t, sp.delay)
      tmp.p.set(sp.x, sp.y, sp.z)
      tmp.q.setFromAxisAngle(tmp.up, sp.rotY)
      tmp.s.set(sp.scale[0] * k + 1e-4, sp.scale[1] * k + 1e-4, sp.scale[2] * k + 1e-4)
      mesh.setMatrixAt(i, tmp.m.compose(tmp.p, tmp.q, tmp.s))
    })
    mesh.instanceMatrix.needsUpdate = true
  })

  return <instancedMesh ref={ref} args={[geometry, material, sprouts.length]} frustumCulled={false} />
}

/** Grows a whole subtree (driveway, path, plaque) from its base. */
function Grow({ delay, children, origin = [0, 0, 0] }: { delay: number; children: ReactNode; origin?: readonly [number, number, number] }) {
  const ref = useRef<Group>(null)
  const part = usePartProgress()
  useFrame(() => {
    const k = Math.max(1e-4, growAt(part.current.t, delay))
    ref.current?.scale.setScalar(k)
  })
  return (
    <group position={origin}>
      <group ref={ref}>
        <group position={[-origin[0], -origin[1], -origin[2]]}>{children}</group>
      </group>
    </group>
  )
}

const clear = (x: number, z: number) => !KEEP_CLEAR.some((r) => inRect(r, x, z))
const radialDelay = (x: number, z: number, spread: number) =>
  (Math.hypot(x - HOUSE_CENTER[0], z - HOUSE_CENTER[2]) / 28) * spread

/** Live oaks, shrubs, instanced grass tufts, driveway, stepping stones and the entrance plaque. */
export function Landscape({ trees, grass }: { trees: number; grass: number }) {
  const m = useHouseMaterials()
  const geometries = useMemo(
    () => ({
      trunk: new CylinderGeometry(0.16, 0.3, 2.8, 7).translate(0, 1.4, 0),
      blob: new IcosahedronGeometry(1, 1),
      tuft: new ConeGeometry(0.07, 0.34, 4).translate(0, 0.17, 0),
      stone: new CylinderGeometry(0.5, 0.5, 0.06, 18).translate(0, 0.03, 0),
      plaque: new PlaneGeometry(1.8, 0.675),
    }),
    [],
  )

  const data = useMemo(() => {
    const random = seededRandom(42)
    const foliage = tokenColor('--scene-foliage')
    const foliageDeep = tokenColor('--scene-grass-deep')
    const grassLight = tokenColor('--scene-grass')

    const trunks: Sprout[] = []
    const blobs: Sprout[] = []
    const blobColors: Color[] = []
    TREE_SITES.slice(0, trees).forEach(([x, z], i) => {
      const s = 0.85 + random() * 0.35
      const rotY = random() * Math.PI * 2
      const delay = 0.05 + (i / TREE_SITES.length) * 0.45
      trunks.push({ x, y: 0, z, scale: [s, s, s], rotY, delay })
      CANOPY.forEach(([ox, oy, oz, sx, sy, sz]) => {
        const cos = Math.cos(rotY)
        const sin = Math.sin(rotY)
        blobs.push({ x: x + (ox * cos + oz * sin) * s, y: oy * s, z: z + (-ox * sin + oz * cos) * s, scale: [sx * s, sy * s, sz * s], rotY, delay: delay + 0.06 })
        blobColors.push(foliage.clone().lerp(foliageDeep, random() * 0.6))
      })
    })

    const shrubs: Sprout[] = []
    const shrubColors: Color[] = []
    const addShrub = (x: number, z: number, delay: number) => {
      const s = 0.45 + random() * 0.35
      shrubs.push({ x, y: s * 0.45, z, scale: [s * 1.2, s, s * 1.2], rotY: random() * 6, delay })
      shrubColors.push(foliageDeep.clone().lerp(foliage, random()))
    }
    for (let x = PORCH.minX + 0.4; x < PORCH.maxX; x += 1.3) if (Math.abs(x - PATH_X) > 1.1) addShrub(x, PORCH.maxZ + 0.75, 0.1 + random() * 0.1)
    for (let z = -4.6; z < 4.8; z += 1.4) addShrub(-9.2, z, 0.15 + random() * 0.1)
    for (let x = -7.6; x < 7.8; x += 1.6) addShrub(x, -6.2, 0.2 + random() * 0.1)

    const tufts: Sprout[] = []
    const tuftColors: Color[] = []
    let guard = 0
    while (tufts.length < grass && guard++ < grass * 20) {
      const x = PLOT.minX + 1 + random() * (PLOT.maxX - PLOT.minX - 2)
      const z = PLOT.minZ + 1 + random() * (PLOT.maxZ - PLOT.minZ - 2)
      if (!clear(x, z)) continue
      const s = 0.7 + random() * 0.8
      tufts.push({ x, y: 0, z, scale: [s, s * (0.8 + random() * 0.6), s], rotY: random() * 6, delay: radialDelay(x, z, 0.55) })
      tuftColors.push(grassLight.clone().lerp(foliageDeep, random() * 0.7))
    }

    const stones: Sprout[] = []
    for (let z = PORCH.maxZ + 0.9, i = 0; z < PLOT.maxZ - 0.8; z += 1.15, i++) {
      stones.push({ x: PATH_X + (i % 2 ? 0.12 : -0.12), y: 0, z, scale: [1, 1, 0.62], rotY: 0, delay: 0.02 + i * 0.03 })
    }
    return { trunks, blobs, blobColors, shrubs, shrubColors, tufts, tuftColors, stones }
  }, [trees, grass])

  return (
    <group>
      <Grow delay={0} origin={[(DRIVE.minX + DRIVE.maxX) / 2, 0, DRIVE.minZ]}>
        <Block b={[DRIVE.minX, DRIVE.maxX, 0, 0.04, DRIVE.minZ, DRIVE.maxZ]} material={m.concrete} />
      </Grow>
      <GrowingInstances sprouts={data.stones} geometry={geometries.stone} material={m.stoneTrim} />
      <GrowingInstances sprouts={data.trunks} geometry={geometries.trunk} material={m.bark} />
      <GrowingInstances sprouts={data.blobs} geometry={geometries.blob} material={m.foliage} colors={data.blobColors} />
      <GrowingInstances sprouts={data.shrubs} geometry={geometries.blob} material={m.foliage} colors={data.shrubColors} />
      <GrowingInstances sprouts={data.tufts} geometry={geometries.tuft} material={m.foliage} colors={data.tuftColors} />

      {/* Entrance plinth with the brand plaque */}
      <Grow delay={0.35} origin={[8.9, 0, 14]}>
        <Block b={[7.8, 10, 0, 0.9, 13.75, 14.25]} material={m.stone} />
        <mesh geometry={geometries.plaque} material={m.plaque} position={[8.9, 0.48, 14.26]} />
      </Grow>
    </group>
  )
}

/** Low path lights along the front path and driveway: glow comes on at dusk (TimeOfDay). */
export function PathLights() {
  const m = useHouseMaterials()
  const geometries = useMemo(
    () => ({
      post: new CylinderGeometry(0.05, 0.06, 0.55, 8).translate(0, 0.275, 0),
      cap: new CylinderGeometry(0.075, 0.075, 0.07, 10).translate(0, 0.585, 0),
    }),
    [],
  )
  const sprouts = useMemo(() => {
    const out: Sprout[] = []
    const sites: [number, number][] = []
    for (const z of [8.6, 11.1, 13.6]) sites.push([PATH_X - 0.95, z], [PATH_X + 0.95, z])
    for (const z of [7.6, 10.6, 13.6]) sites.push([DRIVE.minX - 0.35, z])
    sites.forEach(([x, z], i) => out.push({ x, y: 0, z, scale: [1, 1, 1], rotY: 0, delay: i * 0.05 }))
    return out
  }, [])
  return (
    <group>
      <GrowingInstances sprouts={sprouts} geometry={geometries.post} material={m.charcoal} />
      <GrowingInstances sprouts={sprouts} geometry={geometries.cap} material={m.glow} />
    </group>
  )
}
