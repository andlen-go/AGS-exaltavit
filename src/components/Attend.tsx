import { useState } from 'react'
import { eventConfig, getTimeDisplay, isMapReady } from '../config/event'
import { useFormStatus, useFormSubmit } from '../hooks/useFormSubmit'
import { isValidEmail, isValidMobile, type RsvpData } from '../shared/forms'
import { ConfirmSendDialog } from './ConfirmSendDialog'
import { HoneypotField, SubmitButton } from './MediaPlaceholder'
import { Field, Input, LineIcon, Notice, Section, Sheet, Textarea, type IconName } from './ui'

type Props = {
  onSheetOpenChange?: (open: boolean) => void
}

const HIGHLIGHTS: { icon: IconName; title: string; body: string }[] = [
  { icon: 'door', title: 'Free admission', body: 'No ticket needed — the shrine doors are open to all.' },
  { icon: 'walk', title: 'Walk-ins welcome', body: 'A note just helps us plan seating and hospitality.' },
  { icon: 'heart', title: 'Need assistance?', body: 'Tell us about accessibility or arrival needs in your note.' },
]

const MY_PARTY_KEY = 'exaltavit:rsvp-party'

function eventDateParts() {
  const date = new Date(`${eventConfig.dateIso}T12:00:00`)
  return {
    weekday: date.toLocaleDateString('en-PH', { weekday: 'long' }),
    month: date.toLocaleDateString('en-PH', { month: 'short' }).toUpperCase(),
    day: date.getDate(),
    year: date.getFullYear(),
  }
}

