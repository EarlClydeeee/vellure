'use client';

import { useState } from 'react';
import { CheckoutForm } from '@/components/store/CheckoutForm';
import { OrderConfirmation } from '@/components/store/OrderConfirmation';
import { Order } from '@/lib/types';

interface CartLineItem {
  name: string;
  quantity: number;
  price: number;
}

interface CheckoutPageClientProps {
  userEmail: string;
  cartItems: CartLineItem[];
  subtotal: number;
  total: number;
}

export function CheckoutPageClient({
  userEmail,
  cartItems,
  subtotal,
  total,
}: CheckoutPageClientProps) {
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (completedOrder) {
    return <OrderConfirmation order={completedOrder} />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <CheckoutForm userEmail={userEmail} onOrderComplete={setCompletedOrder} />
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
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 border-t pt-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
