import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getCartItems, getCartTotal } from '@/lib/services/cart';
import { CartPageClient } from '@/components/store/CartPageClient';
import { CartItemRow } from '@/components/store/CartItemRow';
import { CartSummary } from '@/components/store/CartSummary';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function CartPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <CartPageClient isGuest />;
  }

  const [cartResult, totalResult] = await Promise.all([
    getCartItems(user.id),
    getCartTotal(user.id),
  ]);

  const cartItems = cartResult.success ? cartResult.data : [];
  const totals = totalResult.success ? totalResult.data : { subtotal: 0, total: 0 };

  if (cartItems.length === 0) {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cartItems.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </div>
        <div>
          <CartSummary subtotal={totals.subtotal} total={totals.total} />
        </div>
      </div>
    </div>
  );
}
