import { createContext, useContext, useEffect, useState } from 'react'
import type { Product } from '../config/event'
import {
  addToCart,
  clearCart,
  loadCart,
  saveCart,
  setLineQuantity,
  type CartLine,
} from '../lib/cart'

export function useCart() {
  const [lines, setLines] = useState<CartLine[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setLines(loadCart())
    setReady(true)
  }, [])

  useEffect(() => {
    // `ready` stays false during the first effect pass, so we never persist
    // the initial empty state over a stored cart.
    if (!ready) return
    try {
      saveCart(lines)
    } catch {
      // Keep the in-memory cart usable when storage is blocked.
    }
  }, [lines, ready])

  return {
    lines,
    ready,
    itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
    addItem: (product: Product, variantId: string, quantity = 1) => {
      if (!variantId) return
      setLines((current) => addToCart(current, product, variantId, quantity))
    },
    updateQuantity: (key: string, quantity: number) => {
      setLines((current) => setLineQuantity(current, key, quantity))
    },
    removeItem: (key: string) => {
      setLines((current) => current.filter((line) => line.key !== key))
    },
    reset: () => {
      clearCart()
      setLines([])
    },
  }
}

export type CartStore = ReturnType<typeof useCart> & {
  open: boolean
  openCart: () => void
  closeCart: () => void
  /** Increments on every add — drives the cart button's bump animation */
  addedTick: number
}

export const CartContext = createContext<CartStore | null>(null)

export function useCartStore(): CartStore {
  const store = useContext(CartContext)
  if (!store) throw new Error('useCartStore must be used inside CartContext')
  return store
}
