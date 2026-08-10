import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getOrderById } from '@/lib/services/orders';
import { getMockPaymentInstructions } from '@/lib/services/mock-payments';
import { formatPrice } from '@/lib/format-price';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

interface PaymentPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function MockPaymentPage({ params }: PaymentPageProps) {
  const { orderId } = await params;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const result = await getOrderById(orderId);
  if (!result.success || !result.data || result.data.customerId !== user.id) {
    notFound();
  }

  const order = result.data;
  const reference = order.paymentReference ?? order.id.slice(0, 8).toUpperCase();
  const instructions = getMockPaymentInstructions(
    order.paymentMethod,
    reference,
    order.total
  );

  return (
    <div className="container mx-auto max-w-lg px-4 py-12">
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <CheckCircle className="h-12 w-12 text-green-500" />
          <Badge variant="secondary">Order Placed</Badge>
          <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
          <p className="text-muted-foreground">
            Thank you! Complete payment using the steps below.
          </p>
        </div>

        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="font-semibold">Order Summary</h2>
          {order.items?.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                {item.productName} x {item.quantity}
              </span>
              <span>{formatPrice(item.subtotal)}</span>
            </div>
          ))}
          <div className="border-t pt-2 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
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
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Payment: {order.paymentMethod} · Status: {order.status}
          </p>
        </div>

        <div className="rounded-lg border p-8 space-y-4">
          <h2 className="text-lg font-bold text-center">{instructions.title}</h2>

          <div className="rounded-lg bg-muted p-6 text-center">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Reference</p>
            <p className="text-xl font-mono font-bold">{reference}</p>
          </div>

          <ol className="space-y-3 text-sm">
            {instructions.steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#111111] text-xs text-white">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          <p className="text-xs text-muted-foreground text-center">
            Demo payment flow — admin will confirm locally.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Link href={`/account/orders/${order.id}`} className="flex-1">
            <Button className="w-full" variant="outline">
              View Order Status
            </Button>
          </Link>
          <Link href="/products" className="flex-1">
            <Button className="w-full">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
