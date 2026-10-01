import { useMemo, useState } from 'react'
import {
  eventConfig,
  formatPhp,
  getAccessoryProducts,
  getFeaturedProducts,
  getOrderableProducts,
  isMerchReady,
  resolveVariantId,
  type Product,
  type ProductVariant,
} from '../config/event'
import { useCartStore } from '../hooks/useCart'
import { cartSubtotal } from '../lib/cart'
import { MediaPlaceholder } from './MediaPlaceholder'
import { Section } from './ui'

function productImagePosition(productId: string) {
  if (productId === 'enamel') return 'object-[70%_80%]'
  if (productId === 'button') return 'object-[30%_70%]'
  if (productId === 'keychain') return 'object-[85%_55%]'
  if (productId === 'tote') return 'object-[20%_30%]'
  return 'object-top'
}

const SWATCHES: Record<string, string> = {
  ivory: '#f3ecdf',
  navy: '#101f32',
}

function OptionChips({
  label,
  options,
  value,
  onChange,
  swatch = false,
}: {
  label: string
  options: ProductVariant[]
  value: string
  onChange: (id: string) => void
  swatch?: boolean
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold tracking-[0.14em] text-navy/55 uppercase">{label}</p>
      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={label}>
        {options.map((option) => {
          const active = option.id === value
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(option.id)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                active ? 'border-[#2e4a6e] bg-[#2e4a6e] text-ivory' : 'border-navy/20 text-navy/75 hover:border-navy/50'
              }`}
            >
              {swatch && SWATCHES[option.id] ? (
                <span
                  className="h-3 w-3 rounded-full border border-navy/30"
                  style={{ backgroundColor: SWATCHES[option.id] }}
                  aria-hidden="true"
                />
              ) : null}
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
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
  const [justAdded, setJustAdded] = useState(false)

  const activeVariantId = useMemo(() => {
    if (product.colors?.length || product.sizes?.length) {
      return resolveVariantId(product, colorId || undefined, sizeId || undefined)
    }
    return variantId
  }, [product, colorId, sizeId, variantId])

  function add() {
    onAdd(product, activeVariantId)
    setJustAdded(true)
    window.setTimeout(() => setJustAdded(false), 1600)
  }

  const image = product.imageSrc ? (
    <img
      src={product.imageSrc}
      alt={product.imageAlt ?? product.name}
      className={`h-full w-full object-cover transition duration-700 group-hover:scale-[1.04] ${productImagePosition(product.id)}`}
    />
  ) : (
    <MediaPlaceholder label={`${product.name} product photo`} className="h-full w-full">
      <p className="font-display text-xl text-ivory">{product.name}</p>
      <p className="mt-1 text-[10px] tracking-[0.16em] text-gold-soft uppercase">Artwork placeholder</p>
    </MediaPlaceholder>
  )

  return (
    <article
      className={`group flex overflow-hidden rounded-md border border-navy/10 bg-white/55 transition duration-300 hover:border-gold/40 hover:shadow-[0_12px_32px_-18px_rgba(16,31,50,0.35)] ${
        compact ? 'flex-col' : 'flex-col sm:flex-row'
      }`}
    >
      <div
        className={
          compact
            ? 'px-3 pt-3'
            : 'p-3 sm:w-[38%] sm:shrink-0 sm:pr-0'
        }
      >
        <div
          className={`overflow-hidden rounded-sm bg-navy/5 ${
            compact ? 'aspect-[2/1]' : 'aspect-[16/9] sm:aspect-auto sm:h-full'
          }`}
        >
          {image}
        </div>
      </div>
      <div className={`flex flex-1 flex-col ${compact ? 'px-5 pt-4 pb-5' : 'px-5 pt-4 pb-5 sm:px-6 sm:py-6'}`}>
        <div className="flex items-baseline justify-between gap-3">
          <h3 className={`font-display leading-tight text-navy ${compact ? 'text-xl' : 'text-2xl'}`}>{product.name}</h3>
          <p className="shrink-0 text-sm font-semibold tracking-wide text-gold">{formatPhp(product.pricePhp)}</p>
        </div>
        <span className="mt-2 block h-px w-8 bg-gold/50" aria-hidden="true" />
        <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/60">{product.description}</p>
        <div className="mt-4 space-y-3">
          {product.colors?.length ? (
            <OptionChips label="Color" options={product.colors} value={colorId} onChange={setColorId} swatch />
          ) : null}
          {product.sizes?.length ? (
            <OptionChips label="Size" options={product.sizes} value={sizeId} onChange={setSizeId} />
          ) : null}
          {!product.colors?.length && !product.sizes?.length && product.variants.length > 1 ? (
            <OptionChips label="Design" options={product.variants} value={variantId} onChange={setVariantId} />
          ) : null}
          <button
            type="button"
            onClick={add}
            className={`flex w-full items-center justify-center gap-2 rounded-sm px-4 py-2.5 text-xs font-semibold tracking-[0.16em] uppercase transition ${
              justAdded ? 'bg-gold text-ivory' : 'bg-[#2e4a6e] text-ivory hover:bg-[#3a5a82]'
            }`}
          >
            {justAdded ? 'Added ✓' : 'Add to cart'}
          </button>
        </div>
      </div>
    </article>
  )
}

export function Merchandise() {
  const products = getOrderableProducts()
  const featured = getFeaturedProducts()
  const accessories = getAccessoryProducts()
  const merchReady = isMerchReady()
  const cart = useCartStore()

  function handleAdd(product: Product, variantId: string) {
    if (!variantId) return
    cart.addItem(product, variantId, 1)
  }

  return (
    <Section
      id="merchandise"
      eyebrow="Keepsakes"
      title="Exaltavit keepsakes"
      lead="Take the concert home — pick your pieces, then send one order request by email. Payment and pickup are confirmed by the organizer."
    >
      {!merchReady ? null : (
        <>
          <div className="mb-14 flex flex-col gap-4 rounded-lg bg-navy px-5 py-4 text-ivory shadow-md sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4" aria-live="polite">
              <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-ivory/10 text-gold-soft">
                <CartIcon className="h-5 w-5" />
                {cart.itemCount > 0 ? (
                  <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[11px] font-bold text-ivory">
                    {cart.itemCount}
                  </span>
                ) : null}
              </span>
              <div>
                <p className="font-display text-xl leading-tight">
                  {cart.itemCount > 0
                    ? `${cart.itemCount} item${cart.itemCount === 1 ? '' : 's'} · ${formatPhp(cartSubtotal(cart.lines))}`
                    : 'Your cart is empty'}
                </p>
                <p className="text-xs text-ivory/60">
                  {cart.itemCount > 0 ? 'Review your picks, then send your order request.' : 'Add keepsakes below to start an order.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={cart.openCart}
              disabled={cart.itemCount === 0}
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-gold px-5 py-3 text-sm font-semibold text-ivory shadow transition hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-40"
            >
              Review cart & send order <span aria-hidden="true">→</span>
            </button>
          </div>

          <GroupHeading title="Featured" />
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
            {(featured.length > 0 ? featured : products.slice(0, 2)).map((product) => (
              <ProductCard key={product.id} product={product} onAdd={handleAdd} />
            ))}
          </div>

          {accessories.length > 0 ? (
            <>
              <GroupHeading title="Accessories" className="mt-16" />
              <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10">
                {accessories.map((product) => (
                  <ProductCard key={product.id} product={product} compact onAdd={handleAdd} />
                ))}
              </div>
            </>
          ) : null}

          <div className="mt-12 space-y-1 border-t border-navy/10 pt-6 text-sm text-navy/60">
            <p>{eventConfig.pickupCopy}</p>
            <p>{eventConfig.orderDeadlineCopy}</p>
            {!eventConfig.sizeChartReady ? (
              <p>Size chart not published yet — note if you are between sizes when you order.</p>
            ) : null}
          </div>
        </>
      )}
    </Section>
  )
}

function GroupHeading({ title, className = '' }: { title: string; className?: string }) {
  return (
    <div className={`mb-6 flex items-center gap-4 ${className}`}>
      <h3 className="font-display text-2xl text-navy italic">{title}</h3>
      <span className="h-px flex-1 bg-gradient-to-r from-gold/40 to-transparent" aria-hidden="true" />
    </div>
  )
}

export function CartIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 7h12l-1 13H7L6 7ZM9 7V6a3 3 0 0 1 6 0v1" />
    </svg>
  )
}
