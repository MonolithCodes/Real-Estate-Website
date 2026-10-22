import { Suspense, lazy, useCallback, useState } from 'react'
import { Reveal } from '../../ui/Reveal'
import { SceneBoundary } from './SceneBoundary'
import { StageCopy } from './StageCopy'
import { POSTER_SRC, storyStages } from './storyContent'

const HouseScene = lazy(() => import('../../../three/HouseScene').then((m) => ({ default: m.HouseScene })))

const hero = storyStages[0]
const finale = storyStages[storyStages.length - 1]
const chapters = storyStages.slice(1, -1)

/**
 * Reduced-motion and no-WebGL layout: no pinning, the finished house (slow turntable when WebGL is
 * available, otherwise the poster) and the same copy as ordinary stacked sections.
 */
export function StaticStory({ webgl }: { webgl: boolean }) {
  const [scene, setScene] = useState<'loading' | 'ready' | 'failed'>(webgl ? 'loading' : 'failed')
  const onReady = useCallback(() => setScene('ready'), [])
  const onFailure = useCallback(() => setScene('failed'), [])

  return (
    <section className="story-static" aria-labelledby="story-title" data-testid="home-hero">
      <div className="container story-static__hero">
        <div className="story-static__copy">
          <StageCopy stage={hero} animateStats={false} />
        </div>
        <div className="story-static__media">
          <img
            className="story__poster"
            data-hidden={scene === 'ready' ? 'true' : 'false'}
            src={POSTER_SRC}
            alt="Illustration of a finished modern Texas farmhouse with a stone-clad facade, gabled metal roof, timber deck and pool"
            width={1600}
            height={1000}
            fetchPriority="high"
            decoding="async"
          />
          {scene === 'failed' ? null : (
            <div className="story-static__canvas" aria-hidden="true">
              <SceneBoundary onError={onFailure}>
                <Suspense fallback={null}>
                  <HouseScene active mobile={false} mode="turntable" onReady={onReady} onFailure={onFailure} />
                </Suspense>
              </SceneBoundary>
            </div>
          )}
        </div>
      </div>

      <div className="container">
        <ol className="story-static__chapters">
          {chapters.map((stage) => (
            <li key={stage.id} className="story-static__chapter">
              <Reveal>
                <StageCopy stage={stage} animateStats={false} />
              </Reveal>
            </li>
          ))}
        </ol>
      </div>

      <div className="story-static__finale theme-dark">
        <div className="container story-static__finale-inner">
          <StageCopy stage={finale} animateStats={false} />
        </div>
      </div>
    </section>
  )
}
