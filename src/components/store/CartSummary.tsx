'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format-price';

interface CartSummaryProps {
  subtotal: number;
  total: number;
  shippingFee?: number;
  discount?: number;
  showCheckout?: boolean;
}

export function CartSummary({
  subtotal,
  total,
  shippingFee = 0,
  discount = 0,
  showCheckout = true,
}: CartSummaryProps) {
  return (
    <div className="rounded-lg border p-6 space-y-4">
      <h2 className="text-lg font-semibold">Order Summary</h2>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {shippingFee > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping (est.)</span>
            <span>{formatPrice(shippingFee)}</span>
          </div>
        )}
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm font-medium border-t pt-2">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
      {showCheckout && (
        <Link href="/checkout" className="block">
          <Button className="w-full">Proceed to Checkout</Button>
        </Link>
      )}
    </div>
  );
}
