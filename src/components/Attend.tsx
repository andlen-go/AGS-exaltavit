import { useState } from 'react'
import { eventConfig, getTimeDisplay, isMapReady, isOrganizerEmailReady } from '../config/event'
import { copyText, formatEmailPackage, makeRecordId, openMailto, type MailtoPayload } from '../lib/mailto'
import { MailtoActions } from './MediaPlaceholder'
import { Field, Input, Notice, Section, Textarea } from './ui'

export function Attend() {
  const emailReady = isOrganizerEmailReady()
  const [formOpen, setFormOpen] = useState(false)
  const [name, setName] = useState('')
  const [partySize, setPartySize] = useState('1')
  const [contact, setContact] = useState('')
  const [assistance, setAssistance] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function buildPayload(): MailtoPayload | null {
    const size = Number(partySize)
    if (!name.trim() || !contact.trim()) {
      setError('Name and contact are required.')
      return null
    }
    if (!Number.isFinite(size) || size < 1 || size > 20) {
      setError('Party size should be between 1 and 20.')
      return null
    }
    const recordId = makeRecordId('RSVP')
    const subject = `[Exaltavit RSVP] ${recordId} — party of ${size}`
    const body = [
      'Exaltavit free RSVP (planning only — not reserved seats)',
      `Record ID: ${recordId}`,
      `Name: ${name.trim()}`,
      `Party size: ${size}`,
      `Contact: ${contact.trim()}`,
      `Assistance notes: ${assistance.trim() || '(none)'}`,
      '',
      `Concert: ${eventConfig.dateLabel}, ${getTimeDisplay()}`,
      `Venue: ${eventConfig.venue}, ${eventConfig.venueCity}`,
    ].join('\n')
    return { to: eventConfig.organizerEmail, subject, body }
  }

  async function openDraft() {
    setError(null)
    setStatus(null)
    const payload = buildPayload()
    if (!payload) return
    openMailto(payload)
    setStatus('Your email draft should open. Nothing is sent until you press send in your mail app.')
  }

  async function copyMessage() {
    setError(null)
    setStatus(null)
    const payload = buildPayload()
    if (!payload) return
    const ok = await copyText(formatEmailPackage(payload))
    setStatus(ok ? 'Message copied. Paste it into your email app when ready.' : 'Could not copy — try Open email draft.')
  }

  return (
    <Section
      id="attend"
      eyebrow="Plan your visit"
      title="Let us know you’re coming"
      lead="Admission is free. An optional note helps us welcome you — this is not a reserved-seat booking."
      className="bg-ivory-deep/30"
    >
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">When & where</p>
            <p className="mt-3 font-display text-3xl text-navy">{eventConfig.dateLabel}</p>
            <p className="mt-1 text-base text-navy/75 sm:text-lg">{getTimeDisplay()}</p>
            <p className="mt-4 text-base leading-relaxed text-navy/80">
              {eventConfig.venue}
              <br />
              {eventConfig.venueCity}
            </p>
            <p className="mt-3 text-xs text-navy/55">Times shown in {eventConfig.timezone}.</p>
            {isMapReady() ? (
              <a
                href={eventConfig.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block text-sm font-semibold text-gold hover:underline"
              >
                Open directions
              </a>
            ) : null}
          </div>
          <p className="text-sm leading-relaxed text-navy/65">
            Walk-ins are welcome. Prefer to write ahead? Use the note below — or message{' '}
            <a href={`mailto:${eventConfig.organizerEmail}`} className="font-medium text-gold hover:underline">
              {eventConfig.organizerEmail}
            </a>
            .
          </p>
        </div>

        <div>
          {emailReady ? (
            !formOpen ? (
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-gold px-5 py-2.5 text-sm font-semibold tracking-wide text-ivory transition hover:bg-gold-soft"
                onClick={() => setFormOpen(true)}
              >
                Let us know you’re coming
              </button>
            ) : (
              <div className="space-y-4">
                <Field label="Name">
                  <Input value={name} onChange={(event) => setName(event.target.value)} />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Party size">
                    <Input
                      inputMode="numeric"
                      value={partySize}
                      onChange={(event) => setPartySize(event.target.value.replace(/[^\d]/g, ''))}
                    />
                  </Field>
                  <Field label="Contact">
                    <Input value={contact} onChange={(event) => setContact(event.target.value)} />
                  </Field>
                </div>
                <Field label="Assistance needed (optional)" hint="Accessibility, arrival notes, etc.">
                  <Textarea value={assistance} onChange={(event) => setAssistance(event.target.value)} />
                </Field>
                {error ? <Notice tone="warn">{error}</Notice> : null}
                {status ? <Notice tone="success">{status}</Notice> : null}
                <MailtoActions onOpenDraft={openDraft} onCopyMessage={copyMessage} />
                <button
                  type="button"
                  className="text-sm text-navy/55 hover:text-navy"
                  onClick={() => setFormOpen(false)}
                >
                  Hide form
                </button>
              </div>
            )
          ) : (
            <p className="text-sm text-navy/65">
              Reach the organizer on{' '}
              <a href={eventConfig.facebookUrl} className="font-medium text-gold hover:underline" target="_blank" rel="noreferrer">
                Facebook
              </a>
              .
            </p>
          )}
        </div>
      </div>
    </Section>
  )
}
