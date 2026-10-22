import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import type { Object3D } from 'three'
import type { QualitySettings } from '../../lib/quality'
import type { PartId } from './assembly'
import { AssemblyPart } from './AssemblyPart'
import { assemblyConfig } from './assemblyConfig'

const HOUSE_GLB_URL = '/models/house.glb'

/** Node name → part. `interior_*` nodes all join the interior part (see README.md). */
const partFor = (name: string): PartId | undefined =>
  name.startsWith('interior') ? 'interior' : assemblyConfig.find((c) => c.id === name)?.id

/**
 * Designer model swap-in: each top-most node named after a part is wired to the same assembly timeline.
 * Meshopt-compressed GLBs decode with the bundled decoder (no CDN). Draco is not used for that reason.
 */
export function GlbHouse({ settings }: { settings: QualitySettings }) {
  const { scene } = useGLTF(HOUSE_GLB_URL, false, true)

  const groups = useMemo(() => {
    const root = scene.clone(true)
    const byPart = new Map<PartId, Object3D[]>()
    const visit = (node: Object3D) => {
      const id = partFor(node.name)
      if (id) {
        byPart.set(id, [...(byPart.get(id) ?? []), node])
        return
      }
      node.children.forEach(visit)
    }
    root.children.forEach(visit)
    return [...byPart.entries()]
  }, [scene])

  return (
    <>
      {groups.map(([id, nodes]) => (
        <AssemblyPart key={id} id={id} blueprint={settings.blueprint}>
          {nodes.map((node) => (
            <primitive key={node.uuid} object={node} />
          ))}
        </AssemblyPart>
      ))}
    </>
  )
}
