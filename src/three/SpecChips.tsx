import { useMemo, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import type { Object3D } from 'three'
import type { PartId, Vec3 } from './house/assembly'
import { partRegistry } from './house/partContext'
import { sceneState } from './sceneState'

interface Chip {
  label: string
  detail: string
  position: Vec3
  /** Progress window in which the chip is shown (after the relevant part has assembled). */
  window: readonly [number, number]
}

const CHIPS: readonly Chip[] = [
  { label: 'Standing-seam roof', detail: 'Low-maintenance metal', position: [-3, 9.7, -1.25], window: [0.465, 0.52] },
  { label: 'Hill Country stone', detail: 'Front facade', position: [-6.3, 2.6, 5.4], window: [0.625, 0.66] },
  { label: 'Open-plan kitchen', detail: 'Island seating for four', position: [-1.1, 2, -1.6], window: [0.725, 0.795] },
  { label: 'Primary suite', detail: 'Upper floor, garden views', position: [-5.3, 4.9, -2.8], window: [0.735, 0.795] },
  { label: 'Resort-style pool', detail: 'Timber deck and loungers', position: [11.6, 0.9, 1], window: [0.865, 0.925] },
]

/** Solid exterior parts that hide a chip when they are between it and the camera. */
const OCCLUDERS: readonly PartId[] = ['walls_ground', 'roof', 'chimney', 'cladding']

/**
 * Spec chips pinned to the model with drei <Html>. Only the chips for the current moment are mounted
 * (the visible set changes a handful of times per scroll), and `occlude` hides them behind geometry.
 */
export function SpecChips() {
  const [visible, setVisible] = useState('')
  const last = useRef('')

  // Refs that read the registry lazily, so they resolve once the parts have mounted.
  const occluders = useMemo<RefObject<Object3D>[]>(
    () =>
      OCCLUDERS.map((id) => ({
        get current() {
          return partRegistry.get(id) as Object3D
        },
      })),
    [],
  )

  useFrame(() => {
    const p = sceneState.p
    const key = CHIPS.map((c, i) => (p >= c.window[0] && p < c.window[1] ? i : '')).join(',')
    if (key !== last.current) {
      last.current = key
      setVisible(key)
    }
  })

  const shown = new Set(visible.split(',').filter(Boolean).map(Number))
  return (
    <>
      {CHIPS.map((chip, i) =>
        shown.has(i) ? (
          <Html key={chip.label} position={[...chip.position]} center occlude={occluders} zIndexRange={[20, 0]}>
            <div className="story-chip">
              <span className="story-chip__dot" />
              <span className="story-chip__label">{chip.label}</span>
              <span className="story-chip__detail">{chip.detail}</span>
            </div>
          </Html>
        ) : null,
      )}
    </>
  )
}