export function Attend({ onSheetOpenChange }: Props) {
  const { enabled: emailReady, sendsCopy } = useFormStatus('rsvp')
  const { submit, sending, honeypotProps } = useFormSubmit('rsvp')
  const [pending, setPending] = useState<RsvpData | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [name, setName] = useState('')
  const [partySize, setPartySize] = useState('1')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [assistance, setAssistance] = useState('')
  const [invitedBy, setInvitedBy] = useState(
    () => new URLSearchParams(window.location.search).get('invitedBy')?.trim() ?? '',
  )
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [myParty, setMyParty] = useState(() => {
    try {
      return Number(localStorage.getItem(MY_PARTY_KEY)) || 0
    } catch {
      return 0
    }
  })
  const date = eventDateParts()
  const tally = eventConfig.rsvpTally
  const heroSrc = eventConfig.media.hero.src

  function setOpen(open: boolean) {
    setFormOpen(open)
    onSheetOpenChange?.(open)
  }

  function buildRsvp(): RsvpData | null {
    const size = Number(partySize)
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.')
      return null
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.')
      return null
    }
    if (!isValidMobile(mobile)) {
      setError('Mobile number should look like 09XXXXXXXXX or +639XXXXXXXXX.')
      return null
    }
    if (!Number.isFinite(size) || size < 1 || size > 20) {
      setError('Party size should be between 1 and 20.')
      return null
    }
    return {
      name: name.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      partySize: size,
      invitedBy: invitedBy.trim(),
      assistance: assistance.trim(),
    }
  }

  function reviewRsvp() {
    setError(null)
    setStatus(null)
    const rsvp = buildRsvp()
    if (rsvp) setPending(rsvp)
  }

  async function sendRsvp(rsvp: RsvpData) {
    const result = await submit(rsvp)
    setPending(null)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setMyParty(rsvp.partySize)
    try {
      localStorage.setItem(MY_PARTY_KEY, String(rsvp.partySize))
    } catch {
      // Counter still updates for this visit when storage is blocked.
    }
    setStatus(
      result.copySentTo
        ? `Thank you — we’ve noted your party of ${rsvp.partySize}. A confirmation is on its way to ${result.copySentTo}.`
        : `Thank you — we’ve noted your party of ${rsvp.partySize}.`,
    )
  }

  return (
    <Section
      id="attend"
      eyebrow="Plan your visit"
      title="Let us know you’re coming"
      lead="Admission is free. An optional note helps us welcome you — this is not a reserved-seat booking."
      className="bg-ivory-deep/30"
    >
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
        <div className="relative overflow-hidden rounded-xl bg-navy text-ivory shadow-xl">
          {heroSrc ? (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{ backgroundImage: `url('${heroSrc}')` }}
              aria-hidden="true"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/85 to-navy/50" aria-hidden="true" />
          <div className="relative flex h-full flex-col sm:flex-row">
            <div className="flex shrink-0 flex-row items-center justify-center gap-4 border-b border-dashed border-ivory/25 px-6 py-6 sm:w-40 sm:flex-col sm:gap-1 sm:border-r sm:border-b-0">
              <p className="text-sm font-semibold tracking-[0.3em] text-gold-soft">{date.month}</p>
              <p className="font-display text-7xl leading-none sm:text-8xl">{date.day}</p>
              <p className="text-sm tracking-[0.2em] text-ivory/70">{date.year}</p>
            </div>
            <div className="flex flex-1 flex-col justify-between gap-6 p-6 sm:p-8">
              <div>
                <p className="text-xs font-semibold tracking-[0.22em] text-gold-soft uppercase">{date.weekday}</p>
                <p className="mt-2 font-display text-3xl leading-tight sm:text-4xl">{eventConfig.title}</p>
                <p className="mt-1 text-sm text-ivory/70">{eventConfig.organizer}</p>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <LineIcon name="clock" className="mt-0.5 h-5 w-5 shrink-0 text-gold-soft" />
                  <span>
                    {getTimeDisplay()}
                    <span className="block text-xs text-ivory/55">Times shown in {eventConfig.timezone}</span>
                  </span>
                </li>
                <li className="flex gap-3">
                  <LineIcon name="pin" className="mt-0.5 h-5 w-5 shrink-0 text-gold-soft" />
                  <span>
                    {eventConfig.venue}
                    <span className="block text-ivory/70">{eventConfig.venueCity}</span>
                    {isMapReady() ? (
                      <a
                        href={eventConfig.mapUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-block font-semibold text-gold-soft hover:underline"
                      >
                        Open directions →
                      </a>
                    ) : null}
                  </span>
                </li>
              </ul>
              <span className="self-start rounded-full border border-gold-soft/60 px-3 py-1 text-[11px] font-semibold tracking-[0.2em] text-gold-soft uppercase">
                Free admission
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {tally.guests > 0 || myParty > 0 ? (
            <div className="flex items-center gap-4 rounded-lg border border-gold/40 bg-gold/10 p-4" aria-live="polite">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold text-ivory">
                <LineIcon name="users" />
              </span>
              <span className="min-w-0">
                <span className="flex items-baseline gap-2">
                  <span className="font-display text-4xl leading-none text-navy">
                    {(tally.guests + myParty).toLocaleString('en-PH')}
                  </span>
                  <span className="font-display text-xl text-navy">guests expected</span>
                </span>
                <span className="mt-1 block text-xs text-navy/60">
                  {(tally.confirmations + (myParty ? 1 : 0)).toLocaleString('en-PH')} confirmations
                  {myParty ? ` · including your party of ${myParty}` : ''}
                  {tally.updatedLabel ? ` · ${tally.updatedLabel}` : ''}
                </span>
              </span>
            </div>
          ) : null}
          <ul className="grid gap-3">
            {HIGHLIGHTS.map((item) => (
              <li
                key={item.title}
                className="flex gap-4 rounded-lg border border-navy/10 bg-ivory p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-gold/35 hover:shadow-md"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                  <LineIcon name={item.icon} />
                </span>
                <span>
                  <span className="block font-display text-xl text-navy">{item.title}</span>
                  <span className="block text-sm leading-relaxed text-navy/65">{item.body}</span>
                </span>
              </li>
            ))}
          </ul>

          {emailReady ? (
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-haspopup="dialog"
              className="group flex cursor-pointer flex-col gap-4 rounded-lg bg-gold px-6 py-5 text-left text-ivory shadow-lg ring-gold/40 ring-offset-2 ring-offset-ivory transition duration-200 hover:-translate-y-0.5 hover:bg-gold-soft hover:shadow-xl focus-visible:ring-4 focus-visible:outline-none active:translate-y-0 active:shadow-md sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ivory/20 text-ivory">
                  <LineIcon name="users" />
                </span>
                <span>
                  <span className="block font-display text-2xl leading-tight">Let us know you’re coming</span>
                  <span className="block text-sm text-ivory/85">Takes under a minute · confirmation sent to your email</span>
                </span>
              </span>
              <span className="inline-flex shrink-0 items-center justify-center gap-2 self-stretch rounded-full bg-ivory px-5 py-2.5 text-sm font-semibold tracking-wide text-navy shadow-sm transition group-hover:bg-white sm:self-auto">
                RSVP now
                <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                  →
                </span>
              </span>
            </button>
          ) : (
            <p className="text-sm text-navy/65">
              Reach the organizer on{' '}
              <a href={eventConfig.facebookUrl} className="font-medium text-gold hover:underline" target="_blank" rel="noreferrer">
                Facebook
              </a>
              .
            </p>
          )}
          <p className="text-sm text-navy/60">
            Prefer to write directly?{' '}
            <a href={`mailto:${eventConfig.organizerEmail}`} className="font-medium text-gold hover:underline">
              {eventConfig.organizerEmail}
            </a>
          </p>
        </div>
      </div>

      <Sheet open={formOpen} title="Let us know you’re coming" onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <p className="text-sm text-navy/65">
            {eventConfig.dateLabel} · {getTimeDisplay()} · {eventConfig.venueCity}
          </p>
          <Field label="Name">
            <Input value={name} onChange={(event) => setName(event.target.value)} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-[0.6fr_1.4fr]">
            <Field label="Party size">
              <Input
                inputMode="numeric"
                value={partySize}
                onChange={(event) => setPartySize(event.target.value.replace(/[^\d]/g, ''))}
              />
            </Field>
            <Field label="Email" hint="We’ll send your confirmation here">
              <Input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </Field>
          </div>
          <Field label="Mobile number (optional)" hint="09XXXXXXXXX or +639XXXXXXXXX">
            <Input
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              value={mobile}
              onChange={(event) => setMobile(event.target.value)}
            />
          </Field>
          <HoneypotField {...honeypotProps} />
          <Field label="Who invited you? (optional)" hint="A singer, parishioner, friend, or where you heard about Exaltavit">
            <Input
              value={invitedBy}
              onChange={(event) => setInvitedBy(event.target.value)}
              placeholder="e.g. Mira Santos (soprano), parish bulletin, Facebook"
            />
          </Field>
          <Field label="Assistance needed (optional)" hint="Accessibility, arrival notes, etc.">
            <Textarea value={assistance} onChange={(event) => setAssistance(event.target.value)} />
          </Field>
          {error ? <Notice tone="warn">{error}</Notice> : null}
          {status ? <Notice tone="success">{status}</Notice> : null}
          <SubmitButton onClick={reviewRsvp} sending={sending} label="Send RSVP" />
        </div>
      </Sheet>
      <ConfirmSendDialog
        open={pending !== null}
        title="Send your RSVP?"
        rows={[
          ['Name', pending?.name ?? ''],
          ['Party size', String(pending?.partySize ?? '')],
          ['Email', pending?.email ?? ''],
          ...(pending?.mobile ? ([['Mobile', pending.mobile]] as [string, string][]) : []),
          ...(pending?.invitedBy ? ([['Invited by', pending.invitedBy]] as [string, string][]) : []),
          ...(pending?.assistance ? ([['Assistance', pending.assistance]] as [string, string][]) : []),
        ]}
        note={
          <>
            Your RSVP goes to {eventConfig.organizer}
            {sendsCopy ? <>, and a confirmation will be emailed to <strong>{pending?.email}</strong></> : null}. This helps
            us plan — it does not reserve seats.
          </>
        }
        confirmLabel="Yes, send RSVP"
        sending={sending}
        onConfirm={() => pending && sendRsvp(pending)}
        onCancel={() => setPending(null)}
      />

    </Section>
  )
}
