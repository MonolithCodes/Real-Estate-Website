import { tickerItems } from '../../data/content'

/** Looping marquee. The second set is a visual duplicate so the -50% translate loops seamlessly. */
export function Ticker() {
  return (
    <section className="ticker" aria-label="Highlights">
      <div className="marquee">
        <div className="marquee-track">
          {[0, 1].map((set) => (
            <ul key={set} className="ticker__set" aria-hidden={set === 1 ? true : undefined}>
              {tickerItems.map((item) => (
                <li key={item} className="ticker__item">
                  {item}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
