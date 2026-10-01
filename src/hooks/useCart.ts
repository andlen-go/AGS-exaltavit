import { useEffect, useState } from 'react'
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
    if (!ready) return
    saveCart(lines)
  }, [lines, ready])

  return {
    lines,
    ready,
    itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
    addItem: (product: Product, variantId: string, quantity = 1) => {
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
