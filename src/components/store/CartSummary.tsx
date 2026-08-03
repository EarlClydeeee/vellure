'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface CartSummaryProps {
  subtotal: number;
  total: number;
}

export function CartSummary({ subtotal, total }: CartSummaryProps) {
  return (
    <div className="rounded-lg border p-6 space-y-4">
      <h2 className="text-lg font-semibold">Order Summary</h2>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm font-medium border-t pt-2">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      <Link href="/checkout" className="block">
        <Button className="w-full">Proceed to Checkout</Button>
      </Link>
    </div>
  );
}
