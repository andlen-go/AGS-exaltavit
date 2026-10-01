import { eventConfig, getTimeDisplay, hasPreviewVideos } from '../config/event'
import { MediaPlaceholder } from './MediaPlaceholder'
import { Button, StarMotif } from './ui'

export function Hero() {
  const heroSrc = eventConfig.media.hero.src

  return (
    <section id="top" className="relative overflow-hidden">
      {heroSrc ? (
        <div
          className="absolute inset-0 scale-105 bg-cover bg-center blur-[1.5px]"
          style={{ backgroundImage: `url('${heroSrc}')` }}
          aria-hidden="true"
        />
      ) : (
        <MediaPlaceholder
          label={eventConfig.media.hero.label}
          className="absolute inset-0 min-h-full rounded-none"
        >
          <p className="font-display text-3xl text-ivory/80 sm:text-4xl">Performance photo</p>
          <p className="mt-2 text-xs tracking-[0.2em] text-gold-soft/80 uppercase">
            {eventConfig.media.hero.label}
          </p>
        </MediaPlaceholder>
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/88 to-navy/55" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/25 to-navy/45" aria-hidden="true" />
      <div className="absolute inset-0 bg-navy/25" aria-hidden="true" />

      <div className="relative mx-auto flex min-h-[92dvh] max-w-[1180px] flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-20 lg:px-8">
        <div className="max-w-xl text-ivory">
          <p className="animate-fade mb-4 flex items-center gap-2 text-xs font-semibold tracking-[0.28em] text-gold-soft uppercase">
            <StarMotif className="h-3 w-3 text-gold-soft" />
            {eventConfig.organizer}
          </p>
          <h1 className="animate-rise font-display text-6xl leading-[0.95] tracking-tight uppercase sm:text-7xl md:text-8xl">
            {eventConfig.title}
          </h1>
          <p className="animate-rise-delay-1 mt-5 text-base leading-relaxed text-ivory/90 sm:text-lg">
            Dedicated to Nuestra Señora de Aranzazu
          </p>
          <p className="animate-rise-delay-1 mt-3 max-w-md text-base leading-relaxed text-ivory/80 sm:text-[17px]">
            A free choral concert inviting the parish and community to listen, gather, and be lifted in song.
          </p>

          <dl className="animate-rise-delay-2 mt-8 space-y-2 text-base text-ivory/90 sm:text-[17px]">
            <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
              <dt className="min-w-[4.5rem] text-xs font-semibold tracking-[0.16em] text-gold-soft uppercase">
                Date
              </dt>
              <dd>{eventConfig.dateLabel}</dd>
            </div>
            <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
              <dt className="min-w-[4.5rem] text-xs font-semibold tracking-[0.16em] text-gold-soft uppercase">
                Venue
              </dt>
              <dd>{eventConfig.venue}</dd>
            </div>
            <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
              <dt className="min-w-[4.5rem] text-xs font-semibold tracking-[0.16em] text-gold-soft uppercase">
                City
              </dt>
              <dd>{eventConfig.venueCity}</dd>
            </div>
            <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
              <dt className="min-w-[4.5rem] text-xs font-semibold tracking-[0.16em] text-gold-soft uppercase">
                Time
              </dt>
              <dd>{getTimeDisplay()}</dd>
            </div>
          </dl>

          <div className="animate-rise-delay-2 mt-6">
            <span className="border border-gold/50 bg-gold/15 px-3 py-1.5 text-xs font-semibold tracking-[0.18em] text-gold-soft uppercase">
              Free admission
            </span>
          </div>

          <div className="animate-rise-delay-3 mt-8 flex flex-wrap gap-3">
            <Button
              type="button"
              variant="gold"
              onClick={() => document.querySelector('#attend')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Join us
            </Button>
            <Button
              type="button"
              variant="onDark"
              onClick={() => document.querySelector('#merchandise')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore the keepsakes
            </Button>
          </div>
          {hasPreviewVideos() ? (
            <a
              href="#preview"
              className="animate-rise-delay-3 mt-5 inline-block text-sm font-medium text-gold-soft underline-offset-4 hover:underline"
            >
              Watch a performance preview
            </a>
          ) : null}
          {eventConfig.media.hero.credit ? (
            <p className="animate-rise-delay-3 mt-8 max-w-md text-[11px] leading-relaxed text-ivory/45">
              {eventConfig.media.hero.credit}. Temporary venue photo — replace with a choir performance original.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  )
}
