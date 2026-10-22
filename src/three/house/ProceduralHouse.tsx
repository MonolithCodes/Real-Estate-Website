import type { QualitySettings } from '../../lib/quality'
import { AssemblyPart } from './AssemblyPart'
import { Exterior, Pool } from './parts/Exterior'
import { Foundation } from './parts/Foundation'
import { Interior } from './parts/Interior'
import { Landscape, PathLights } from './parts/Landscape'
import { Cladding, Frames, Glazing } from './parts/Openings'
import { Plot } from './parts/Plot'
import { Chimney, Roof } from './parts/Roof'
import { GroundWalls, UpperWalls } from './parts/Walls'

/** The default house, built from primitives so every part is individually animatable. */
export function ProceduralHouse({ settings }: { settings: QualitySettings }) {
  const b = settings.blueprint
  return (
    <>
      <AssemblyPart id="plot" blueprint={b}>
        <Plot />
      </AssemblyPart>
      <AssemblyPart id="foundation" blueprint={b}>
        <Foundation />
      </AssemblyPart>
      <AssemblyPart id="walls_ground" blueprint={b}>
        <GroundWalls />
      </AssemblyPart>
      <AssemblyPart id="walls_upper" blueprint={b}>
        <UpperWalls />
      </AssemblyPart>
      <AssemblyPart id="roof" blueprint={b}>
        <Roof />
      </AssemblyPart>
      <AssemblyPart id="chimney" blueprint={b}>
        <Chimney />
      </AssemblyPart>
      <AssemblyPart id="frames" blueprint={b}>
        <Frames />
      </AssemblyPart>
      <AssemblyPart id="glazing" blueprint={b}>
        <Glazing />
      </AssemblyPart>
      <AssemblyPart id="cladding" blueprint={b}>
        <Cladding />
      </AssemblyPart>
      <AssemblyPart id="interior" blueprint={b}>
        <Interior />
      </AssemblyPart>
      <AssemblyPart id="deck" blueprint={b}>
        <Exterior />
      </AssemblyPart>
      <AssemblyPart id="pool" blueprint={b}>
        <Pool />
      </AssemblyPart>
      <AssemblyPart id="landscape" blueprint={b}>
        <Landscape trees={settings.trees} grass={settings.grass} />
      </AssemblyPart>
      <AssemblyPart id="lights" blueprint={b}>
        <PathLights />
      </AssemblyPart>
    </>
  )
}
