import { useEffect, useState } from 'react'
import { eventConfig, hasMajorPartners } from '../config/event'
import { useSupportDrawer } from '../hooks/useSupportDrawer'
import { SponsorBadge } from './ui'

const TOP_STRIP_ID = 'major-partners-top'

/** Compact major-partner strip — desktop top banner + mobile under header. Sample partners are fictitious. */
export function MajorPartners() {
  if (!hasMajorPartners()) return null

  const partners = eventConfig.majorPartners
  const anySample = partners.some((partner) => partner.sample)

  return (
    <aside
      id={TOP_STRIP_ID}
      className="border-b border-navy/10 bg-navy text-ivory"
      aria-label="Major partners"
    >
      <div className="mx-auto flex max-w-[1180px] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:px-8">
        <div className="shrink-0">
          <p className="text-[10px] font-semibold tracking-[0.22em] text-gold-soft uppercase">
            Presented with
          </p>
          {anySample ? (
            <p className="mt-0.5 text-[11px] text-ivory/55">Demo partners — replace in config</p>
          ) : null}
        </div>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 lg:flex lg:items-center lg:justify-end lg:gap-8">
          {partners.map((partner) => (
            <li key={partner.name} className="flex min-w-0 items-center gap-3">
              <SponsorBadge name={partner.name} logoSrc={partner.logoSrc} className="h-10 w-10 lg:h-11 lg:w-11" />
              <div className="min-w-0">
                <p className="font-display text-lg leading-tight text-ivory sm:text-xl lg:text-2xl">{partner.name}</p>
                {partner.sample ? (
                  <p className="text-[10px] tracking-[0.14em] text-gold-soft/70 uppercase">Sample</p>
                ) : partner.note ? (
                  <p className="text-xs text-ivory/60">{partner.note}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

/**
 * Partner bar pinned to the bottom of the viewport while scrolling through the page; it is sticky
 * inside <main>, so it parks naturally just above the footer. Hidden while the support panel is open
 * because that panel already shows the partners.
 */
export function PartnersBar() {
  const { open: supportOpen } = useSupportDrawer()
  const [topStripVisible, setTopStripVisible] = useState(true)

  useEffect(() => {
    const topStrip = document.getElementById(TOP_STRIP_ID)
    if (!topStrip) return
    const observer = new IntersectionObserver(([entry]) => setTopStripVisible(entry.isIntersecting))
    observer.observe(topStrip)
    return () => observer.disconnect()
  }, [])

  if (!hasMajorPartners() || supportOpen) return null
  const hidden = topStripVisible

  return (
    <aside
      aria-hidden={hidden}
      inert={hidden}
      className={`sticky bottom-16 z-20 border-t border-gold-soft/40 bg-navy/95 text-ivory shadow-[0_-6px_18px_rgba(16,31,50,0.18)] backdrop-blur-sm transition duration-300 motion-reduce:transition-none md:bottom-0 ${
        hidden ? 'pointer-events-none translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}
      aria-label="Major partners"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2 sm:gap-5 sm:px-6">
        <p className="hidden shrink-0 text-[10px] font-semibold tracking-[0.2em] text-gold-soft uppercase sm:block">
          Presented with
        </p>
        <ul className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden sm:gap-5">
          {eventConfig.majorPartners.map((partner) => (
            <li key={partner.name} className="flex min-w-0 items-center gap-2" title={partner.name}>
              <SponsorBadge name={partner.name} logoSrc={partner.logoSrc} className="h-7 w-7 shrink-0 sm:h-8 sm:w-8" />
              <span className="truncate font-display text-sm leading-tight text-ivory sm:text-base">{partner.name}</span>
            </li>
          ))}
        </ul>
        <a
          href="#thanks"
          className="hidden shrink-0 text-[11px] font-semibold tracking-wide text-gold-soft underline-offset-4 hover:underline lg:inline"
        >
          Acknowledgments
        </a>
      </div>
    </aside>
  )
}

