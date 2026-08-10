'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { getGuestCart } from '@/lib/cart/guest-cart';
import { getProductsByIds } from '@/lib/services/products';
import { CartItemRow } from '@/components/store/CartItemRow';
import { CartSummary } from '@/components/store/CartSummary';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/types';
import { useCart } from '@/components/store/CartProvider';

interface CartPageClientProps {
  isGuest?: boolean;
}

export function CartPageClient({ isGuest = false }: CartPageClientProps) {
  const { cartCount } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const guestLines = useMemo(() => getGuestCart(), [cartCount]);

  useEffect(() => {
    if (!isGuest) return;

    async function load() {
      const lines = getGuestCart();
      if (lines.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const result = await fetch('/api/cart/guest-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: lines.map((l) => l.productId) }),
      });
      const data = await result.json();
      setProducts(data.products ?? []);
      setLoading(false);
    }

    load();
  }, [isGuest, cartCount]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground">Loading cart...</p>
      </div>
    );
  }

  if (guestLines.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          title="Your cart is empty"
          description="Browse our products and add items to your cart."
          icon={<ShoppingCart className="h-12 w-12" />}
          action={
            <Link href="/products">
              <Button>Browse Products</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const productMap = new Map(products.map((p) => [p.id, p]));
  const subtotal = guestLines.reduce((sum, line) => {
    const p = productMap.get(line.productId);
    return sum + (p?.price ?? 0) * line.quantity;
  }, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Shopping Cart</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Sign in at checkout to complete your order. Your cart will be saved.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {guestLines.map((line) => {
            const product = productMap.get(line.productId);
            if (!product) return null;
            return (
              <CartItemRow
                key={line.productId}
                isGuest
                guestProduct={product}
                item={{
                  id: line.productId,
                  customerId: '',
                  productId: line.productId,
                  quantity: line.quantity,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                }}
              />
            );
          })}
        </div>
        <div>
          <CartSummary subtotal={subtotal} total={subtotal} />
          <p className="mt-3 text-xs text-muted-foreground">
            Shipping and promo codes applied at checkout.
          </p>
        </div>
      </div>
    </div>
  );
}
