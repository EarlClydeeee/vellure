import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getOrderById } from '@/lib/services/orders';
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

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const result = await getOrderById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const order = result.data;

  // Ensure the order belongs to the current user
  if (order.customerId !== user.id) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/orders">
          <Button variant="ghost" size="sm">
            &larr; Back to Orders
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
            <p className="text-sm text-muted-foreground">
              Placed on {order.createdAt.toLocaleDateString()}
            </p>
          </div>
          <Badge variant={getStatusVariant(order.status)} className="w-fit">
            {order.status}
          </Badge>
        </div>

        {/* Items */}
        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="font-semibold">Ordered Items</h2>
          <div className="space-y-3">
            {order.items?.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div>
                  <span className="font-medium">{item.productName}</span>
                  <span className="text-muted-foreground ml-2">
                    x {item.quantity} @ ${item.productPrice.toFixed(2)}
                  </span>
                </div>
                <span className="font-medium">${item.subtotal.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 flex justify-between font-medium">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="font-semibold">Delivery Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Name</span>
              <p className="font-medium">{order.fullName}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Email</span>
              <p className="font-medium">{order.email}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Contact Number</span>
              <p className="font-medium">{order.contactNumber}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Payment Method</span>
              <p className="font-medium">{order.paymentMethod}</p>
            </div>
            <div className="sm:col-span-2">
              <span className="text-muted-foreground">Delivery Address</span>
              <p className="font-medium">{order.deliveryAddress}</p>
            </div>
            {order.notes && (
              <div className="sm:col-span-2">
                <span className="text-muted-foreground">Notes</span>
                <p className="font-medium">{order.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
