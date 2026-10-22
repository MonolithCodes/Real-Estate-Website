import { useCallback, useRef } from 'react'
import { site } from '../../../data/site'
import { ArrowLink } from '../../ui/ArrowLink'
import { Button } from '../../ui/Button'
import { ArrowRightIcon } from '../../ui/icons'
import type { StoryStage, StoryStat } from './storyContent'
import { smoothstep } from './storyRuntime'
import { useStoryFrame } from './useScrollProgress'

interface ParsedStat {
  value: number
  decimals: number
  suffix: string
}

/** "3,200 sq ft" → { value: 3200, suffix: " sq ft" }. Non-numeric values (ranges, "n/a") stay static. */
function parseStat(raw: string): ParsedStat | null {
  const match = /^([\d,]+(?:\.\d+)?)(.*)$/.exec(raw)
  if (!match) return null
  const digits = match[1].replace(/,/g, '')
  const decimals = digits.includes('.') ? digits.split('.')[1].length : 0
  return { value: Number(digits), decimals, suffix: match[2] }
}

const formatStat = (stat: ParsedStat, k: number): string =>
  (stat.value * k).toLocaleString('en-US', { minimumFractionDigits: stat.decimals, maximumFractionDigits: stat.decimals }) +
  stat.suffix

interface StatCountersProps {
  stats: readonly StoryStat[]
  stageWindow: readonly [number, number]
  animate: boolean
}

function StatCounters({ stats, stageWindow, animate }: StatCountersProps) {
  const valueRefs = useRef<(HTMLSpanElement | null)[]>([])
  const parsed = useRef(stats.map((stat) => parseStat(stat.value)))
  const lastText = useRef<string[]>([])

  useStoryFrame(
    useCallback(
      (progress: number) => {
        if (!animate) return
        const [a, b] = stageWindow
        const k = smoothstep(a + (b - a) * 0.12, a + (b - a) * 0.55, progress)
        parsed.current.forEach((stat, i) => {
          const el = valueRefs.current[i]
          if (!stat || !el) return
          const text = formatStat(stat, k)
          if (lastText.current[i] !== text) {
            lastText.current[i] = text
            el.textContent = text
          }
        })
      },
      [stageWindow, animate],
    ),
  )

  return (
    <dl className="story__stats">
      {stats.map((stat, i) => (
        <div key={stat.label} className="story__stat">
          <dt className="t-label">{stat.label}</dt>
          <dd className="story__stat-value">
            {/* Screen readers get the final value; the counting figure is decorative. */}
            <span className="visually-hidden">{stat.value}</span>
            <span
              aria-hidden="true"
              ref={(el) => {
                valueRefs.current[i] = el
              }}
            >
              {stat.value}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  )
}

interface StageCopyProps {
  stage: StoryStage
  /** Count stats up with scroll (pinned story). Off for the static layout, which shows final values. */
  animateStats?: boolean
}

/** The copy for one story stage. Real HTML text: headings, paragraphs and links. */
export function StageCopy({ stage, animateStats = true }: StageCopyProps) {
  if (stage.id === 'hero') {
    return (
      <>
        <p className="eyebrow">
          <span translate="no">{site.brandName}</span> · {stage.eyebrow}
        </p>
        <h1 id="story-title" className="t-hero story__title">
          <span className="story__title-line">{stage.title}</span>{' '}
          <span className="story__title-line text-gold-gradient hero__accent">{stage.accent}</span>
        </h1>
        <p className="t-tagline">{stage.body}</p>
        <div className="hero__ctas">
          <Button to="/opportunities" data-testid="hero-cta-opportunities">
            Explore Opportunities
          </Button>
          <Button to="/private-consultation" variant="outline" data-testid="hero-cta-consultation">
            Private Consultation
          </Button>
        </div>
      </>
    )
  }

  if (stage.id === 'reveal') {
    return (
      <>
        <p className="eyebrow">{stage.eyebrow}</p>
        <h2 className="t-h2-cta story__finale-title">{stage.title}</h2>
        <p className="t-lead">{stage.body}</p>
        <div className="hero__ctas">
          <Button to="/opportunities" icon={<ArrowRightIcon size={16} />} data-testid="story-cta-find">
            Find yours
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <p className="eyebrow">{stage.eyebrow}</p>
      <h2 className="t-h3-lg story__card-title">{stage.title}</h2>
      {stage.body ? <p className="t-body story__card-body">{stage.body}</p> : null}
      {stage.stats ? <StatCounters stats={stage.stats} stageWindow={stage.window} animate={animateStats} /> : null}
      {stage.link ? (
        <ArrowLink to={stage.link.to} size="sm">
          {stage.link.label}
        </ArrowLink>
      ) : null}
    </>
  )
}
