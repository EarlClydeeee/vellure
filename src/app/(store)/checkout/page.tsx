import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getCartItems, getCartTotal } from '@/lib/services/cart';
import { CheckoutPageClient } from '@/components/store/CheckoutPageClient';

export default async function CheckoutPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const [cartResult, totalResult] = await Promise.all([
    getCartItems(user.id),
    getCartTotal(user.id),
  ]);

  const cartItems = cartResult.success ? cartResult.data : [];
  const totals = totalResult.success ? totalResult.data : { subtotal: 0, total: 0 };

  if (cartItems.length === 0) {
    redirect('/cart');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <CheckoutPageClient
        userEmail={user.email ?? ''}
        cartItems={cartItems.map((item) => ({
          name: item.product?.name ?? 'Unknown Product',
          quantity: item.quantity,
          price: item.product?.price ?? 0,
        }))}
        subtotal={totals.subtotal}
        total={totals.total}
      />
    </div>
  );
}
