import { CanvasTexture, DataTexture, NoColorSpace, RepeatWrapping, RGBAFormat, SRGBColorSpace } from 'three'
import { seededRandom, tokenCss } from '../palette'

/** Small procedural textures (no image downloads). All repeat-wrapped; callers dispose them. */

function canvas(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const el = document.createElement('canvas')
  el.width = width
  el.height = height
  const ctx = el.getContext('2d')
  if (!ctx) throw new Error('2D canvas unavailable')
  return [el, ctx]
}

function colorTexture(el: HTMLCanvasElement): CanvasTexture {
  const texture = new CanvasTexture(el)
  texture.colorSpace = SRGBColorSpace
  texture.wrapS = RepeatWrapping
  texture.wrapT = RepeatWrapping
  texture.anisotropy = 4
  return texture
}

/** Coursed stone: irregular blocks in rows with light mortar joints. */
export function createStoneTexture(): CanvasTexture {
  const [el, ctx] = canvas(512, 512)
  const random = seededRandom(7)
  const stone = tokenCss('--scene-stone')
  const stoneDark = tokenCss('--scene-stone-dark')
  ctx.fillStyle = tokenCss('--scene-render')
  ctx.fillRect(0, 0, 512, 512)
  let y = 0
  while (y < 512) {
    const rowH = 36 + Math.floor(random() * 34)
    let x = -Math.floor(random() * 80)
    while (x < 512) {
      const w = 60 + Math.floor(random() * 90)
      ctx.fillStyle = random() > 0.55 ? stoneDark : stone
      ctx.globalAlpha = 0.75 + random() * 0.25
      ctx.fillRect(x + 3, y + 3, w - 6, rowH - 6)
      x += w
    }
    y += rowH
  }
  ctx.globalAlpha = 1
  return colorTexture(el)
}

/** Standing-seam metal: subtle vertical seams. */
export function createSeamTexture(): CanvasTexture {
  const [el, ctx] = canvas(256, 64)
  ctx.fillStyle = tokenCss('--scene-metal-roof')
  ctx.fillRect(0, 0, 256, 64)
  ctx.fillStyle = tokenCss('--scene-render')
  ctx.globalAlpha = 0.22
  for (let x = 0; x < 256; x += 32) ctx.fillRect(x, 0, 2, 64)
  ctx.globalAlpha = 1
  return colorTexture(el)
}

/** Oak floor boards. */
export function createOakTexture(): CanvasTexture {
  const [el, ctx] = canvas(256, 256)
  const random = seededRandom(11)
  ctx.fillStyle = tokenCss('--scene-oak')
  ctx.fillRect(0, 0, 256, 256)
  for (let y = 0; y < 256; y += 16) {
    let x = -Math.floor(random() * 120)
    while (x < 256) {
      const w = 90 + Math.floor(random() * 110)
      ctx.globalAlpha = 0.06 + random() * 0.1
      ctx.fillStyle = random() > 0.5 ? tokenCss('--scene-timber') : tokenCss('--scene-render')
      ctx.fillRect(x, y, w, 15)
      x += w
    }
    ctx.globalAlpha = 0.25
    ctx.fillStyle = tokenCss('--scene-timber')
    ctx.fillRect(0, y + 15, 256, 1)
  }
  ctx.globalAlpha = 1
  return colorTexture(el)
}

/** Brand plaque for the entrance plinth. Redrawn once web fonts are ready. */
export function createPlaqueTexture(brand: string): CanvasTexture {
  const [el, ctx] = canvas(512, 192)
  const texture = colorTexture(el)
  const draw = () => {
    ctx.fillStyle = tokenCss('--bg-ink')
    ctx.fillRect(0, 0, 512, 192)
    ctx.strokeStyle = tokenCss('--gold')
    ctx.lineWidth = 3
    ctx.strokeRect(14, 14, 484, 164)
    ctx.fillStyle = tokenCss('--gold-bright')
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `300 76px ${tokenCss('--font-display')}`
    ctx.fillText(brand, 256, 88)
    ctx.fillStyle = tokenCss('--gold')
    ctx.font = `600 18px ${tokenCss('--font-sans')}`
    ctx.letterSpacing = '6px'
    ctx.fillText('TEXAS PROPERTY ADVISORY', 256, 146)
    texture.needsUpdate = true
  }
  draw()
  void document.fonts?.ready.then(draw)
  return texture
}

/** Tileable ripple normal map for the pool (integer-frequency sines tile seamlessly). */
export function createWaterNormalTexture(size = 128): DataTexture {
  const data = new Uint8Array(size * size * 4)
  const tau = Math.PI * 2
  const height = (x: number, y: number) => {
    const u = (x / size) * tau
    const v = (y / size) * tau
    return Math.sin(u * 3 + v * 2) * 0.5 + Math.sin(u * 5 - v * 4) * 0.3 + Math.sin(u * 1 + v * 7) * 0.2 + Math.sin(u * 9 + v * 3) * 0.12
  }
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = height(x + 1, y) - height(x - 1, y)
      const dy = height(x, y + 1) - height(x, y - 1)
      const nx = -dx * 2
      const ny = -dy * 2
      const len = Math.hypot(nx, ny, 1)
      const i = (y * size + x) * 4
      data[i] = ((nx / len) * 0.5 + 0.5) * 255
      data[i + 1] = ((ny / len) * 0.5 + 0.5) * 255
      data[i + 2] = ((1 / len) * 0.5 + 0.5) * 255
      data[i + 3] = 255
    }
  }
  const texture = new DataTexture(data, size, size, RGBAFormat)
  texture.colorSpace = NoColorSpace
  texture.wrapS = RepeatWrapping
  texture.wrapT = RepeatWrapping
  texture.needsUpdate = true
  return texture
}
