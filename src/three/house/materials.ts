import { createContext, useContext } from 'react'
import {
  BackSide,
  Color,
  DoubleSide,
  LineBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
} from 'three'
import type { Material, Texture } from 'three'
import { site } from '../../data/site'
import { tokenColor } from '../palette'
import type { MaterialRole } from '../sceneState'
import { createOakTexture, createPlaqueTexture, createSeamTexture, createStoneTexture, createWaterNormalTexture } from './textures'

/**
 * Shared material templates. Assembly parts clone what they use (so each part can fade on its own);
 * the templates and textures here are disposed when the scene unmounts.
 */
export interface HouseMaterials {
  render: MeshStandardMaterial
  stone: MeshStandardMaterial
  stoneTrim: MeshStandardMaterial
  concrete: MeshStandardMaterial
  charcoal: MeshStandardMaterial
  roof: MeshStandardMaterial
  glass: MeshPhysicalMaterial
  oak: MeshStandardMaterial
  timber: MeshStandardMaterial
  fabric: MeshStandardMaterial
  fabricDark: MeshStandardMaterial
  gold: MeshStandardMaterial
  grass: MeshStandardMaterial
  earth: MeshStandardMaterial
  pit: MeshStandardMaterial
  surveyLines: LineBasicMaterial
  foliage: MeshStandardMaterial
  bark: MeshStandardMaterial
  water: MeshStandardMaterial
  poolTile: MeshStandardMaterial
  glow: MeshStandardMaterial
  plaque: MeshStandardMaterial
  waterNormal: Texture
}

const role = <M extends Material>(material: M, name: MaterialRole): M => {
  material.userData.role = name
  return material
}

const standard = (token: string, roughness = 0.85, metalness = 0) =>
  new MeshStandardMaterial({ color: tokenColor(token), roughness, metalness })

export function createHouseMaterials(): { materials: HouseMaterials; dispose: () => void } {
  const stoneMap = createStoneTexture()
  stoneMap.repeat.set(0.35, 0.35)
  const seamMap = createSeamTexture()
  seamMap.repeat.set(2.5, 1)
  const oakMap = createOakTexture()
  oakMap.repeat.set(0.3, 0.3)
  const plaqueMap = createPlaqueTexture(site.brandName)
  const waterNormal = createWaterNormalTexture()
  waterNormal.repeat.set(1.5, 3)

  const stone = new MeshStandardMaterial({ map: stoneMap, roughness: 0.95 })
  const roof = new MeshStandardMaterial({ map: seamMap, roughness: 0.45, metalness: 0.35 })
  const oak = new MeshStandardMaterial({ map: oakMap, roughness: 0.65 })
  const pit = standard('--scene-earth', 1)
  pit.side = BackSide

  const materials: HouseMaterials = {
    render: standard('--scene-render', 0.92),
    stone,
    stoneTrim: standard('--scene-stone-dark', 0.9),
    concrete: standard('--scene-concrete', 0.95),
    charcoal: standard('--bg-ink', 0.5, 0.3),
    roof,
    glass: role(
      new MeshPhysicalMaterial({
        color: tokenColor('--scene-glass'),
        transparent: true,
        opacity: 0.25,
        roughness: 0.05,
        metalness: 0,
        envMapIntensity: 2.2,
        emissive: tokenColor('--scene-window-glow'),
        emissiveIntensity: 0,
        depthWrite: false,
        side: DoubleSide,
      }),
      'glass',
    ),
    oak,
    timber: standard('--scene-timber', 0.75),
    fabric: standard('--scene-fabric', 1),
    fabricDark: standard('--scene-fabric-dark', 1),
    gold: standard('--gold', 0.3, 1),
    grass: standard('--scene-grass', 1),
    earth: standard('--scene-earth', 1),
    pit,
    surveyLines: new LineBasicMaterial({ color: tokenColor('--gold-deep'), transparent: true, opacity: 0.35 }),
    foliage: new MeshStandardMaterial({ color: new Color(1, 1, 1), roughness: 0.95 }),
    bark: standard('--scene-bark', 1),
    water: new MeshStandardMaterial({
      color: tokenColor('--scene-water'),
      roughness: 0.06,
      metalness: 0.1,
      normalMap: waterNormal,
      transparent: true,
      opacity: 0.82,
      envMapIntensity: 1.6,
    }),
    poolTile: role(
      new MeshStandardMaterial({
        color: tokenColor('--scene-water-deep'),
        roughness: 0.4,
        emissive: tokenColor('--scene-water'),
        emissiveIntensity: 0.25,
        side: BackSide,
      }),
      'poolGlow',
    ),
    glow: role(
      new MeshStandardMaterial({
        color: tokenColor('--scene-fabric'),
        emissive: tokenColor('--scene-window-glow'),
        emissiveIntensity: 0.15,
        roughness: 0.6,
      }),
      'glow',
    ),
    plaque: new MeshStandardMaterial({ map: plaqueMap, roughness: 0.5 }),
    waterNormal,
  }

  const textures = [stoneMap, seamMap, oakMap, plaqueMap, waterNormal]
  return {
    materials,
    dispose: () => {
      Object.values(materials).forEach((m: Material | Texture) => m.dispose())
      textures.forEach((t) => t.dispose())
    },
  }
}

export const MaterialsContext = createContext<HouseMaterials | null>(null)

export function useHouseMaterials(): HouseMaterials {
  const materials = useContext(MaterialsContext)
  if (!materials) throw new Error('useHouseMaterials must be used inside <MaterialsContext>')
  return materials
}
