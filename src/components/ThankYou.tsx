import { eventConfig, hasAcknowledgments } from '../config/event'
import { Section } from './ui'

function SponsorList({
  title,
  entries,
  large = false,
}: {
  title: string
  entries: { name: string; note?: string; sample?: boolean }[]
  large?: boolean
}) {
  if (entries.length === 0) return null

  return (
    <div className="mb-12 last:mb-0">
      <h3 className="font-display text-2xl text-navy sm:text-3xl">{title}</h3>
      <ul
        className={
          large
            ? 'mt-6 grid gap-6 sm:grid-cols-2'
            : 'mt-5 columns-1 gap-8 sm:columns-2'
        }
      >
        {entries.map((entry) => (
          <li
            key={entry.name}
            className={large ? '' : 'mb-3 break-inside-avoid'}
          >
            <p
              className={
                large
                  ? 'font-display text-3xl text-navy sm:text-4xl'
                  : 'font-display text-2xl text-navy'
              }
            >
              {entry.name}
            </p>
            {entry.sample ? (
              <p className="mt-1 text-[11px] tracking-[0.14em] text-gold uppercase">
                Sample — fictitious demo partner
              </p>
            ) : entry.note ? (
              <p className="mt-1 text-sm text-navy/60">{entry.note}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ThankYou() {
  if (!hasAcknowledgments()) {
    return (
      <Section
        id="thanks"
        eyebrow="Partners"
        title="Acknowledgments"
        lead="Concert partners and supporters who opted into public recognition will be listed here."
      >
        <a href="#support" className="inline-block text-sm font-semibold text-gold hover:underline">
          Become a concert partner
        </a>
      </Section>
    )
  }

  const anySample =
    eventConfig.majorPartners.some((p) => p.sample) ||
    eventConfig.organizationSponsors.some((p) => p.sample) ||
    eventConfig.individualSponsors.some((p) => p.sample)

  return (
    <Section
      id="thanks"
      eyebrow="Gratitude"
      title="Acknowledgments"
      lead="With thanks to partners and supporters. Sample names below are demo placeholders until confirmed."
      className="bg-ivory-deep/30"
    >
      {anySample ? (
        <p className="mb-8 max-w-xl rounded-sm border border-gold/35 bg-gold/10 px-4 py-3 text-sm text-navy/80">
          Demo acknowledgments — fictitious partners for layout. Replace via{' '}
          <code className="text-xs">majorPartners</code>,{' '}
          <code className="text-xs">organizationSponsors</code>, and{' '}
          <code className="text-xs">individualSponsors</code> in config.
        </p>
      ) : null}

      <SponsorList title="Major partners" entries={eventConfig.majorPartners} large />
      <SponsorList title="Organization sponsors" entries={eventConfig.organizationSponsors} />
      <SponsorList title="Individual sponsors" entries={eventConfig.individualSponsors} />

      {eventConfig.thankYouList.length > 0 ? (
        <SponsorList title="Supporters" entries={eventConfig.thankYouList} />
      ) : null}

      {eventConfig.budget.updatedAt ? (
        <p className="mt-6 text-xs text-navy/50">List updated {eventConfig.budget.updatedAt}</p>
      ) : null}

      <a href="#support" className="mt-4 inline-block text-sm font-semibold text-gold hover:underline">
        Become a concert partner
      </a>
    </Section>
  )
}
