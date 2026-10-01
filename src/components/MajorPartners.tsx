import { useState } from 'react'
import { eventConfig, hasMajorPartners } from '../config/event'

/** Compact major-partner strip — desktop top banner + mobile under header. Sample partners are fictitious. */
export function MajorPartners() {
  if (!hasMajorPartners()) return null

  const partners = eventConfig.majorPartners
  const anySample = partners.some((partner) => partner.sample)

  return (
    <aside
      className="border-b border-navy/10 bg-navy text-ivory"
      aria-label="Major partners"
    >
      <div className="mx-auto flex max-w-[1180px] flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 lg:px-8">
        <div className="shrink-0">
          <p className="text-[10px] font-semibold tracking-[0.22em] text-gold-soft uppercase">
            Presented with
          </p>
          {anySample ? (
            <p className="mt-0.5 text-[11px] text-ivory/55">Demo partners — replace in config</p>
          ) : null}
        </div>
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 sm:justify-end">
          {partners.map((partner) => (
            <li key={partner.name} className="min-w-0">
              <p className="font-display text-xl leading-tight text-ivory sm:text-2xl">{partner.name}</p>
              {partner.sample ? (
                <p className="text-[10px] tracking-[0.14em] text-gold-soft/70 uppercase">Sample</p>
              ) : partner.note ? (
                <p className="text-xs text-ivory/60">{partner.note}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

/** Sticky side rail highlighting major partners. Wide screens show the card; narrower screens a tab that expands it. */
export function MajorPartnersRail() {
  const [expanded, setExpanded] = useState(false)
  if (!hasMajorPartners()) return null

  return (
    <aside
      className="pointer-events-none fixed top-1/2 right-0 z-30 -translate-y-1/2"
      aria-label="Major partners rail"
    >
      <button
        type="button"
        onClick={() => setExpanded(true)}
        aria-expanded={expanded}
        className={`pointer-events-auto border border-r-0 border-navy/25 bg-gold-soft px-2.5 py-4 text-[10px] font-semibold tracking-[0.2em] text-navy uppercase shadow-lg [writing-mode:vertical-rl] rotate-180 hover:bg-ivory xl:hidden ${
          expanded ? 'hidden' : ''
        }`}
      >
        Partners
      </button>
      <div
        className={`pointer-events-auto mr-3 w-[11.5rem] border border-gold-soft/70 bg-navy/95 ring-1 ring-ivory/10 px-4 py-5 text-ivory shadow-lg backdrop-blur-sm xl:block ${
          expanded ? 'block' : 'hidden'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <p className="text-[10px] font-semibold tracking-[0.2em] text-gold-soft uppercase">Major partners</p>
          <button
            type="button"
            onClick={() => setExpanded(false)}
            aria-label="Collapse major partners"
            className="-mt-1 -mr-1 px-1 text-sm leading-none text-ivory/60 hover:text-ivory xl:hidden"
          >
            ×
          </button>
        </div>
        <ul className="mt-3 space-y-3">
          {eventConfig.majorPartners.map((partner) => (
            <li key={partner.name}>
              <p className="font-display text-lg leading-snug text-ivory">{partner.name}</p>
              {partner.sample ? (
                <p className="mt-0.5 text-[10px] tracking-[0.12em] text-ivory/50 uppercase">Sample</p>
              ) : null}
            </li>
          ))}
        </ul>
        <a
          href="#thanks"
          className="mt-4 inline-block text-[11px] font-semibold tracking-wide text-gold-soft underline-offset-4 hover:underline"
        >
          View acknowledgments
        </a>
      </div>
    </aside>
  )
}
