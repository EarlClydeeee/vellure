'use client';

import { useState } from 'react';
import { CheckoutForm } from '@/components/store/CheckoutForm';
import { OrderConfirmation } from '@/components/store/OrderConfirmation';
import { Order } from '@/lib/types';
import { formatPrice } from '@/lib/format-price';

interface CartLineItem {
  name: string;
  quantity: number;
  price: number;
}

interface CheckoutPageClientProps {
  userEmail: string;
  cartItems: CartLineItem[];
  subtotal: number;
}

export function CheckoutPageClient({
  userEmail,
  cartItems,
  subtotal,
}: CheckoutPageClientProps) {
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [liveTotals, setLiveTotals] = useState({
    shippingFee: 0,
    discount: 0,
    total: subtotal,
  });

  if (completedOrder) {
    return <OrderConfirmation order={completedOrder} />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <CheckoutForm
          userEmail={userEmail}
          subtotal={subtotal}
          onOrderComplete={setCompletedOrder}
          onTotalsChange={setLiveTotals}
        />
      </div>
      <div>
        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <div className="space-y-2">
            {cartItems.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 border-t pt-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>
                {liveTotals.shippingFee === 0 && liveTotals.total !== subtotal
                  ? 'Free'
                  : formatPrice(liveTotals.shippingFee)}
              </span>
            </div>
            {liveTotals.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>-{formatPrice(liveTotals.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-medium">
              <span>Total</span>
              <span>{formatPrice(liveTotals.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
