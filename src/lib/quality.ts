/** Rendering quality tiers for the home 3D story. */
export type QualityTier = 'low' | 'medium' | 'high'

export interface QualitySettings {
  tier: QualityTier
  /** Contact shadows under the house. */
  shadows: boolean
  /** Subtle bloom + vignette (desktop high only). */
  postprocessing: boolean
  /** Gold blueprint edges while parts assemble. */
  blueprint: boolean
  /** Floating spec chips attached to the model. */
  chips: boolean
  grass: number
  trees: number
  shadowResolution: number
}

const TIERS: Record<QualityTier, Omit<QualitySettings, 'tier'>> = {
  high: { shadows: true, postprocessing: true, blueprint: true, chips: true, grass: 900, trees: 14, shadowResolution: 1024 },
  medium: { shadows: true, postprocessing: false, blueprint: true, chips: true, grass: 480, trees: 10, shadowResolution: 512 },
  low: { shadows: false, postprocessing: false, blueprint: false, chips: false, grass: 160, trees: 6, shadowResolution: 256 },
}

export const lowerTier = (tier: QualityTier): QualityTier => (tier === 'high' ? 'medium' : 'low')

interface NavigatorHints {
  deviceMemory?: number
  connection?: { saveData?: boolean }
}

/**
 * Starting tier from cheap device hints. drei's useDetectGPU is not used because it fetches its
 * benchmark data from a CDN; PerformanceMonitor steps the tier down at runtime instead.
 */
export function detectInitialTier(mobile: boolean): QualityTier {
  const nav = navigator as Navigator & NavigatorHints
  if (nav.connection?.saveData) return 'low'
  const cores = nav.hardwareConcurrency ?? 4
  const memory = nav.deviceMemory ?? 4
  if (mobile) return cores >= 6 && memory >= 4 ? 'medium' : 'low'
  if (cores >= 8 && memory >= 8) return 'high'
  return cores >= 4 ? 'medium' : 'low'
}

/** Mobile always runs without post-processing or chips (design brief §7). */
export function qualitySettings(tier: QualityTier, mobile: boolean): QualitySettings {
  const settings = { tier, ...TIERS[tier] }
  return mobile ? { ...settings, postprocessing: false, chips: false } : settings
}
