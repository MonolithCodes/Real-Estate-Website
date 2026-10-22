// Writes public/env/studio-warm.hdr: a small warm sky/studio environment map (Radiance RGBE, equirect).
// Run: node scripts/generate-env-hdr.mjs  — no network, no dependencies.
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

const W = 256
const H = 128
const OUT = 'public/env/studio-warm.hdr'

const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t)
const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

// Linear radiance values, warm ivory palette (zenith, horizon, ground).
const zenith = [0.82, 0.86, 0.95]
const horizon = [1.35, 1.22, 1.05]
const ground = [0.42, 0.37, 0.3]
const sunDir = [Math.cos(0.6) * Math.cos(0.75), Math.sin(0.6), Math.cos(0.6) * Math.sin(0.75)]

function radiance(u, v) {
  const phi = u * Math.PI * 2
  const theta = v * Math.PI // 0 = up
  const dir = [Math.sin(theta) * Math.cos(phi), Math.cos(theta), Math.sin(theta) * Math.sin(phi)]
  const elev = dir[1]
  let c = elev >= 0 ? mix(horizon, zenith, smooth(0, 0.7, elev)) : mix(horizon, ground, smooth(0, 0.25, -elev))
  // Soft sun disc and glow.
  const d = dir[0] * sunDir[0] + dir[1] * sunDir[1] + dir[2] * sunDir[2]
  const sun = Math.pow(Math.max(0, d), 900) * 40 + Math.pow(Math.max(0, d), 12) * 0.6
  c = c.map((x, i) => x + sun * [1, 0.86, 0.66][i])
  // Two broad "softboxes" for gentle studio highlights on glass and metal.
  for (const [cu, cv, k] of [[0.15, 0.32, 2.2], [0.62, 0.3, 1.4]]) {
    const du = Math.min(Math.abs(u - cu), 1 - Math.abs(u - cu))
    const box = smooth(0.07, 0.04, du) * smooth(0.1, 0.06, Math.abs(v - cv))
    c = c.map((x) => x + box * k)
  }
  return c
}

function rgbe([r, g, b]) {
  const max = Math.max(r, g, b)
  if (max < 1e-32) return [0, 0, 0, 0]
  const e = Math.ceil(Math.log2(max) + 1e-9)
  const scale = 256 / 2 ** e
  return [Math.min(255, r * scale), Math.min(255, g * scale), Math.min(255, b * scale), e + 128].map(Math.floor)
}

const header = Buffer.from(`#?RADIANCE\nFORMAT=32-bit_rle_rgbe\n\n-Y ${H} +X ${W}\n`, 'ascii')
const pixels = Buffer.alloc(W * H * 4)
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    pixels.set(rgbe(radiance((x + 0.5) / W, (y + 0.5) / H)), (y * W + x) * 4)
  }
}
mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, Buffer.concat([header, pixels]))
console.log(`wrote ${OUT} (${((header.length + pixels.length) / 1024).toFixed(0)} KB)`)
