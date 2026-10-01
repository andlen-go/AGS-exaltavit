import { useMemo, useState } from 'react'
import {
  eventConfig,
  getShareUrl,
  voiceAnchorId,
  type Voice,
  type VoiceSection,
} from '../config/event'
import { copyText } from '../lib/mailto'
import { MediaPlaceholder } from './MediaPlaceholder'
import { Button, Notice, Section } from './ui'

type FilterKey = 'all' | VoiceSection | 'production' | 'leadership'

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'soprano', label: 'Soprano' },
  { key: 'alto', label: 'Alto' },
  { key: 'tenor', label: 'Tenor' },
  { key: 'bass', label: 'Bass' },
  { key: 'production', label: 'Production' },
  { key: 'leadership', label: 'Leadership' },
]

function PortraitCard({ voice }: { voice: Voice }) {
  const sectionLabel =
    voice.role === 'singer' && voice.section
      ? voice.section.charAt(0).toUpperCase() + voice.section.slice(1)
      : null

  return (
    <article id={voiceAnchorId(voice.slug)} className="scroll-mt-28">
      <div className="aspect-[3/4] overflow-hidden">
        {voice.portraitSrc ? (
          <img
            src={voice.portraitSrc}
            alt={voice.portraitAlt ?? voice.name}
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <MediaPlaceholder
            label={`${voice.name} portrait — awaiting photo`}
            className="h-full w-full"
          >
            <p className="font-display text-xl text-ivory/85">{voice.name}</p>
            <p className="mt-1 text-[10px] tracking-[0.16em] text-gold-soft/80 uppercase">
              Portrait coming soon
            </p>
          </MediaPlaceholder>
        )}
      </div>
      <h3 className="mt-3 font-display text-2xl text-navy">{voice.name}</h3>
      {voice.roleLabel || voice.role !== 'singer' ? (
        <p className="mt-0.5 text-xs font-semibold tracking-[0.14em] text-gold uppercase">
          {voice.roleLabel ?? voice.role}
        </p>
      ) : sectionLabel ? (
        <p className="mt-0.5 text-xs font-semibold tracking-[0.14em] text-gold uppercase">
          {sectionLabel}
        </p>
      ) : null}
      {voice.sample ? (
        <p className="mt-1 text-[10px] tracking-[0.12em] text-ivory/45 uppercase">Sample name</p>
      ) : null}
      {voice.bio ? <p className="mt-2 text-sm leading-relaxed text-navy/70">{voice.bio}</p> : null}
    </article>
  )
}

function matchesFilter(voice: Voice, filter: FilterKey): boolean {
  if (filter === 'all') return true
  if (filter === 'leadership') return voice.role === 'conductor' || voice.role === 'accompanist'
  if (filter === 'production') return voice.role === 'production'
  return voice.role === 'singer' && voice.section === filter
}

export function Voices() {
  const [filter, setFilter] = useState<FilterKey>('all')
  const [shareStatus, setShareStatus] = useState<string | null>(null)

  const filtered = useMemo(
    () => eventConfig.voices.filter((voice) => matchesFilter(voice, filter)),
    [filter],
  )

  async function shareInvite() {
    const base = getShareUrl() || (typeof window !== 'undefined' ? window.location.href.split('#')[0] : '')
    const text = `Meet the Voices of Exaltavit — ${eventConfig.organizer}'s free concert on ${eventConfig.dateLabel}. ${base}#voices`
    const ok = await copyText(text)
    setShareStatus(ok ? 'Invite text copied — paste it anywhere to share.' : text)
  }

  const ensembleSrc = eventConfig.media.ensemble.src

  return (
    <Section
      id="voices"
      eyebrow="The choir"
      title="The Voices of Exaltavit"
      lead={eventConfig.voicesIntro}
      className="bg-navy text-ivory [&_h2]:text-ivory [&_h3]:text-ivory [&_p]:text-ivory/75 [&_.ornament-line]:bg-gold/50"
    >
      <p className="mb-8 max-w-xl rounded-sm border border-gold/30 bg-navy-soft/60 px-4 py-3 text-sm text-gold-soft">
        {eventConfig.voicesSampleNote}
      </p>

      <div className="mb-10 overflow-hidden">
        {ensembleSrc ? (
          <img
            src={ensembleSrc}
            alt={eventConfig.media.ensemble.alt}
            className="max-h-[420px] w-full object-cover object-center"
          />
        ) : (
          <MediaPlaceholder
            label={eventConfig.media.ensemble.label}
            className="aspect-[21/9] w-full max-h-[420px]"
          />
        )}
      </div>

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter voices by section"
        >
          {FILTERS.map((item) => {
            const active = filter === item.key
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                aria-pressed={active}
                className={`rounded-sm border px-3 py-1.5 text-xs font-semibold tracking-[0.12em] uppercase transition ${
                  active
                    ? 'border-gold bg-gold/20 text-gold-soft'
                    : 'border-ivory/20 text-ivory/70 hover:border-ivory/40 hover:text-ivory'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>
        <Button type="button" variant="gold" onClick={shareInvite}>
          Copy share invite
        </Button>
      </div>

      {shareStatus ? (
        <div className="mb-6">
          <Notice tone="success">{shareStatus}</Notice>
        </div>
      ) : null}

      {eventConfig.voices.length === 0 ? (
        <p className="rounded-sm border border-ivory/15 bg-navy-soft/50 px-5 py-8 text-center text-base text-ivory/70">
          Portraits coming soon — the roster will appear here as singers are confirmed.
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-ivory/65">No voices in this section yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filtered.map((voice) => (
            <PortraitCard key={voice.slug} voice={voice} />
          ))}
        </div>
      )}

      <p className="mt-8 text-sm text-ivory/60">
        Follow rehearsal glimpses on{' '}
        <a
          href={eventConfig.facebookUrl}
          className="font-medium text-gold-soft underline-offset-4 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          Facebook
        </a>
        .
      </p>
    </Section>
  )
}
