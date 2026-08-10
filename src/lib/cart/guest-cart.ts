const GUEST_CART_KEY = 'vellure_guest_cart';

export interface GuestCartLine {
  productId: string;
  quantity: number;
}

export function getGuestCart(): GuestCartLine[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as GuestCartLine[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveGuestCart(items: GuestCartLine[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

export function clearGuestCart() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(GUEST_CART_KEY);
}

export function getGuestCartCount(items: GuestCartLine[] = getGuestCart()): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function addToGuestCart(productId: string, quantity: number): GuestCartLine[] {
  const items = getGuestCart();
  const existing = items.find((i) => i.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({ productId, quantity });
  }
  saveGuestCart(items);
  return items;
}

export function updateGuestCartQuantity(productId: string, quantity: number): GuestCartLine[] {
  let items = getGuestCart();
  if (quantity <= 0) {
    items = items.filter((i) => i.productId !== productId);
  } else {
    items = items.map((i) => (i.productId === productId ? { ...i, quantity } : i));
  }
  saveGuestCart(items);
  return items;
}

export function removeFromGuestCart(productId: string): GuestCartLine[] {
  const items = getGuestCart().filter((i) => i.productId !== productId);
  saveGuestCart(items);
  return items;
}
