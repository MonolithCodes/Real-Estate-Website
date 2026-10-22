let supported: boolean | null = null

/** True when the browser can create a WebGL2 context. Checked once, then the probe context is released. */
export function hasWebGL(): boolean {
  if (supported !== null) return supported
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2')
    supported = gl !== null
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    supported = false
  }
  return supported
}
