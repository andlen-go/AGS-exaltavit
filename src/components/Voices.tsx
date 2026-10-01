import { useMemo, useState } from 'react'
import { eventConfig, getShareUrl, voiceAnchorId, type Voice } from '../config/event'
import { copyText } from '../lib/mailto'
import { MediaPlaceholder } from './MediaPlaceholder'
import { Button, Input, Notice, Section } from './ui'

function PortraitCard({ voice }: { voice: Voice }) {
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
            <p className="mt-1 text-[10px] tracking-[0.16em] text-gold-soft/80 uppercase">Portrait coming soon</p>
          </MediaPlaceholder>
        )}
      </div>
      <h3 className="mt-3 font-display text-2xl text-navy">{voice.name}</h3>
      {voice.roleLabel || voice.role !== 'singer' ? (
        <p className="mt-0.5 text-xs font-semibold tracking-[0.14em] text-gold uppercase">
          {voice.roleLabel ?? voice.role}
        </p>
      ) : null}
      {voice.bio ? <p className="mt-2 text-sm leading-relaxed text-navy/70">{voice.bio}</p> : null}
    </article>
  )
}

export function Voices() {
  const [query, setQuery] = useState('')
  const [shareStatus, setShareStatus] = useState<string | null>(null)

  const leadership = useMemo(
    () => eventConfig.voices.filter((voice) => voice.role === 'conductor' || voice.role === 'accompanist'),
    [],
  )
  const production = useMemo(
    () => eventConfig.voices.filter((voice) => voice.role === 'production'),
    [],
  )
  const singers = useMemo(
    () => eventConfig.voices.filter((voice) => voice.role === 'singer'),
    [],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const pool = [...leadership, ...singers, ...production]
    if (!q) return pool
    return pool.filter(
      (voice) =>
        voice.name.toLowerCase().includes(q) ||
        voice.slug.includes(q) ||
        (voice.roleLabel ?? voice.role).toLowerCase().includes(q),
    )
  }, [query, leadership, singers, production])

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
      className="bg-navy text-ivory [&_h2]:text-ivory [&_h3]:text-ivory [&_p]:text-ivory/75 [&_.ornament-line]:bg-gold/50 [&_input]:border-ivory/25 [&_input]:bg-navy-soft [&_input]:text-ivory [&_input]:placeholder:text-ivory/40 [&_label_span]:text-ivory"
    >
      <div className="mb-10 overflow-hidden">
        {ensembleSrc ? (
          <img
            src={ensembleSrc}
            alt={eventConfig.media.ensemble.alt}
            className="max-h-[420px] w-full object-cover object-center"
          />
        ) : (
          <MediaPlaceholder label={eventConfig.media.ensemble.label} className="aspect-[21/9] w-full max-h-[420px]" />
        )}
      </div>

      {leadership.length > 0 ? (
        <div className="mb-10">
          <h3 className="font-display text-3xl text-ivory">Conductor & accompanists</h3>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {leadership.map((voice) => (
              <PortraitCard key={voice.slug} voice={voice} />
            ))}
          </div>
        </div>
      ) : null}

      {production.length > 0 ? (
        <div className="mb-10">
          <h3 className="font-display text-3xl text-ivory">Behind the performance</h3>
          <p className="mt-2 max-w-xl text-sm text-ivory/65">
            Production partners who make the evening possible.
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {production.map((voice) => (
              <PortraitCard key={voice.slug} voice={voice} />
            ))}
          </div>
        </div>
      ) : null}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-sm flex-1">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-ivory">Find a singer</span>
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name"
              aria-label="Search voices by name"
            />
          </label>
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
          Portraits coming soon — the roster will appear here as singers are confirmed. No placeholder names.
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-ivory/65">No voices match “{query}”.</p>
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
