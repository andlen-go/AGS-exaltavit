import type { Product } from '../config/event'

export type CartLine = {
  key: string
  productId: string
  productName: string
  variantId: string
  variantLabel: string
  unitPricePhp: number
  quantity: number
}

const STORAGE_KEY = 'exaltavit-merch-cart-v1'

export function lineKey(productId: string, variantId: string): string {
  return `${productId}::${variantId}`
}

export function loadCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartLine[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (line) =>
        line &&
        typeof line.key === 'string' &&
        typeof line.productId === 'string' &&
        typeof line.quantity === 'number' &&
        line.quantity > 0,
    )
  } catch {
    return []
  }
}

export function saveCart(lines: CartLine[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
}

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.unitPricePhp * line.quantity, 0)
}

export function addToCart(
  lines: CartLine[],
  product: Product,
  variantId: string,
  quantity = 1,
): CartLine[] {
  const variant = product.variants.find((item) => item.id === variantId)
  if (!variant || quantity < 1) return lines

  const key = lineKey(product.id, variant.id)
  const existing = lines.find((line) => line.key === key)
  if (existing) {
    return lines.map((line) =>
      line.key === key ? { ...line, quantity: line.quantity + quantity } : line,
    )
  }

  return [
    ...lines,
    {
      key,
      productId: product.id,
      productName: product.name,
      variantId: variant.id,
      variantLabel: variant.label,
      unitPricePhp: product.pricePhp,
      quantity,
    },
  ]
}

export function setLineQuantity(lines: CartLine[], key: string, quantity: number): CartLine[] {
  if (quantity <= 0) return lines.filter((line) => line.key !== key)
  return lines.map((line) => (line.key === key ? { ...line, quantity } : line))
}

export function clearCart(): void {
  localStorage.removeItem(STORAGE_KEY)
}
