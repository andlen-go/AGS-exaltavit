import { useState } from 'react'
import { eventConfig } from '../config/event'
import { copyText, formatEmailPackage, makeRecordId, openMailto } from '../lib/mailto'
import { Button, Field, Input, Notice, Section, Select, Textarea } from './ui'

export function Sponsorship() {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [kind, setKind] = useState<'cash' | 'in-kind'>('cash')
  const [category, setCategory] = useState(eventConfig.sponsorOpportunities[0]?.id ?? '')
  const [proposal, setProposal] = useState('')
  const [recognize, setRecognize] = useState(true)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function submit() {
    setError(null)
    setStatus(null)

    if (!name.trim() || !contact.trim() || !proposal.trim()) {
      setError('Name, contact, and a short proposal are required.')
      return
    }

    const categoryLabel =
      eventConfig.sponsorOpportunities.find((item) => item.id === category)?.title ?? category
    const recordId = makeRecordId('SPONSOR')
    const subject = `[Exaltavit Sponsor] ${recordId} — ${categoryLabel}`
    const body = [
      'Exaltavit sponsorship inquiry',
      `Record ID: ${recordId}`,
      `Name / organization: ${name.trim()}`,
      `Contact: ${contact.trim()}`,
      `Support type: ${kind}`,
      `Category: ${categoryLabel}`,
      `Recognition permission: ${recognize ? 'yes' : 'no'}`,
      '',
      'Proposal:',
      proposal.trim(),
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
      id="sponsor"
      eyebrow="Sponsorship"
      title="Partner with Exaltavit"
      lead="Cash or in-kind support helps meals, print, and production. Send an inquiry — the organizer will reply from their inbox."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <ul className="space-y-4">
          {eventConfig.sponsorOpportunities.map((item) => (
            <li key={item.id} className="border-l-2 border-gold/60 pl-4">
              <h3 className="font-display text-2xl text-navy">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-navy/70">{item.summary}</p>
            </li>
          ))}
        </ul>

        <div className="space-y-4 border border-navy/10 bg-ivory p-5">
          <Field label="Name or organization">
            <Input value={name} onChange={(event) => setName(event.target.value)} />
          </Field>
          <Field label="Contact">
            <Input value={contact} onChange={(event) => setContact(event.target.value)} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Support type">
              <Select value={kind} onChange={(event) => setKind(event.target.value as 'cash' | 'in-kind')}>
                <option value="cash">Cash</option>
                <option value="in-kind">In-kind</option>
              </Select>
            </Field>
            <Field label="Category">
              <Select value={category} onChange={(event) => setCategory(event.target.value)}>
                {eventConfig.sponsorOpportunities.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <Field label="Proposal">
            <Textarea
              value={proposal}
              onChange={(event) => setProposal(event.target.value)}
              placeholder="How you’d like to help"
            />
          </Field>
          <label className="flex items-start gap-3 text-sm text-navy/80">
            <input
              type="checkbox"
              checked={recognize}
              onChange={(event) => setRecognize(event.target.checked)}
              className="mt-1"
            />
            <span>You may recognize our support publicly if the partnership proceeds.</span>
          </label>
          {error ? <Notice tone="warn">{error}</Notice> : null}
          {status ? <Notice tone="success">{status}</Notice> : null}
          <Button type="button" variant="primary" onClick={submit}>
            Email sponsorship inquiry
          </Button>
        </div>
      </div>
    </Section>
  )
}
