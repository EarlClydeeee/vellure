'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { addToCartAction } from '@/app/(store)/actions';

interface AddToCartButtonProps {
  productId: string;
  quantity: number;
  disabled?: boolean;
}

export function AddToCartButton({ productId, quantity, disabled }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      await addToCartAction(productId, quantity);
    } catch {
      // User may not be logged in; silently fail
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
