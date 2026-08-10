import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getOrdersByCustomer } from '@/lib/services/orders';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/format-price';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';

export default async function AccountOrdersPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login?returnTo=/account/orders');

  const result = await getOrdersByCustomer(user.id);
  const orders = result.success ? result.data : [];

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        description="When you place an order, it will appear here."
        icon={<Package className="h-12 w-12" />}
        action={
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Order History</h2>
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/account/orders/${order.id}`}
          className="block rounded-lg border p-4 hover:bg-muted/50 transition-colors"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-medium">Order #{order.orderNumber}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString('en-PH', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline">{order.status}</Badge>
              <span className="font-semibold">{formatPrice(order.total)}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
