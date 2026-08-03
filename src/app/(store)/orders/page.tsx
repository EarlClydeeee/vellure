import Link from 'next/link';
import { Package } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getOrdersByCustomer } from '@/lib/services/orders';
import { EmptyState } from '@/components/shared/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

function getStatusVariant(status: string) {
  switch (status) {
    case 'Completed':
      return 'default' as const;
    case 'Cancelled':
      return 'destructive' as const;
    case 'Pending':
      return 'secondary' as const;
    default:
      return 'outline' as const;
  }
}

export default async function OrdersPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          title="Please log in"
          description="You need to be logged in to view your orders."
          icon={<Package className="h-12 w-12" />}
          action={
            <Link href="/login">
              <Button>Log In</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const result = await getOrdersByCustomer(user.id);
  const orders = result.success ? result.data : [];

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          title="No orders yet"
          description="You haven't placed any orders. Start shopping to see your orders here."
          icon={<Package className="h-12 w-12" />}
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
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border p-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="font-medium">Order #{order.orderNumber}</span>
                <Badge variant={getStatusVariant(order.status)}>
                  {order.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {order.createdAt.toLocaleDateString()} &middot; ${order.total.toFixed(2)}
              </p>
            </div>
            <Link href={`/orders/${order.id}`}>
              <Button variant="outline" size="sm">
                View
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
