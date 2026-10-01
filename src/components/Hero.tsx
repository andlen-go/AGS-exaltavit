import { eventConfig, getTimeDisplay } from '../config/event'
import { Button, StarMotif } from './ui'

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/exaltavit-artwork-1.png')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/92 via-navy/78 to-navy/35" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-navy/30" aria-hidden="true" />

      <div className="relative mx-auto flex min-h-[92dvh] max-w-5xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-20 lg:px-8">
        <div className="max-w-xl text-ivory">
          <p className="animate-fade mb-4 flex items-center gap-2 text-xs font-semibold tracking-[0.28em] text-gold-soft uppercase">
            <StarMotif className="h-3 w-3 text-gold-soft" />
            {eventConfig.organizer}
          </p>
          <h1 className="animate-rise font-display text-6xl leading-[0.95] tracking-tight sm:text-7xl md:text-8xl">
            {eventConfig.title}
          </h1>
          <p className="animate-rise-delay-1 mt-5 max-w-md text-base leading-relaxed text-ivory/85 sm:text-lg">
            A free choral concert — {eventConfig.dateLabel} at {eventConfig.venue}, {eventConfig.venueCity}.{' '}
            {getTimeDisplay()}.
          </p>
          <div className="animate-rise-delay-2 mt-8 flex flex-wrap items-center gap-3">
            <span className="border border-gold/50 bg-gold/15 px-3 py-1.5 text-xs font-semibold tracking-[0.18em] text-gold-soft uppercase">
              Free admission
            </span>
          </div>
          <div className="animate-rise-delay-3 mt-8 flex flex-wrap gap-3">
            <Button
              type="button"
              variant="gold"
              onClick={() => document.querySelector('#support')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Support the concert
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="border-ivory/35 text-ivory hover:border-ivory/60 hover:bg-ivory/10"
              onClick={() => document.querySelector('#attend')?.scrollIntoView({ behavior: 'smooth' })}
            >
              I’m attending
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
