import { eventConfig } from '../config/event'
import { Section } from './ui'

export function Choir() {
  return (
    <Section
      eyebrow="The choir"
      title="Meet Avant Garde Singers"
      lead={eventConfig.choirIntro}
      className="bg-navy text-ivory [&_h2]:text-ivory [&_p]:text-ivory/75 [&_.ornament-line]:bg-gold/50"
    >
      <div className="overflow-hidden border border-ivory/15">
        <img
          src="/exaltavit-artwork-2.png"
          alt="Exaltavit concert identity artwork for Avant Garde Singers"
          className="max-h-[420px] w-full object-cover object-center"
        />
      </div>
      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ivory/70">
        Follow updates and rehearsal glimpses on{' '}
        <a
          href={eventConfig.facebookUrl}
          className="font-medium text-gold-soft underline-offset-4 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          Facebook
        </a>
        . A dedicated choir photo and longer bio will replace this placeholder before promotion.
      </p>
    </Section>
  )
}
