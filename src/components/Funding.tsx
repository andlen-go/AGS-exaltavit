import { useMemo, useState } from 'react'
import {
  eventConfig,
  formatPhp,
  isGCashReady,
  isProgressReady,
} from '../config/event'
import { copyText, formatEmailPackage, makeRecordId, openMailto } from '../lib/mailto'
import { Button, Field, Input, Notice, Section, Textarea } from './ui'

type Props = {
  onSheetOpenChange?: (open: boolean) => void
}

export function Funding({ onSheetOpenChange }: Props) {
  const gcashReady = isGCashReady()
  const progressReady = isProgressReady()
  const [amount, setAmount] = useState(eventConfig.suggestedAmountsPhp[1] ?? 250)
  const [customAmount, setCustomAmount] = useState('')
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [message, setMessage] = useState('')
  const [recognize, setRecognize] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const selectedAmount = useMemo(() => {
    if (customAmount.trim()) {
      const parsed = Number(customAmount)
      return Number.isFinite(parsed) ? parsed : 0
    }
    return amount
  }, [amount, customAmount])

  async function submitDonation() {
    setError(null)
    setStatus(null)

    if (!selectedAmount || selectedAmount < 1) {
      setError('Enter a gift amount of at least ₱1.')
      return
    }

    const recordId = makeRecordId('GIFT')
    const subject = `[Exaltavit Gift] ${recordId} — ${formatPhp(selectedAmount)}`
    const body = [
      'Exaltavit meal support gift',
      `Record ID: ${recordId}`,
      `Amount: ${formatPhp(selectedAmount)}`,
      `Name: ${name.trim() || '(not provided)'}`,
      `Contact: ${contact.trim() || '(not provided)'}`,
      `Message: ${message.trim() || '(none)'}`,
      `Public recognition consent: ${recognize ? 'yes' : 'no'}`,
      '',
      'I have transferred (or will transfer) this amount via GCash as instructed on the site.',
      `Timezone reference: ${eventConfig.timezone}`,
    ].join('\n')

    const payload = {
      to: eventConfig.organizerEmail,
      subject,
      body,
    }

    const copied = await copyText(formatEmailPackage(payload))
    openMailto(payload)
    setStatus(
      copied
        ? `Your email app should open — if not, paste the copied message to ${eventConfig.organizerEmail}.`
        : `Your email app should open — if not, email ${eventConfig.organizerEmail} with subject “${subject}".`,
    )
    onSheetOpenChange?.(false)
  }

  return (
    <Section
      id="support"
      eyebrow="Support"
      title="Help feed the choir"
      lead={eventConfig.mealAppeal}
    >
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          {progressReady ? (
            <div className="rounded-sm border border-navy/10 bg-ivory-deep/40 p-5">
              <p className="text-sm text-navy/65">Raised toward meals & production</p>
              <p className="mt-2 font-display text-4xl text-navy">
                {formatPhp(eventConfig.budget.raisedPhp!)}
                <span className="ml-2 text-xl text-navy/45">/ {formatPhp(eventConfig.budget.goalPhp!)}</span>
              </p>
            </div>
          ) : (
            <Notice tone="warn">{eventConfig.budget.note}</Notice>
          )}

          <div>
            <p className="mb-3 text-sm font-medium text-navy">Suggested amounts</p>
            <div className="flex flex-wrap gap-2">
              {eventConfig.suggestedAmountsPhp.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setAmount(value)
                    setCustomAmount('')
                  }}
                  className={`rounded-sm border px-4 py-2 text-sm font-semibold transition ${
                    !customAmount && amount === value
                      ? 'border-gold bg-gold/15 text-navy'
                      : 'border-navy/15 text-navy/80 hover:border-navy/35'
                  }`}
                >
                  {formatPhp(value)}
                </button>
              ))}
            </div>
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
              <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="How we can thank you" />
            </Field>
            <Field label="Contact (optional)" hint="Email or mobile">
              <Input value={contact} onChange={(event) => setContact(event.target.value)} placeholder="you@email.com" />
            </Field>
          </div>

          <Field label="Message (optional)">
            <Textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="A note for the choir"
            />
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

          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="gold" onClick={submitDonation}>
              I’ve transferred — email my details
            </Button>
            <p className="self-center text-xs text-navy/55">Opens your email app; message also copied when possible.</p>
          </div>
        </div>

        <aside className="space-y-4 rounded-sm border border-navy/10 bg-navy px-5 py-6 text-ivory">
          <p className="text-xs font-semibold tracking-[0.2em] text-gold-soft uppercase">GCash transfer</p>
          {gcashReady ? (
            <>
              <p className="font-display text-3xl text-ivory">{eventConfig.gcash.accountName}</p>
              <p className="text-lg tracking-wide text-ivory/90">{eventConfig.gcash.accountNumber}</p>
              <img
                src={eventConfig.gcash.qrImagePath}
                alt="GCash QR code for Exaltavit donations"
                className="mt-4 w-full max-w-[240px] rounded-sm bg-ivory p-3"
              />
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-ivory/80">
                <li>Send your gift via GCash to the account above.</li>
                <li>Keep your reference screenshot for your records.</li>
                <li>Use the button to email your amount and details to the organizer.</li>
              </ol>
            </>
          ) : (
            <>
              <p className="font-display text-2xl leading-snug">Transfer details coming soon</p>
              <p className="text-sm leading-relaxed text-ivory/75">
                GCash name, number, and QR will appear here once the organizer fills them in config. You can still
                prepare your gift details and email them when instructions are posted.
              </p>
              <p className="text-sm text-gold-soft">{eventConfig.surplusCopy}</p>
            </>
          )}
        </aside>
      </div>
    </Section>
  )
}
