import { eventConfig } from '../config/event'
import { Section } from './ui'

export function ThankYou() {
  const list = eventConfig.thankYouList

  if (list.length === 0) {
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

  return (
    <Section
      id="thanks"
      eyebrow="Gratitude"
      title="Thank you"
      lead="With thanks to supporters who chose public recognition."
      className="bg-ivory-deep/30"
    >
      <ul className="columns-1 gap-8 sm:columns-2">
        {list.map((entry) => (
          <li key={entry.name} className="mb-3 break-inside-avoid">
            <p className="font-display text-2xl text-navy">{entry.name}</p>
            {entry.note ? <p className="text-sm text-navy/60">{entry.note}</p> : null}
          </li>
        ))}
      </ul>
      {eventConfig.budget.updatedAt ? (
        <p className="mt-6 text-xs text-navy/50">List updated {eventConfig.budget.updatedAt}</p>
      ) : null}
    </Section>
  )
}
