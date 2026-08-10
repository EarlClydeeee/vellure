'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QuantitySelector } from '@/components/store/QuantitySelector';
import { AddToCartButton } from '@/components/store/AddToCartButton';
import { addToGuestCart } from '@/lib/cart/guest-cart';
import { addToCartAction } from '@/app/(store)/actions';
import { useCart } from '@/components/store/CartProvider';
import { Button } from '@/components/ui/button';

interface ProductDetailsClientProps {
  productId: string;
  maxStock: number;
  disabled: boolean;
}

export function ProductDetailsClient({
  productId,
  maxStock,
  disabled,
}: ProductDetailsClientProps) {
  const router = useRouter();
  const { refreshCartCount } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [buyLoading, setBuyLoading] = useState(false);

  async function handleBuyNow() {
    setBuyLoading(true);
    try {
      const result = await addToCartAction(productId, quantity);
      if (result && 'requiresAuth' in result && result.requiresAuth) {
        addToGuestCart(productId, quantity);
        refreshCartCount();
        router.push('/login?returnTo=/checkout');
      } else {
        router.refresh();
        router.push('/checkout');
      }
    } finally {
      setBuyLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {!disabled && (
        <QuantitySelector max={maxStock} value={quantity} onChange={setQuantity} />
      )}
      <div className="flex flex-col gap-2 sm:flex-row">
        <AddToCartButton productId={productId} quantity={quantity} disabled={disabled} />
        <Button
          size="lg"
          disabled={disabled || buyLoading}
          onClick={handleBuyNow}
          className="w-full sm:w-auto bg-vellure-primary hover:bg-vellure-primary/90"
        >
          {buyLoading ? 'Processing...' : 'Buy Now'}
        </Button>
      </div>
    </div>
  );
}
