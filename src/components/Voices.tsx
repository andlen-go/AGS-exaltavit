import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  eventConfig,
  getShareUrl,
  voiceAnchorId,
  type Voice,
  type VoiceSection,
} from '../config/event'
import { copyText } from '../lib/clipboard'
import { MediaPlaceholder } from './MediaPlaceholder'
import { Button, Section } from './ui'

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

const FADE_OUT_MS = 160
const RESIZE_MS = 420
const STAGGER_MS = 35
const MAX_STAGGER_MS = 280
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function PortraitCard({ voice }: { voice: Voice }) {
  const sectionLabel =
    voice.role === 'singer' && voice.section
      ? voice.section.charAt(0).toUpperCase() + voice.section.slice(1)
      : null

  return (
    <article id={voiceAnchorId(voice.slug)} className="scroll-mt-36">
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
  /** Filter whose cards are on screen — lags `filter` while the old cards fade out. */
  const [shownFilter, setShownFilter] = useState<FilterKey>('all')
  const [fadingOut, setFadingOut] = useState(false)
  const [hasSwitched, setHasSwitched] = useState(false)
  const [shareStatus, setShareStatus] = useState<string | null>(null)
  const gridWrapRef = useRef<HTMLDivElement>(null)
  const previousHeight = useRef<number | null>(null)
  const swapTimer = useRef<number | undefined>(undefined)

  const filtered = useMemo(
    () => eventConfig.voices.filter((voice) => matchesFilter(voice, shownFilter)),
    [shownFilter],
  )

  function selectFilter(next: FilterKey) {
    if (next === filter) return
    setFilter(next)
    window.clearTimeout(swapTimer.current)
    const swap = () => {
      previousHeight.current = gridWrapRef.current?.offsetHeight ?? null
      setShownFilter(next)
      setHasSwitched(true)
      setFadingOut(false)
    }
    if (prefersReducedMotion()) {
      swap()
      return
    }
    setFadingOut(true)
    swapTimer.current = window.setTimeout(swap, FADE_OUT_MS)
  }

  useEffect(() => () => window.clearTimeout(swapTimer.current), [])

  useLayoutEffect(() => {
    const wrap = gridWrapRef.current
    const from = previousHeight.current
    previousHeight.current = null
    if (!wrap || from === null || prefersReducedMotion()) return
    const to = wrap.offsetHeight
    if (Math.abs(to - from) < 2) return
    const animation = wrap.animate([{ height: `${from}px` }, { height: `${to}px` }], {
      duration: RESIZE_MS,
      easing: EASE,
    })
    wrap.style.overflow = 'hidden'
    const release = () => {
      wrap.style.overflow = ''
    }
    animation.onfinish = release
    animation.oncancel = release
    return () => animation.cancel()
  }, [shownFilter])

  async function shareInvite() {
    const base = getShareUrl() || (typeof window !== 'undefined' ? window.location.href.split('#')[0] : '')
    const text = `Meet the Voices of Exaltavit — a free concert by ${eventConfig.organizer} on ${eventConfig.dateLabel}. ${base}#voices`
    const ok = await copyText(text)
    setShareStatus(ok ? 'copied' : text)
    if (ok) window.setTimeout(() => setShareStatus(null), 3000)
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
                onClick={() => selectFilter(item.key)}
                aria-pressed={active}
                className={`rounded-sm border px-3 py-1.5 text-xs font-semibold tracking-[0.12em] uppercase transition duration-300 ${
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
        <Button type="button" variant="gold" onClick={shareInvite} className="self-start lg:self-auto" aria-live="polite">
          {shareStatus === 'copied' ? 'Invite copied ✓' : 'Copy share invite'}
        </Button>
      </div>

      {shareStatus && shareStatus !== 'copied' ? (
        <p className="mb-6 max-w-2xl text-sm break-words text-ivory/85 select-all">{shareStatus}</p>
      ) : null}

      <div
        ref={gridWrapRef}
        className={`transition-[opacity,translate] duration-150 ease-out ${
          fadingOut ? 'translate-y-1 opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        {eventConfig.voices.length === 0 ? (
          <p className="rounded-sm border border-ivory/15 bg-navy-soft/50 px-5 py-8 text-center text-base text-ivory/70">
            Portraits coming soon — the roster will appear here as singers are confirmed.
          </p>
        ) : filtered.length === 0 ? (
          <p className={`text-sm text-ivory/65 ${hasSwitched ? 'animate-voice-in' : ''}`}>No voices in this section yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {filtered.map((voice, index) => (
              <div
                key={`${shownFilter}-${voice.slug}`}
                className={hasSwitched ? 'animate-voice-in' : undefined}
                style={hasSwitched ? { animationDelay: `${Math.min(index * STAGGER_MS, MAX_STAGGER_MS)}ms` } : undefined}
              >
                <PortraitCard voice={voice} />
              </div>
            ))}
          </div>
        )}
      </div>

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
