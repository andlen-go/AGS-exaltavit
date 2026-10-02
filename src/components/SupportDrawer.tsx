import { useEffect, useMemo, useRef, useState } from 'react'
import { eventConfig, formatPhp, hasMajorPartners, isGCashReady } from '../config/event'
import { useFormEnabled, useFormSubmit } from '../hooks/useFormSubmit'
import { useSupportDrawer } from '../hooks/useSupportDrawer'
import { copyText } from '../lib/clipboard'
import { isValidEmail, isValidMobile, MAX_PHOTO_BYTES, type GiftData, type PhotoAttachment } from '../shared/forms'
import { HoneypotField, SubmitButton } from './MediaPlaceholder'
import { Collapse, Field, Input, Notice, SponsorBadge, Textarea } from './ui'

function readAsAttachment(file: File): Promise<PhotoAttachment> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result ?? '')
      resolve({ filename: file.name, contentType: file.type, base64: result.slice(result.indexOf(',') + 1) })
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

/** Chat-style gift panel rising from the bottom-right Support button (bottom sheet on mobile). */
export function SupportDrawer() {
  const { open, preset, closeDrawer } = useSupportDrawer()
  const gcashReady = isGCashReady()
  const emailReady = useFormEnabled('gift')
  const { submit, sending, honeypotProps } = useFormSubmit('gift')
  const panelRef = useRef<HTMLDivElement>(null)

  const [amount, setAmount] = useState(eventConfig.suggestedAmountsPhp[1] ?? 250)
  const [customAmount, setCustomAmount] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [message, setMessage] = useState('')
  const [recognize, setRecognize] = useState(false)
  const [displayAs, setDisplayAs] = useState<'individual' | 'organization'>('individual')
  const [displayName, setDisplayName] = useState('')
  const [blurb, setBlurb] = useState('')
  const [link, setLink] = useState('')
  const [photo, setPhoto] = useState<{ name: string; url: string; file: File } | null>(null)
  const [photoLink, setPhotoLink] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [appliedPresetId, setAppliedPresetId] = useState(preset?.id)

  if (preset && preset.id !== appliedPresetId) {
    setAppliedPresetId(preset.id)
    if (eventConfig.suggestedAmountsPhp.includes(preset.amount)) {
      setAmount(preset.amount)
      setCustomAmount('')
    } else {
      setCustomAmount(String(preset.amount))
    }
  }

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

  async function buildGift(): Promise<GiftData | null> {
    if (!selectedAmount || selectedAmount < 1) {
      setError('Enter a gift amount of at least ₱1.')
      return null
    }
    if (email.trim() && !isValidEmail(email)) {
      setError('Please enter a valid email address.')
      return null
    }
    if (!isValidMobile(mobile)) {
      setError('Mobile number should look like 09XXXXXXXXX or +639XXXXXXXXX.')
      return null
    }
    let attachment: PhotoAttachment | undefined
    if (recognize && photo) {
      try {
        attachment = await readAsAttachment(photo.file)
      } catch {
        setError('Could not read the selected image. Try choosing it again.')
        return null
      }
    }
    return {
      amountPhp: selectedAmount,
      name: name.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      message: message.trim(),
      recognize,
      displayAs,
      displayName: displayName.trim(),
      blurb: blurb.trim(),
      link: link.trim(),
      photoLink: photo ? '' : photoLink.trim(),
      photo: attachment,
    }
  }

  async function sendGift() {
    setError(null)
    setStatus(null)
    const gift = await buildGift()
    if (!gift) return
    const result = await submit(gift)
    if (!result.ok) {
      setError(result.error)
      return
    }
    const transferNote = gcashReady
      ? 'Please complete your GCash transfer below if you haven’t yet.'
      : 'The organizer will reply with transfer instructions.'
    setStatus(
      result.copySentTo
        ? `Thank you! Your gift note was sent and a copy is on its way to ${result.copySentTo}. ${transferNote}`
        : `Thank you! Your gift note was sent. ${transferNote}`,
    )
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
        className={`absolute inset-x-0 bottom-0 flex max-h-[88dvh] origin-bottom-right flex-col overflow-hidden rounded-t-xl bg-ivory shadow-2xl transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none motion-reduce:transition-none md:inset-x-auto md:right-6 md:bottom-40 md:max-h-[min(44rem,calc(100dvh-17rem))] md:w-[24rem] md:rounded-xl md:border md:border-navy/10 ${
          open ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-full opacity-0 md:translate-y-4 md:scale-95'
        }`}
      >
        {hasMajorPartners() ? (
          <div className="hidden border-b-2 border-gold/60 bg-navy px-5 py-4 text-ivory md:block sm:px-6">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-gold-soft uppercase">Major partners</p>
            <ul className="mt-3 grid grid-cols-2 gap-3">
              {eventConfig.majorPartners.map((partner) => (
                <li key={partner.name} className="flex items-center gap-2.5">
                  <SponsorBadge name={partner.name} logoSrc={partner.logoSrc} className="h-9 w-9" />
                  <span className="font-display text-base leading-tight text-ivory">{partner.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
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
              <Field label="Email (optional)" hint="Add it to receive a thank-you copy of your note">
                <Input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
              </Field>
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
                <span>
                  <span className="font-semibold text-navy">Feature me in the Acknowledgments</span>
                  <span className="block text-xs text-navy/60">Add a name, photo or logo, and a short line about you.</span>
                </span>
              </label>
              <Collapse open={recognize}>
                <div className="space-y-4 rounded-lg border border-gold/30 bg-ivory-deep/50 p-4">
                  <div className="flex gap-2" role="radiogroup" aria-label="Display as">
                    {(['individual', 'organization'] as const).map((option) => (
                      <button
                        key={option}
                        type="button"
                        role="radio"
                        aria-checked={displayAs === option}
                        onClick={() => setDisplayAs(option)}
                        className={`flex-1 rounded-full border px-3 py-1.5 text-xs font-semibold capitalize transition ${
                          displayAs === option
                            ? 'border-navy bg-navy text-ivory'
                            : 'border-navy/20 text-navy/75 hover:border-navy/50'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <Field label={displayAs === 'organization' ? 'Organization name' : 'Display name'}>
                    <Input
                      value={displayName}
                      placeholder={displayAs === 'organization' ? 'e.g. San Mateo Arts Circle' : name || 'e.g. Maria S.'}
                      onChange={(event) => setDisplayName(event.target.value)}
                    />
                  </Field>
                  <Field label="Short description" hint={`${blurb.length}/160`}>
                    <Textarea
                      value={blurb}
                      maxLength={160}
                      rows={2}
                      placeholder="One line about you or your organization"
                      onChange={(event) => setBlurb(event.target.value)}
                    />
                  </Field>
                  <Field label="Website or social link (optional)">
                    <Input
                      type="url"
                      value={link}
                      placeholder="https://"
                      onChange={(event) => setLink(event.target.value)}
                    />
                  </Field>
                  <div>
                    <p className="mb-1.5 text-sm font-medium text-navy">
                      {displayAs === 'organization' ? 'Logo' : 'Photo'} (optional)
                    </p>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer rounded-sm border border-navy/25 px-3 py-2 text-xs font-semibold text-navy hover:border-navy/50">
                        {photo ? 'Change image' : 'Choose image'}
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(event) => {
                            const file = event.target.files?.[0]
                            event.target.value = ''
                            if (file && file.size > MAX_PHOTO_BYTES) {
                              setError('Photo or logo must be 4 MB or smaller.')
                              return
                            }
                            if (photo) URL.revokeObjectURL(photo.url)
                            setError(null)
                            setPhoto(file ? { name: file.name, url: URL.createObjectURL(file), file } : null)
                          }}
                        />
                      </label>
                      {photo ? (
                        <button
                          type="button"
                          className="text-xs text-navy/60 underline-offset-4 hover:underline"
                          onClick={() => {
                            URL.revokeObjectURL(photo.url)
                            setPhoto(null)
                          }}
                        >
                          Remove
                        </button>
                      ) : null}
                    </div>
                    {photo ? (
                      <p className="mt-1.5 text-xs text-navy/60">
                        <strong>{photo.name}</strong> will be attached to your note automatically.
                      </p>
                    ) : (
                      <div className="mt-2">
                        <Input
                          type="url"
                          value={photoLink}
                          placeholder="…or paste an image link"
                          onChange={(event) => setPhotoLink(event.target.value)}
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="mb-1.5 text-[10px] font-semibold tracking-[0.18em] text-navy/50 uppercase">Preview</p>
                    <div className="flex items-start gap-3 rounded-lg border border-navy/10 bg-ivory p-3">
                      {photo || photoLink.trim() ? (
                        <img
                          src={photo?.url ?? photoLink.trim()}
                          alt=""
                          className={`h-12 w-12 shrink-0 object-cover ${displayAs === 'organization' ? 'rounded-md' : 'rounded-full'}`}
                        />
                      ) : (
                        <SponsorBadge name={displayName || name || 'Supporter'} className="h-12 w-12" />
                      )}
                      <div className="min-w-0">
                        <p className="font-display text-lg leading-tight text-navy">
                          {displayName.trim() || name.trim() || 'Your name'}
                        </p>
                        {blurb.trim() ? <p className="mt-0.5 text-xs leading-relaxed text-navy/65">{blurb}</p> : null}
                        {link.trim() ? <p className="mt-0.5 truncate text-xs text-gold">{link}</p> : null}
                      </div>
                    </div>
                  </div>
                </div>
              </Collapse>
              {error ? <Notice tone="warn">{error}</Notice> : null}
              {status ? <Notice tone="success">{status}</Notice> : null}
              <SubmitButton onClick={sendGift} sending={sending} label="Send gift note" />
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
