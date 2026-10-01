import { useMemo, useState } from 'react'
import {
  eventConfig,
  formatPhp,
  getAccessoryProducts,
  getFeaturedProducts,
  getOrderableProducts,
  isMerchReady,
  isOrganizerEmailReady,
  resolveVariantId,
  type Product,
} from '../config/event'
import { useCart } from '../hooks/useCart'
import { cartSubtotal } from '../lib/cart'
import { copyText, formatEmailPackage, makeRecordId, openMailto, type MailtoPayload } from '../lib/mailto'
import { MailtoActions, MediaPlaceholder } from './MediaPlaceholder'
import { Button, Field, Input, Notice, Section, Select } from './ui'

type Props = {
  onSheetOpenChange?: (open: boolean) => void
}

function productImagePosition(productId: string) {
  if (productId === 'enamel') return 'object-[70%_80%]'
  if (productId === 'button') return 'object-[30%_70%]'
  if (productId === 'keychain') return 'object-[85%_55%]'
  if (productId === 'tote') return 'object-[20%_30%]'
  return 'object-top'
}

function ProductCard({
  product,
  compact = false,
  onAdd,
}: {
  product: Product
  compact?: boolean
  onAdd: (product: Product, variantId: string) => void
}) {
  const [colorId, setColorId] = useState(product.colors?.[0]?.id ?? '')
  const [sizeId, setSizeId] = useState(product.sizes?.[0]?.id ?? '')
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? '')

  const activeVariantId = useMemo(() => {
    if (product.colors?.length || product.sizes?.length) {
      return resolveVariantId(product, colorId || undefined, sizeId || undefined)
    }
    return variantId
  }, [product, colorId, sizeId, variantId])

  return (
    <article className={`flex flex-col ${compact ? '' : ''}`}>
      <div className={`mb-4 overflow-hidden bg-navy/5 ${compact ? 'aspect-square' : 'aspect-[4/3]'}`}>
        {product.imageSrc ? (
          <img
            src={product.imageSrc}
            alt={product.imageAlt ?? product.name}
            className={`h-full w-full object-cover ${productImagePosition(product.id)}`}
          />
        ) : (
          <MediaPlaceholder label={`${product.name} product photo`} className="h-full w-full">
            <p className="font-display text-2xl text-ivory">{product.name}</p>
            <p className="mt-1 text-[10px] tracking-[0.16em] text-gold-soft uppercase">Artwork placeholder</p>
          </MediaPlaceholder>
        )}
      </div>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className={`font-display text-navy ${compact ? 'text-xl' : 'text-2xl'}`}>{product.name}</h3>
        <p className={`font-semibold text-gold ${compact ? 'text-sm' : 'text-base'}`}>
          {formatPhp(product.pricePhp)}
        </p>
      </div>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/70">{product.description}</p>
      <div className="mt-4 space-y-3">
        {product.colors?.length ? (
          <Field label="Color">
            <Select value={colorId} onChange={(event) => setColorId(event.target.value)}>
              {product.colors.map((color) => (
                <option key={color.id} value={color.id}>
                  {color.label}
                </option>
              ))}
            </Select>
          </Field>
        ) : null}
        {product.sizes?.length ? (
          <Field label="Size">
            <Select value={sizeId} onChange={(event) => setSizeId(event.target.value)}>
              {product.sizes.map((size) => (
                <option key={size.id} value={size.id}>
                  {size.label}
                </option>
              ))}
            </Select>
          </Field>
        ) : null}
        {!product.colors?.length && !product.sizes?.length ? (
          <Field label="Option">
            <Select value={variantId} onChange={(event) => setVariantId(event.target.value)}>
              {product.variants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.label}
                </option>
              ))}
            </Select>
          </Field>
        ) : null}
        <Button type="button" variant="secondary" className="w-full" onClick={() => onAdd(product, activeVariantId)}>
          Add to cart
        </Button>
      </div>
    </article>
  )
}

