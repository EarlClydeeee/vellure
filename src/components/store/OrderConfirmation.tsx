'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Order } from '@/lib/types';
import { formatPrice } from '@/lib/format-price';

interface OrderConfirmationProps {
  order: Order;
}

export function OrderConfirmation({ order }: OrderConfirmationProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-6 py-8">
      <CheckCircle className="h-16 w-16 text-green-500" />
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Order Placed Successfully!</h1>
        <p className="text-muted-foreground">
          Thank you for your order. Your order number is{' '}
          <span className="font-semibold text-foreground">#{order.orderNumber}</span>.
        </p>
      </div>

      <div className="w-full max-w-md rounded-lg border p-6 text-left space-y-4">
        <h2 className="font-semibold">Order Summary</h2>
        {order.items && order.items.length > 0 && (
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.productName} x {item.quantity}
                </span>
                <span>{formatPrice(item.subtotal)}</span>
              </div>
            ))}
          </div>
        )}
        <div className="border-t pt-2 space-y-1 text-sm">
          {order.shippingFee > 0 && (
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatPrice(order.shippingFee)}</span>
            </div>
          )}
          {order.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Payment: {order.paymentMethod}</p>
          <p>Status: {order.status}</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Link href="/account/orders">
          <Button variant="outline">View Orders</Button>
        </Link>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
