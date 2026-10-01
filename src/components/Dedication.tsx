import { eventConfig } from '../config/event'
import { MediaPlaceholder } from './MediaPlaceholder'
import { Section } from './ui'

export function Dedication() {
  const src = eventConfig.media.patroness.src

  return (
    <Section
      id="dedication"
      eyebrow="Dedication"
      title={eventConfig.dedication.title}
      lead={eventConfig.dedication.lead}
    >
      <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="overflow-hidden">
          {src ? (
            <img
              src={src}
              alt={eventConfig.media.patroness.alt}
              className="aspect-[4/5] w-full object-cover object-center"
            />
          ) : (
            <MediaPlaceholder
              label={eventConfig.media.patroness.label}
              className="aspect-[4/5] w-full"
            />
          )}
          {eventConfig.media.patroness.credit ? (
            <p className="mt-2 text-[11px] leading-relaxed text-navy/45">
              {eventConfig.media.patroness.credit}
            </p>
          ) : null}
        </div>
        <div>
          <p className="text-base leading-relaxed text-navy/80 sm:text-lg">{eventConfig.dedication.body}</p>
          <p className="mt-6 text-sm leading-relaxed text-navy/60">
            {eventConfig.dateLabel} · {eventConfig.venue}, {eventConfig.venueCity}
          </p>
        </div>
      </div>
    </Section>
  )
}
