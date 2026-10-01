import { useState } from 'react'
import { eventConfig, getTimeDisplay, isMapReady } from '../config/event'
import { copyText, formatEmailPackage, makeRecordId, openMailto } from '../lib/mailto'
import { Button, Field, Input, Notice, Section, Textarea } from './ui'

export function Attend() {
  const [name, setName] = useState('')
  const [partySize, setPartySize] = useState('1')
  const [contact, setContact] = useState('')
  const [assistance, setAssistance] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function submit() {
    setError(null)
    setStatus(null)

    const size = Number(partySize)
    if (!name.trim() || !contact.trim()) {
      setError('Name and contact are required.')
      return
    }
    if (!Number.isFinite(size) || size < 1 || size > 20) {
      setError('Party size should be between 1 and 20.')
      return
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

    const payload = { to: eventConfig.organizerEmail, subject, body }
    const copied = await copyText(formatEmailPackage(payload))
    openMailto(payload)
    setStatus(
      copied
        ? `Your email app should open — if not, paste the copied message to ${eventConfig.organizerEmail}.`
        : `Your email app should open — if not, email ${eventConfig.organizerEmail}.`,
    )
  }

  return (
    <Section
      id="attend"
      eyebrow="Plan your visit"
      title="Free admission — RSVP optional"
      lead="Let us know you’re coming so we can plan hospitality. This is not a reserved-seat booking."
    >
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <div className="border border-navy/10 bg-ivory-deep/40 p-5">
            <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">When & where</p>
            <p className="mt-3 font-display text-3xl text-navy">{eventConfig.dateLabel}</p>
            <p className="mt-1 text-navy/75">{getTimeDisplay()}</p>
            <p className="mt-4 text-sm leading-relaxed text-navy/80">
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
            ) : (
              <p className="mt-4 text-sm text-navy/55">Map link will appear when the organizer adds it to config.</p>
            )}
          </div>
          <Notice>
            Admission is free. Walk-ins are welcome; RSVPs help us estimate attendance for meals and ushering.
          </Notice>
        </div>

        <div className="space-y-4 border border-navy/10 bg-ivory p-5">
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
          <Button type="button" variant="gold" onClick={submit}>
            Email my RSVP
          </Button>
        </div>
      </div>
    </Section>
  )
}