export function Merchandise({ onSheetOpenChange }: Props) {
  const products = getOrderableProducts()
  const featured = getFeaturedProducts()
  const accessories = getAccessoryProducts()
  const merchReady = isMerchReady()
  const emailReady = isOrganizerEmailReady()
  const cart = useCart()
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [donationAddon, setDonationAddon] = useState('0')
  const [policyOk, setPolicyOk] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [addedNote, setAddedNote] = useState<string | null>(null)

  function setSheet(open: boolean) {
    setCheckoutOpen(open)
    onSheetOpenChange?.(open)
  }

  function handleAdd(product: Product, variantId: string) {
    if (!variantId) {
      setError('Choose a variant before adding to cart.')
      return
    }
    cart.addItem(product, variantId, 1)
    setError(null)
    setAddedNote(`Added ${product.name} to cart.`)
    window.setTimeout(() => {
      setAddedNote((current) => (current?.includes(product.name) ? null : current))
    }, 2200)
  }

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
    const addon = Number(donationAddon) || 0
    if (addon < 0) {
      setError('Donation add-on cannot be negative.')
      return null
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

  async function openOrderDraft() {
    setError(null)
    setStatus(null)
    const payload = buildOrderPayload()
    if (!payload) return
    openMailto(payload)
    setStatus('Your email draft should open. Nothing is sent until you press send in your mail app.')
    cart.reset()
    setPolicyOk(false)
    setSheet(false)
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
    <Section
      id="merchandise"
      eyebrow="Keepsakes"
      title="Exaltavit keepsakes"
      lead="Take the concert home — featured pieces first, smaller accents below. Checkout sends an order request by email."
    >
      {!merchReady ? null : (
        <>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-navy/65" aria-live="polite">
              Cart: <strong className="text-navy">{cart.itemCount}</strong> item{cart.itemCount === 1 ? '' : 's'}
              {cart.itemCount > 0 ? ` · ${formatPhp(cartSubtotal(cart.lines))}` : ''}
            </p>
            {emailReady ? (
              <Button type="button" variant="primary" disabled={cart.itemCount === 0} onClick={() => setSheet(true)}>
                Send order request
              </Button>
            ) : null}
          </div>

          {addedNote ? (
            <div className="mb-4">
              <Notice tone="success">{addedNote}</Notice>
            </div>
          ) : null}
          {error && !checkoutOpen ? (
            <div className="mb-4">
              <Notice tone="warn">{error}</Notice>
            </div>
          ) : null}

          <div className="mb-4">
            <h3 className="font-display text-3xl text-navy">Featured</h3>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            {(featured.length > 0 ? featured : products.slice(0, 2)).map((product) => (
              <ProductCard key={product.id} product={product} onAdd={handleAdd} />
            ))}
          </div>

          {accessories.length > 0 ? (
            <>
              <div className="mt-12 mb-4">
                <h3 className="font-display text-3xl text-navy">Accessories</h3>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {accessories.map((product) => (
                  <ProductCard key={product.id} product={product} compact onAdd={handleAdd} />
                ))}
              </div>
            </>
          ) : null}

          <div className="mt-8 space-y-2 text-sm text-navy/65">
            <p>{eventConfig.pickupCopy}</p>
            <p>{eventConfig.orderDeadlineCopy}</p>
            {!eventConfig.sizeChartReady ? (
              <p>Size chart not published yet — note if you are between sizes when you order.</p>
            ) : null}
          </div>

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
              <h3 className="font-display text-2xl text-navy">Send order request</h3>
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
                  I understand this is a pre-order request. Payment and pickup are confirmed by the organizer — not
                  processed on this website.
                </span>
              </label>
              <p className="text-sm font-semibold text-navy">
                Total: {formatPhp(cartSubtotal(cart.lines) + (Number(donationAddon) || 0))}
              </p>
              {error ? <Notice tone="warn">{error}</Notice> : null}
              <MailtoActions
                onOpenDraft={openOrderDraft}
                onCopyMessage={copyOrderMessage}
                openLabel="Open email draft"
                copyLabel="Copy message"
              />
            </div>
          </div>
        </div>
      ) : null}
    </Section>
  )
}
