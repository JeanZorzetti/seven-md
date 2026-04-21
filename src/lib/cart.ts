export const CART_KEY = 'seven_cart'

export interface CartItem {
  id: string
  slug: string
  name: string
  image: string
  dailyPrice: number
  weeklyPrice: number | null
  monthlyPrice: number
  depositAmount: number
  minRentalDays: number
  quantity: number
}

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) ?? '[]') as CartItem[]
  } catch {
    return []
  }
}

export function saveCart(items: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event('cart-updated'))
}

export function addToCart(item: Omit<CartItem, 'quantity'>): void {
  const cart = getCart()
  const idx = cart.findIndex((i) => i.id === item.id)
  if (idx >= 0) {
    cart[idx].quantity += 1
  } else {
    cart.push({ ...item, quantity: 1 })
  }
  saveCart(cart)
}

export function removeFromCart(id: string): void {
  saveCart(getCart().filter((i) => i.id !== id))
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY)
  window.dispatchEvent(new Event('cart-updated'))
}

export function getCartCount(): number {
  return getCart().reduce((sum, i) => sum + i.quantity, 0)
}
