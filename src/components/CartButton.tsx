import { formatPhp, isMerchReady } from '../config/event'
import { useCartStore } from '../hooks/useCart'
import { cartSubtotal } from '../lib/cart'
import { CartIcon } from './Merchandise'

/** Right-edge cart tab — always reachable; bumps whenever an item is added. */
export function CartButton({ hidden = false }: { hidden?: boolean }) {
  const cart = useCartStore()
  if (!isMerchReady() || hidden || cart.open) return null

  const hasItems = cart.itemCount > 0

  return (
    <button
      type="button"
      onClick={hasItems ? cart.openCart : () => document.getElementById('merchandise')?.scrollIntoView({ behavior: 'smooth' })}
      aria-label={hasItems ? `Open cart, ${cart.itemCount} items` : 'Browse keepsakes'}
      aria-haspopup={hasItems ? 'dialog' : undefined}
      className="fixed top-1/2 right-0 z-30 flex -translate-y-1/2 flex-col items-center gap-1.5 rounded-l-lg border border-r-0 border-gold-soft/60 bg-navy px-2.5 py-3 text-ivory shadow-lg transition hover:bg-navy-soft"
    >
      <span key={cart.addedTick} className={`relative ${cart.addedTick > 0 ? 'animate-cart-bump' : ''}`}>
        <CartIcon className="h-6 w-6 text-gold-soft" />
        {hasItems ? (
          <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[11px] font-bold text-ivory">
            {cart.itemCount}
          </span>
        ) : null}
      </span>
      <span className="text-[10px] font-semibold tracking-[0.12em] uppercase">
        {hasItems ? formatPhp(cartSubtotal(cart.lines)) : 'Shop'}
      </span>
    </button>
  )
}
