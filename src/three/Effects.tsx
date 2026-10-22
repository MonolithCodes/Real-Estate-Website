import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'

/** Desktop high tier only: a whisper of bloom on the dusk lights and a soft vignette. */
export function Effects() {
  return (
    <EffectComposer multisampling={4}>
      <Bloom mipmapBlur luminanceThreshold={0.9} luminanceSmoothing={0.2} intensity={0.45} />
      <Vignette offset={0.32} darkness={0.22} />
    </EffectComposer>
  )
}
