import { useState } from 'react'
import { eventConfig, formatPhp, getOrderableProducts, isMerchReady } from '../config/event'
import { useCart } from '../hooks/useCart'
import { cartSubtotal } from '../lib/cart'
import { copyText, formatEmailPackage, makeRecordId, openMailto } from '../lib/mailto'
import { Button, Field, Input, Notice, Section, Select } from './ui'

type Props = {
  onSheetOpenChange?: (open: boolean) => void
}

export function Merchandise({ onSheetOpenChange }: Props) {
  const products = getOrderableProducts()
  const merchReady = isMerchReady()
  const cart = useCart()
  const [variantByProduct, setVariantByProduct] = useState<Record<string, string>>(() =>
    Object.fromEntries(products.map((product) => [product.id, product.variants[0]?.id ?? ''])),
  )
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [donationAddon, setDonationAddon] = useState('0')
  const [policyOk, setPolicyOk] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function setSheet(open: boolean) {
    setCheckoutOpen(open)
    onSheetOpenChange?.(open)
  }

  async function submitOrder() {
    setError(null)
    setStatus(null)

    if (cart.lines.length === 0) {
      setError('Add at least one item to your cart.')
      return
    }
    if (!name.trim() || !contact.trim()) {
      setError('Name and one contact method are required.')
      return
    }
    if (!policyOk) {
      setError('Please acknowledge the pre-order policy before sending.')
      return
    }

    const addon = Number(donationAddon) || 0
    if (addon < 0) {
      setError('Donation add-on cannot be negative.')
      return
    }

    const subtotal = cartSubtotal(cart.lines)
    const total = subtotal + addon
    const recordId = makeRecordId('MERCH')
    const lineText = cart.lines
      .map(
        (line) =>
          `- ${line.productName} (${line.variantLabel}) × ${line.quantity} = ${formatPhp(line.unitPricePhp * line.quantity)}`,
      )
      .join('\n')

    const subject = `[Exaltavit Merch] ${recordId} — ${formatPhp(total)}`
    const body = [
      'Exaltavit merchandise pre-order',
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
      `Size chart ready: ${eventConfig.sizeChartReady ? 'yes' : 'no — confirm sizes with organizer if unsure'}`,
      'Policy acknowledged: yes',
      '',
      'This is a pre-order request emailed to the organizer. Payment and pickup will be confirmed by reply.',
    ].join('\n')

    const payload = { to: eventConfig.organizerEmail, subject, body }
    const copied = await copyText(formatEmailPackage(payload))
    openMailto(payload)
    setStatus(
      copied
        ? `Your email app should open — if not, paste the copied message to ${eventConfig.organizerEmail}.`
        : `Your email app should open — if not, email ${eventConfig.organizerEmail} with your order summary.`,
    )
    cart.reset()
    setPolicyOk(false)
    setSheet(false)
  }

  return (
    <Section
      id="merchandise"
      eyebrow="Merchandise"
      title="Wear the concert"
      lead="Pre-order draft catalog pieces. Checkout composes an email to the organizer — no online payment on this site."
      className="bg-ivory-deep/35"
    >
      {!merchReady ? (
        <Notice tone="warn">Merchandise pre-orders are not open yet. Products will appear when enabled in config.</Notice>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-navy/65">
              Cart: <strong className="text-navy">{cart.itemCount}</strong> item{cart.itemCount === 1 ? '' : 's'}
              {cart.itemCount > 0 ? ` · ${formatPhp(cartSubtotal(cart.lines))}` : ''}
            </p>
            <Button type="button" variant="primary" disabled={cart.itemCount === 0} onClick={() => setSheet(true)}>
              Review cart & checkout
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const variantId = variantByProduct[product.id] ?? product.variants[0]?.id ?? ''
              return (
                <article key={product.id} className="flex flex-col border border-navy/10 bg-ivory p-4">
                  <div className="mb-4 aspect-[4/3] overflow-hidden bg-navy/5">
                    {product.imageSrc ? (
                      <img
                        src={product.imageSrc}
                        alt={product.imageAlt ?? product.name}
                        className="h-full w-full object-cover object-top"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-4 text-center">
                        <div>
                          <p className="font-display text-2xl text-navy">{product.name}</p>
                          <p className="mt-1 text-xs tracking-[0.16em] text-gold uppercase">Artwork placeholder</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-2xl text-navy">{product.name}</h3>
                    <p className="text-sm font-semibold text-gold">{formatPhp(product.pricePhp)}</p>
                  </div>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/70">{product.description}</p>
                  <div className="mt-4 space-y-3">
                    <Field label="Variant">
                      <Select
                        value={variantId}
                        onChange={(event) =>
                          setVariantByProduct((current) => ({ ...current, [product.id]: event.target.value }))
                        }
                      >
                        {product.variants.map((variant) => (
                          <option key={variant.id} value={variant.id}>
                            {variant.label}
                          </option>
                        ))}
                      </Select>
                    </Field>
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full"
                      onClick={() => cart.addItem(product, variantId, 1)}
                    >
                      Add to cart
                    </Button>
                  </div>
                </article>
              )
            })}
          </div>

          {!eventConfig.sizeChartReady ? (
            <div className="mt-6">
              <Notice tone="warn">
                Size chart is not published yet. If you are between sizes, note that in your order email or wait for
                the organizer’s size guide.
              </Notice>
            </div>
          ) : null}

          {status ? (
            <div className="mt-6">
              <Notice tone="success">{status}</Notice>
            </div>
          ) : null}
        </>
      )}

      {checkoutOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
          <button className="absolute inset-0 bg-navy/45" aria-label="Close checkout" onClick={() => setSheet(false)} />
          <div className="relative z-10 max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-md bg-ivory p-5 shadow-2xl sm:rounded-md sm:p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <h3 className="font-display text-2xl text-navy">Checkout</h3>
              <button type="button" className="text-sm text-navy/60" onClick={() => setSheet(false)}>
                Close
              </button>
            </div>

            <ul className="space-y-3 border-b border-navy/10 pb-4">
              {cart.lines.map((line) => (
                <li key={line.key} className="flex items-start justify-between gap-3 text-sm">
                  <div>
                    <p className="font-medium text-navy">
                      {line.productName} · {line.variantLabel}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        type="button"
                        className="px-2 text-navy/60"
                        onClick={() => cart.updateQuantity(line.key, line.quantity - 1)}
                      >
                        −
                      </button>
                      <span>{line.quantity}</span>
                      <button
                        type="button"
                        className="px-2 text-navy/60"
                        onClick={() => cart.updateQuantity(line.key, line.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <p className="font-semibold text-navy">{formatPhp(line.unitPricePhp * line.quantity)}</p>
                </li>
              ))}
            </ul>

            <div className="mt-4 space-y-4">
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
              <p className="text-sm text-navy/70">{eventConfig.pickupCopy}</p>
              <label className="flex items-start gap-3 text-sm text-navy/80">
                <input
                  type="checkbox"
                  checked={policyOk}
                  onChange={(event) => setPolicyOk(event.target.checked)}
                  className="mt-1"
                />
                <span>
                  I understand this is a pre-order request sent by email. Payment and pickup are confirmed by the
                  organizer — not processed on this website.
                </span>
              </label>
              <p className="text-sm font-semibold text-navy">
                Total: {formatPhp(cartSubtotal(cart.lines) + (Number(donationAddon) || 0))}
              </p>
              {error ? <Notice tone="warn">{error}</Notice> : null}
              <Button type="button" variant="gold" className="w-full" onClick={submitOrder}>
                Email my order
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </Section>
  )
}
