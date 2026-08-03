'use client';

import { useState } from 'react';
import { QuantitySelector } from '@/components/store/QuantitySelector';
import { AddToCartButton } from '@/components/store/AddToCartButton';

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
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      {!disabled && (
        <QuantitySelector max={maxStock} value={quantity} onChange={setQuantity} />
      )}
      <AddToCartButton productId={productId} quantity={quantity} disabled={disabled} />
    </div>
  );
}
