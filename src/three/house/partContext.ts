import { createContext, useContext } from 'react'
import type { RefObject } from 'react'
import type { Object3D } from 'three'
import type { PartId } from './assembly'

/** Live progress of the enclosing assembly part, for children with their own grow-in (trees, grass). */
export interface PartProgress {
  /** Linear 0..1 through the part's range. */
  t: number
  /** Current (damped) solid opacity. */
  solid: number
}

/** A ref (mutated every frame by the part); read `.current` inside useFrame only. */
export const PartProgressContext = createContext<RefObject<PartProgress>>({ current: { t: 1, solid: 1 } })
export const usePartProgress = (): RefObject<PartProgress> => useContext(PartProgressContext)

/** Mounted part groups by id, used as occluders for the spec chips. */
export const partRegistry = new Map<PartId, Object3D>()
