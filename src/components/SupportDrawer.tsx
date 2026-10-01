import { useEffect, useMemo, useRef, useState } from 'react'
import { eventConfig, formatPhp, isGCashReady, isOrganizerEmailReady } from '../config/event'
import { useSupportDrawer } from '../hooks/useSupportDrawer'
import { copyText, formatEmailPackage, makeRecordId, openMailto, type MailtoPayload } from '../lib/mailto'
import { MailtoActions } from './MediaPlaceholder'
import { Field, Input, Notice, Textarea } from './ui'

/** Chat-style gift panel rising from the bottom-right Support button (bottom sheet on mobile). */
export function SupportDrawer() {
  const { open, closeDrawer } = useSupportDrawer()
  const gcashReady = isGCashReady()
  const emailReady = isOrganizerEmailReady()
  const panelRef = useRef<HTMLDivElement>(null)

  const [amount, setAmount] = useState(eventConfig.suggestedAmountsPhp[1] ?? 250)
  const [customAmount, setCustomAmount] = useState('')
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [message, setMessage] = useState('')
  const [recognize, setRecognize] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    const lockScroll = window.matchMedia('(max-width: 767px)').matches
    const previousOverflow = document.body.style.overflow
    if (lockScroll) document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') closeDrawer()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, closeDrawer])

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

  function openGiftDraft() {
    setError(null)
    setStatus(null)
    const payload = buildGiftPayload()
    if (!payload) return
    openMailto(payload)
    setStatus('Your email draft should open. Nothing is sent until you press send in your mail app.')
  }

  async function copyGiftMessage() {
    setError(null)
    setStatus(null)
    const payload = buildGiftPayload()
    if (!payload) return
    const ok = await copyText(formatEmailPackage(payload))
    setStatus(ok ? 'Message copied. Paste it into your email app when ready.' : 'Could not copy — try Open email draft.')
  }

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
      inert={!open}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close support form"
        onClick={closeDrawer}
        className={`absolute inset-0 bg-navy/45 transition-opacity duration-300 md:bg-transparent ${open ? 'opacity-100' : 'opacity-0'}`}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-drawer-title"
        tabIndex={-1}
        className={`absolute inset-x-0 bottom-0 flex max-h-[88dvh] origin-bottom-right flex-col overflow-hidden rounded-t-xl bg-ivory shadow-2xl transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none motion-reduce:transition-none md:inset-x-auto md:right-6 md:bottom-24 md:max-h-[min(42rem,calc(100dvh-8rem))] md:w-[24rem] md:rounded-xl md:border md:border-navy/10 ${
          open ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-full opacity-0 md:translate-y-4 md:scale-95'
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-navy/10 px-5 py-4 sm:px-6">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] text-gold uppercase">Patronage</p>
            <h2 id="support-drawer-title" className="font-display text-3xl leading-tight text-navy">
              Support Exaltavit
            </h2>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            className="rounded-sm px-2 py-1 text-sm text-navy/60 hover:bg-navy/5 hover:text-navy"
          >
            Close
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-6 sm:px-6">
          <p className="text-sm leading-relaxed text-navy/75">{eventConfig.patronageLead}</p>

          {emailReady ? (
            <div className="space-y-4">
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
              <Field label="Name (optional)">
                <Input value={name} onChange={(event) => setName(event.target.value)} />
              </Field>
              <Field label="Contact (optional)" hint="Email or mobile">
                <Input value={contact} onChange={(event) => setContact(event.target.value)} />
              </Field>
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
            </div>
          ) : (
            <p className="text-sm text-navy/65">
              Contact the organizer via{' '}
              <a href={eventConfig.facebookUrl} className="font-medium text-gold hover:underline" target="_blank" rel="noreferrer">
                Facebook
              </a>{' '}
              to support the concert.
            </p>
          )}

          <div className="space-y-3 bg-navy px-5 py-5 text-ivory">
            <p className="text-xs font-semibold tracking-[0.2em] text-gold-soft uppercase">GCash</p>
            {gcashReady ? (
              <>
                <p className="font-display text-2xl text-ivory">{eventConfig.gcash.accountName}</p>
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
                  className="mt-2 w-full max-w-[200px] bg-ivory p-3"
                />
              </>
            ) : (
              <p className="text-sm leading-relaxed text-ivory/75">
                Transfer details will appear here when the organizer publishes GCash name, number, and QR. Until then,
                use the gift note to reach the inbox.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
