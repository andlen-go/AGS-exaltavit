import { useEffect, useRef, useState } from 'react'
import { eventConfig, formatPhp, isOrganizerEmailReady } from '../config/event'
import { useCartStore } from '../hooks/useCart'
import { cartSubtotal } from '../lib/cart'
import { copyText, formatEmailPackage, makeRecordId, openMailto, type MailtoPayload } from '../lib/mailto'
import { MailtoActions } from './MediaPlaceholder'
import { Field, Input, Notice } from './ui'

function productImage(productId: string) {
  return eventConfig.products.find((product) => product.id === productId)?.imageSrc
}

/** Slide-out cart: review items, adjust quantities, and send the pre-order request by email. */
export function CartPanel() {
  const cart = useCartStore()
  const { open, closeCart } = cart
  const emailReady = isOrganizerEmailReady()
  const panelRef = useRef<HTMLDivElement>(null)
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [donationAddon, setDonationAddon] = useState('0')
  const [policyOk, setPolicyOk] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const subtotal = cartSubtotal(cart.lines)
  const addon = Number(donationAddon) || 0
  const total = subtotal + addon

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') closeCart()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, closeCart])

  function buildOrderPayload(): MailtoPayload | null {
    if (cart.lines.length === 0) {
      setError('Add at least one item to your cart.')
      return null
    }
    if (!name.trim() || !contact.trim()) {
      setError('Name and one contact method are required.')
      return null
    }
    if (!policyOk) {
      setError('Please acknowledge the pre-order policy before sending.')
      return null
    }
    const recordId = makeRecordId('MERCH')
    const lineText = cart.lines
      .map(
        (line) =>
          `- ${line.productName} (${line.variantLabel}) × ${line.quantity} = ${formatPhp(line.unitPricePhp * line.quantity)}`,
      )
      .join('\n')
    const subject = `[Exaltavit Merch] ${recordId} — ${formatPhp(total)}`
    const body = [
      'Exaltavit keepsake pre-order',
      `Record ID: ${recordId}`,
      `Name: ${name.trim()}`,
      `Contact: ${contact.trim()}`,
      '',
      'Items:',
      lineText,
      '',
      `Merchandise subtotal: ${formatPhp(subtotal)}`,
      `Optional donation add-on: ${formatPhp(addon)}`,
      `Order total: ${formatPhp(total)}`,
      '',
      `Pickup note: ${eventConfig.pickupCopy}`,
      `Order deadline: ${eventConfig.orderDeadlineCopy}`,
      `Size chart ready: ${eventConfig.sizeChartReady ? 'yes' : 'no — confirm sizes with organizer if unsure'}`,
      'Policy acknowledged: yes',
      '',
      'This is a pre-order request. Payment and pickup will be confirmed by reply.',
    ].join('\n')
    return { to: eventConfig.organizerEmail, subject, body }
  }

  function openOrderDraft() {
    setError(null)
    setStatus(null)
    const payload = buildOrderPayload()
    if (!payload) return
    openMailto(payload)
    setStatus('Your email draft should open. Nothing is sent until you press send in your mail app.')
    cart.reset()
    setPolicyOk(false)
  }

  async function copyOrderMessage() {
    setError(null)
    setStatus(null)
    const payload = buildOrderPayload()
    if (!payload) return
    const ok = await copyText(formatEmailPackage(payload))
    setStatus(ok ? 'Message copied. Paste it into your email app when ready.' : 'Could not copy — try Open email draft.')
  }

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open} inert={!open}>
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close cart"
        onClick={closeCart}
        className={`absolute inset-0 bg-navy/45 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        tabIndex={-1}
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-ivory shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none motion-reduce:transition-none ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-4 bg-navy px-5 py-4 text-ivory sm:px-6">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] text-gold-soft uppercase">Keepsakes</p>
            <h2 id="cart-title" className="font-display text-3xl leading-tight">
              Your cart
            </h2>
          </div>
          <button type="button" onClick={closeCart} className="rounded-sm px-2 py-1 text-sm text-ivory/70 hover:text-ivory">
            Close
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5 sm:px-6">
          {cart.lines.length === 0 ? (
            <div className="py-10 text-center">
              <p className="font-display text-2xl text-navy">Your cart is empty</p>
              <p className="mt-2 text-sm text-navy/60">Add a shirt, tote, or pin from the keepsakes.</p>
              <a
                href="#merchandise"
                onClick={closeCart}
                className="mt-5 inline-block rounded-sm bg-gold px-5 py-2.5 text-sm font-semibold text-ivory hover:bg-gold-soft"
              >
                Browse keepsakes
              </a>
              {status ? (
                <div className="mt-6 text-left">
                  <Notice tone="success">{status}</Notice>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <ul className="divide-y divide-navy/10">
                {cart.lines.map((line) => {
                  const image = productImage(line.productId)
                  return (
                    <li key={line.key} className="flex gap-3 py-3 first:pt-0">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded bg-navy/5">
                        {image ? <img src={image} alt="" className="h-full w-full object-cover" /> : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-navy">{line.productName}</p>
                            <p className="text-xs text-navy/55">{line.variantLabel}</p>
                          </div>
                          <p className="font-semibold text-navy">{formatPhp(line.unitPricePhp * line.quantity)}</p>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="inline-flex items-center rounded-full border border-navy/15">
                            <button
                              type="button"
                              aria-label={`Decrease ${line.productName}`}
                              className="h-8 w-8 text-navy/70 hover:text-navy"
                              onClick={() => cart.updateQuantity(line.key, line.quantity - 1)}
                            >
                              −
                            </button>
                            <span className="w-6 text-center text-sm font-semibold text-navy">{line.quantity}</span>
                            <button
                              type="button"
                              aria-label={`Increase ${line.productName}`}
                              className="h-8 w-8 text-navy/70 hover:text-navy"
                              onClick={() => cart.updateQuantity(line.key, line.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            className="text-xs text-navy/50 hover:text-navy"
                            onClick={() => cart.removeItem(line.key)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>

              {emailReady ? (
                <div className="space-y-4 border-t border-navy/10 pt-5">
                  <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">Your details</p>
                  <Field label="Name">
                    <Input value={name} onChange={(event) => setName(event.target.value)} required />
                  </Field>
                  <Field label="Email or mobile">
                    <Input value={contact} onChange={(event) => setContact(event.target.value)} required />
                  </Field>
                  <Field label="Optional donation add-on (PHP)" hint="Defaults to 0">
                    <Input
                      inputMode="numeric"
                      value={donationAddon}
                      onChange={(event) => setDonationAddon(event.target.value.replace(/[^\d]/g, ''))}
                    />
                  </Field>
                  <p className="text-xs leading-relaxed text-navy/60">{eventConfig.pickupCopy}</p>
                  <label className="flex items-start gap-3 text-sm text-navy/80">
                    <input
                      type="checkbox"
                      checked={policyOk}
                      onChange={(event) => setPolicyOk(event.target.checked)}
                      className="mt-1"
                    />
                    <span>
                      I understand this is a pre-order request. Payment and pickup are confirmed by the organizer — not
                      processed on this website.
                    </span>
                  </label>
                </div>
              ) : null}
            </>
          )}
        </div>

        {cart.lines.length > 0 && emailReady ? (
          <div className="space-y-3 border-t border-navy/10 bg-ivory-deep/50 px-5 py-4 sm:px-6">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-navy/65">
                Total · {cart.itemCount} item{cart.itemCount === 1 ? '' : 's'}
                {addon > 0 ? ` + ${formatPhp(addon)} gift` : ''}
              </span>
              <span className="font-display text-3xl text-navy">{formatPhp(total)}</span>
            </div>
            {error ? <Notice tone="warn">{error}</Notice> : null}
            {status ? <Notice tone="success">{status}</Notice> : null}
            <MailtoActions
              onOpenDraft={openOrderDraft}
              onCopyMessage={copyOrderMessage}
              openLabel="Send order request"
              copyLabel="Copy message"
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}
