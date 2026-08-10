'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { addToCartAction } from '@/app/(store)/actions';
import { addToGuestCart } from '@/lib/cart/guest-cart';
import { useCart } from '@/components/store/CartProvider';

interface AddToCartButtonProps {
  productId: string;
  quantity: number;
  disabled?: boolean;
}

export function AddToCartButton({ productId, quantity, disabled }: AddToCartButtonProps) {
  const router = useRouter();
  const { refreshCartCount } = useCart();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const result = await addToCartAction(productId, quantity);
      if (result && 'requiresAuth' in result && result.requiresAuth) {
        addToGuestCart(productId, quantity);
        refreshCartCount();
      } else {
        router.refresh();
      }
      refreshCartCount();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      size="lg"
      disabled={disabled || loading}
      onClick={handleClick}
      className="w-full sm:w-auto"
    >
      <ShoppingCart className="h-5 w-5" />
      {loading ? 'Adding...' : 'Add to Cart'}
    </Button>
  );
}

export function useAddToCart() {
  const router = useRouter();
  const { refreshCartCount } = useCart();

  async function add(productId: string, quantity: number) {
    const result = await addToCartAction(productId, quantity);
    if (result && 'requiresAuth' in result && result.requiresAuth) {
      addToGuestCart(productId, quantity);
    } else {
      router.refresh();
    }
    refreshCartCount();
    return result;
  }

  return { add };
}
