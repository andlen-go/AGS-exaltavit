import { eventConfig } from '../config/event'
import { Section } from './ui'

export function ThankYou() {
  const list = eventConfig.thankYouList

  return (
    <Section
      eyebrow="Gratitude"
      title="Thank you"
      lead={
        list.length > 0
          ? 'With thanks to early supporters who chose public recognition.'
          : 'Be among the first to support Exaltavit — recognized names will appear here when donors opt in.'
      }
      className="bg-ivory-deep/30"
    >
      {list.length > 0 ? (
        <ul className="columns-1 gap-8 sm:columns-2">
          {list.map((entry) => (
            <li key={entry.name} className="mb-3 break-inside-avoid">
              <p className="font-display text-2xl text-navy">{entry.name}</p>
              {entry.note ? <p className="text-sm text-navy/60">{entry.note}</p> : null}
            </li>
          ))}
        </ul>
      ) : (
        <div className="border border-dashed border-gold/40 bg-ivory px-6 py-10 text-center">
          <p className="font-display text-3xl text-navy">Invite the first supporters</p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-navy/65">
            When gifts arrive with recognition consent, the organizer can list first names in config. Until then, this
            space stays open as an invitation.
          </p>
          <a href="#support" className="mt-6 inline-block text-sm font-semibold text-gold hover:underline">
            Support the concert
          </a>
        </div>
      )}
    </Section>
  )
}
