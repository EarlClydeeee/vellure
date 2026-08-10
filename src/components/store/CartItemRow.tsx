'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuantitySelector } from '@/components/store/QuantitySelector';
import {
  updateCartQuantityAction,
  removeFromCartAction,
} from '@/app/(store)/actions';
import { updateGuestCartQuantity, removeFromGuestCart } from '@/lib/cart/guest-cart';
import { useCart } from '@/components/store/CartProvider';
import { formatPrice } from '@/lib/format-price';
import { CartItem, Product } from '@/lib/types';

interface CartItemRowProps {
  item: CartItem;
  isGuest?: boolean;
  guestProduct?: Product;
}

export function CartItemRow({ item, isGuest, guestProduct }: CartItemRowProps) {
  const [isPending, startTransition] = useTransition();
  const [quantity, setQuantity] = useState(item.quantity);
  const { refreshCartCount } = useCart();

  const product = guestProduct ?? item.product;
  if (!product) return null;

  const lineSubtotal = product.price * quantity;

  function handleQuantityChange(newQuantity: number) {
    setQuantity(newQuantity);
    startTransition(async () => {
      if (isGuest) {
        updateGuestCartQuantity(item.productId, newQuantity);
        refreshCartCount();
      } else {
        await updateCartQuantityAction(item.productId, newQuantity);
      }
    });
  }

  function handleRemove() {
    startTransition(async () => {
      if (isGuest) {
        removeFromGuestCart(item.productId);
        refreshCartCount();
        window.location.reload();
      } else {
        await removeFromCartAction(item.productId);
      }
    });
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b py-4">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h3 className="text-sm font-medium">{product.name}</h3>
          <p className="text-sm text-muted-foreground">{formatPrice(product.price)}</p>
        </div>

        <div className="flex items-center gap-4">
          <QuantitySelector
            max={product.stockQuantity}
            value={quantity}
            onChange={handleQuantityChange}
          />

          <span className="w-24 text-right text-sm font-medium">
            {formatPrice(lineSubtotal)}
          </span>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            disabled={isPending}
            aria-label="Remove item"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
    </div>
  );
}
