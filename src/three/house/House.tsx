import { Suspense, useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { smoothstep } from '../../components/home/HeroStory/storyRuntime'
import type { QualitySettings } from '../../lib/quality'
import { sceneState } from '../sceneState'
import { GlbHouse } from './GlbHouse'
import { HOUSE_CENTER } from './layout'
import { MaterialsContext, createHouseMaterials } from './materials'
import { ProceduralHouse } from './ProceduralHouse'

/** The house root: shared materials, a gentle sway while exploded, and procedural or GLB parts. */
export function House({ settings }: { settings: QualitySettings }) {
  const { materials, dispose } = useMemo(() => createHouseMaterials(), [])
  useEffect(() => dispose, [dispose])

  const sway = useRef<Group>(null)
  useFrame(() => {
    if (!sway.current) return
    const calm = 1 - smoothstep(0.02, 0.12, sceneState.p)
    sway.current.rotation.y = Math.sin(sceneState.time * 0.12) * 0.32 * calm
  })

  const procedural = <ProceduralHouse settings={settings} />
  return (
    <MaterialsContext value={materials}>
      <group position={[HOUSE_CENTER[0], 0, HOUSE_CENTER[2]]}>
        <group ref={sway}>
          <group position={[-HOUSE_CENTER[0], 0, -HOUSE_CENTER[2]]}>
            {__HOUSE_GLB__ ? (
              <Suspense fallback={procedural}>
                <GlbHouse settings={settings} />
              </Suspense>
            ) : (
              procedural
            )}
          </group>
        </group>
      </group>
    </MaterialsContext>
  )
}
