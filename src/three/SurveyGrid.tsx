import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { PlaneGeometry, ShaderMaterial, Vector2 } from 'three'
import type { Mesh } from 'three'
import { smoothstep } from '../components/home/HeroStory/storyRuntime'
import { HOUSE_CENTER } from './house/layout'
import { tokenColor } from './palette'
import { sceneState } from './sceneState'

const vertexShader = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform vec2 uCenter;
  uniform float uRadius;
  varying vec3 vWorld;

  float gridLine(vec2 p, float step, float width) {
    vec2 q = p / step;
    vec2 g = abs(fract(q - 0.5) - 0.5) / fwidth(q);
    return 1.0 - min(min(g.x, g.y) / width, 1.0);
  }

  void main() {
    vec2 p = vWorld.xz;
    float minor = gridLine(p, 2.0, 1.0) * 0.22;
    float major = gridLine(p, 10.0, 1.2) * 0.6;
    float fade = 1.0 - smoothstep(uRadius * 0.3, uRadius, length(p - uCenter));
    float alpha = max(minor, major) * fade * uOpacity;
    if (alpha < 0.003) discard;
    gl_FragColor = vec4(uColor, alpha);
    #include <colorspace_fragment>
  }
`

/** Faint gold survey grid on the ground plane: the blueprint backdrop. Fades as the house completes. */
export function SurveyGrid() {
  const { geometry, material } = useMemo(() => {
    const g = new PlaneGeometry(400, 400)
    g.rotateX(-Math.PI / 2)
    const m = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uColor: { value: tokenColor('--gold-deep') },
        uOpacity: { value: 0.45 },
        uCenter: { value: new Vector2(HOUSE_CENTER[0], HOUSE_CENTER[2]) },
        uRadius: { value: 75 },
      },
    })
    return { geometry: g, material: m }
  }, [])

  const mesh = useRef<Mesh<PlaneGeometry, ShaderMaterial>>(null)
  useFrame(() => {
    const uniforms = mesh.current?.material.uniforms
    if (!uniforms) return
    const p = sceneState.p
    uniforms.uOpacity.value = 0.45 - 0.2 * smoothstep(0.05, 0.3, p) - 0.15 * smoothstep(0.85, 0.95, p)
  })

  return <mesh ref={mesh} geometry={geometry} material={material} position={[0, -0.64, 0]} renderOrder={-1} />
}
