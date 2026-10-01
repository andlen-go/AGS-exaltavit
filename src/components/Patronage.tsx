import { useMemo, useState } from 'react'
import {
  eventConfig,
  formatPhp,
  isGCashReady,
  isOrganizerEmailReady,
  isProgressReady,
} from '../config/event'
import { copyText, formatEmailPackage, makeRecordId, openMailto, type MailtoPayload } from '../lib/mailto'
import { MailtoActions } from './MediaPlaceholder'
import { Button, Field, Input, Notice, Section, Select, Textarea } from './ui'

type Props = {
  onSheetOpenChange?: (open: boolean) => void
}

export function Patronage({ onSheetOpenChange }: Props) {
  const gcashReady = isGCashReady()
  const progressReady = isProgressReady()
  const emailReady = isOrganizerEmailReady()

  const [giftOpen, setGiftOpen] = useState(false)
  const [partnerOpen, setPartnerOpen] = useState(false)

  const [amount, setAmount] = useState(eventConfig.suggestedAmountsPhp[1] ?? 250)
  const [customAmount, setCustomAmount] = useState('')
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [message, setMessage] = useState('')
  const [recognize, setRecognize] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [partnerName, setPartnerName] = useState('')
  const [partnerContact, setPartnerContact] = useState('')
  const [kind, setKind] = useState<'cash' | 'in-kind'>('cash')
  const [category, setCategory] = useState(eventConfig.sponsorOpportunities[0]?.id ?? '')
  const [proposal, setProposal] = useState('')
  const [partnerRecognize, setPartnerRecognize] = useState(false)
  const [partnerStatus, setPartnerStatus] = useState<string | null>(null)
  const [partnerError, setPartnerError] = useState<string | null>(null)

  const selectedAmount = useMemo(() => {
    if (customAmount.trim()) {
      const parsed = Number(customAmount)
      return Number.isFinite(parsed) ? parsed : 0
    }
    return amount
  }, [amount, customAmount])

  function buildGiftPayload(): MailtoPayload | null {
    if (!selectedAmount || selectedAmount < 1) {
      setError('Enter a gift amount of at least ₱1.')
      return null
    }
    const recordId = makeRecordId('GIFT')
    const subject = `[Exaltavit Gift] ${recordId} — ${formatPhp(selectedAmount)}`
    const body = [
      'Exaltavit patronage gift',
      `Record ID: ${recordId}`,
      `Amount: ${formatPhp(selectedAmount)}`,
      `Name: ${name.trim() || '(not provided)'}`,
      `Contact: ${contact.trim() || '(not provided)'}`,
      `Message: ${message.trim() || '(none)'}`,
      `Public recognition consent: ${recognize ? 'yes' : 'no'}`,
      '',
      gcashReady
        ? 'I have transferred (or will transfer) this amount via GCash as instructed on the site.'
        : 'Please reply with transfer instructions for this gift.',
      `Timezone reference: ${eventConfig.timezone}`,
    ].join('\n')
    return { to: eventConfig.organizerEmail, subject, body }
  }

  function buildPartnerPayload(): MailtoPayload | null {
    if (!partnerName.trim() || !partnerContact.trim() || !proposal.trim()) {
      setPartnerError('Name, contact, and a short proposal are required.')
      return null
    }
    const categoryLabel =
      eventConfig.sponsorOpportunities.find((item) => item.id === category)?.title ?? category
    const recordId = makeRecordId('SPONSOR')
    const subject = `[Exaltavit Partner] ${recordId} — ${categoryLabel}`
    const body = [
      'Exaltavit partnership inquiry',
      `Record ID: ${recordId}`,
      `Name / organization: ${partnerName.trim()}`,
      `Contact: ${partnerContact.trim()}`,
      `Support type: ${kind}`,
      `Category: ${categoryLabel}`,
      `Recognition permission: ${partnerRecognize ? 'yes' : 'no'}`,
      '',
      'Proposal:',
      proposal.trim(),
    ].join('\n')
    return { to: eventConfig.organizerEmail, subject, body }
  }

  async function openGiftDraft() {
    setError(null)
    setStatus(null)
    const payload = buildGiftPayload()
    if (!payload) return
    openMailto(payload)
    setStatus('Your email draft should open. Nothing is sent until you press send in your mail app.')
    onSheetOpenChange?.(false)
  }

  async function copyGiftMessage() {
    setError(null)
    setStatus(null)
    const payload = buildGiftPayload()
    if (!payload) return
    const ok = await copyText(formatEmailPackage(payload))
    setStatus(ok ? 'Message copied. Paste it into your email app when ready.' : 'Could not copy — try Open email draft.')
  }

  async function openPartnerDraft() {
    setPartnerError(null)
    setPartnerStatus(null)
    const payload = buildPartnerPayload()
    if (!payload) return
    openMailto(payload)
    setPartnerStatus('Your email draft should open. Nothing is sent until you press send in your mail app.')
  }

  async function copyPartnerMessage() {
    setPartnerError(null)
    setPartnerStatus(null)
    const payload = buildPartnerPayload()
    if (!payload) return
    const ok = await copyText(formatEmailPackage(payload))
    setPartnerStatus(ok ? 'Message copied. Paste it into your email app when ready.' : 'Could not copy — try Open email draft.')
  }

  return (
    <Section
      id="support"
      eyebrow="Patronage"
      title="Be part of Exaltavit"
      lead={eventConfig.patronageLead}
      className="bg-ivory-deep/25"
    >
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          {progressReady ? (
            <div>
              <p className="text-sm text-navy/65">Raised toward hospitality & production</p>
              <p className="mt-2 font-display text-4xl text-navy">
                {formatPhp(eventConfig.budget.raisedPhp!)}
                <span className="ml-2 text-xl text-navy/45">/ {formatPhp(eventConfig.budget.goalPhp!)}</span>
              </p>
              {eventConfig.budget.updatedAt ? (
                <p className="mt-1 text-xs text-navy/50">Updated {eventConfig.budget.updatedAt}</p>
              ) : null}
            </div>
          ) : null}

          <p className="text-sm leading-relaxed text-navy/70">{eventConfig.surplusCopy}</p>

          {emailReady ? (
            <>
              {!giftOpen ? (
                <Button type="button" variant="gold" onClick={() => setGiftOpen(true)}>
                  Send a gift note
                </Button>
              ) : (
                <div className="space-y-4 border-t border-navy/10 pt-6">
                  <p className="text-sm font-medium text-navy">Suggested amounts</p>
                  <div className="flex flex-wrap gap-2">
                    {eventConfig.suggestedAmountsPhp.map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          setAmount(value)
                          setCustomAmount('')
                        }}
                        className={`border px-4 py-2 text-sm font-semibold transition ${
                          !customAmount && amount === value
                            ? 'border-gold bg-gold/15 text-navy'
                            : 'border-navy/15 text-navy/80 hover:border-navy/35'
                        }`}
                      >
                        {formatPhp(value)}
                      </button>
                    ))}
                  </div>
                  <Field label="Custom amount (PHP)">
                    <Input
                      inputMode="numeric"
                      placeholder="e.g. 750"
                      value={customAmount}
                      onChange={(event) => setCustomAmount(event.target.value.replace(/[^\d]/g, ''))}
                    />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Name (optional)">
                      <Input value={name} onChange={(event) => setName(event.target.value)} />
                    </Field>
                    <Field label="Contact (optional)" hint="Email or mobile">
                      <Input value={contact} onChange={(event) => setContact(event.target.value)} />
                    </Field>
                  </div>
                  <Field label="Message (optional)">
                    <Textarea value={message} onChange={(event) => setMessage(event.target.value)} />
                  </Field>
                  <label className="flex items-start gap-3 text-sm text-navy/80">
                    <input
                      type="checkbox"
                      checked={recognize}
                      onChange={(event) => setRecognize(event.target.checked)}
                      className="mt-1"
                    />
                    <span>You may list my first name publicly among supporters (off by default).</span>
                  </label>
                  {error ? <Notice tone="warn">{error}</Notice> : null}
                  {status ? <Notice tone="success">{status}</Notice> : null}
                  <MailtoActions onOpenDraft={openGiftDraft} onCopyMessage={copyGiftMessage} />
                  <button
                    type="button"
                    className="text-sm text-navy/55 hover:text-navy"
                    onClick={() => setGiftOpen(false)}
                  >
                    Hide form
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-navy/65">
              Contact the organizer via{' '}
              <a href={eventConfig.facebookUrl} className="font-medium text-gold hover:underline" target="_blank" rel="noreferrer">
                Facebook
              </a>{' '}
              to support the concert.
            </p>
          )}
        </div>

        <aside className="space-y-5 bg-navy px-5 py-6 text-ivory">
          <p className="text-xs font-semibold tracking-[0.2em] text-gold-soft uppercase">GCash</p>
          {gcashReady ? (
            <>
              <p className="font-display text-3xl text-ivory">{eventConfig.gcash.accountName}</p>
              <p className="text-lg tracking-wide text-ivory/90">{eventConfig.gcash.accountNumber}</p>
              <button
                type="button"
                className="text-sm font-semibold text-gold-soft underline-offset-4 hover:underline"
                onClick={() => copyText(eventConfig.gcash.accountNumber)}
              >
                Copy number
              </button>
              <img
                src={eventConfig.gcash.qrImagePath}
                alt="GCash QR code for Exaltavit gifts"
                className="mt-2 w-full max-w-[220px] bg-ivory p-3"
              />
            </>
          ) : (
            <p className="text-sm leading-relaxed text-ivory/75">
              Transfer details will appear here when the organizer publishes GCash name, number, and QR. Until then,
              use the gift note to reach the inbox.
            </p>
          )}
        </aside>
      </div>

      <div className="mt-14 border-t border-navy/10 pt-10">
        <h3 className="font-display text-3xl text-navy">Partnerships</h3>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-navy/70">
          Hospitality partners and in-kind supporters help keep admission free. Share a short proposal — the organizer
          will reply from their inbox.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {eventConfig.sponsorOpportunities.map((item) => (
            <li key={item.id}>
              <p className="font-display text-xl text-navy">{item.title}</p>
              <p className="mt-1 text-sm text-navy/65">{item.summary}</p>
            </li>
          ))}
        </ul>

        {emailReady ? (
          !partnerOpen ? (
            <Button type="button" variant="primary" className="mt-6" onClick={() => setPartnerOpen(true)}>
              Inquire about partnership
            </Button>
          ) : (
            <div className="mt-6 max-w-xl space-y-4">
              <Field label="Name or organization">
                <Input value={partnerName} onChange={(event) => setPartnerName(event.target.value)} />
              </Field>
              <Field label="Contact">
                <Input value={partnerContact} onChange={(event) => setPartnerContact(event.target.value)} />
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
                <Textarea value={proposal} onChange={(event) => setProposal(event.target.value)} />
              </Field>
              <label className="flex items-start gap-3 text-sm text-navy/80">
                <input
                  type="checkbox"
                  checked={partnerRecognize}
                  onChange={(event) => setPartnerRecognize(event.target.checked)}
                  className="mt-1"
                />
                <span>You may recognize our support publicly if the partnership proceeds.</span>
              </label>
              {partnerError ? <Notice tone="warn">{partnerError}</Notice> : null}
              {partnerStatus ? <Notice tone="success">{partnerStatus}</Notice> : null}
              <MailtoActions onOpenDraft={openPartnerDraft} onCopyMessage={copyPartnerMessage} />
              <button
                type="button"
                className="text-sm text-navy/55 hover:text-navy"
                onClick={() => setPartnerOpen(false)}
              >
                Hide form
              </button>
            </div>
          )
        ) : null}
      </div>
    </Section>
  )
}
