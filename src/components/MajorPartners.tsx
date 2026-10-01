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

/** Desktop sticky side rail highlighting major partners while scrolling the hero. */
export function MajorPartnersRail() {
  if (!hasMajorPartners()) return null

  return (
    <aside
      className="pointer-events-none fixed top-1/2 right-0 z-30 hidden -translate-y-1/2 xl:block"
      aria-label="Major partners rail"
    >
      <div className="pointer-events-auto mr-3 w-[11.5rem] border border-gold/35 bg-navy/95 px-4 py-5 text-ivory shadow-lg backdrop-blur-sm">
        <p className="text-[10px] font-semibold tracking-[0.2em] text-gold-soft uppercase">Major partners</p>
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
