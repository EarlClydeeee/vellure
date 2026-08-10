'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  getGuestCart,
  getGuestCartCount,
  type GuestCartLine,
} from '@/lib/cart/guest-cart';

interface CartContextValue {
  cartCount: number;
  isGuest: boolean;
  refreshCartCount: () => void;
}

const CartContext = createContext<CartContextValue>({
  cartCount: 0,
  isGuest: true,
  refreshCartCount: () => {},
});

export function useCart() {
  return useContext(CartContext);
}

interface CartProviderProps {
  children: React.ReactNode;
  initialCount?: number;
  isAuthenticated?: boolean;
}

export function CartProvider({
  children,
  initialCount = 0,
  isAuthenticated = false,
}: CartProviderProps) {
  const [cartCount, setCartCount] = useState(initialCount);
  const [isGuest, setIsGuest] = useState(!isAuthenticated);

  const refreshCartCount = useCallback(() => {
    if (isAuthenticated) {
      setIsGuest(false);
      return;
    }
    setIsGuest(true);
    setCartCount(getGuestCartCount());
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      setCartCount(initialCount);
      setIsGuest(false);
    } else {
      setIsGuest(true);
      setCartCount(getGuestCartCount());
    }
  }, [initialCount, isAuthenticated]);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === 'vellure_guest_cart' && !isAuthenticated) {
        setCartCount(getGuestCartCount());
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [isAuthenticated]);

  const value = useMemo(
    () => ({ cartCount, isGuest, refreshCartCount }),
    [cartCount, isGuest, refreshCartCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export type { GuestCartLine };
