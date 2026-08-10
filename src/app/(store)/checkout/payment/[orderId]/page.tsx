import { notFound } from 'next/navigation';
import Link from 'next/link';
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
      <div className="space-y-6 rounded-lg border p-8">
        <div className="text-center space-y-2">
          <Badge variant="secondary">Payment Pending</Badge>
          <h1 className="text-2xl font-bold">{instructions.title}</h1>
          <p className="text-muted-foreground">
            Order #{order.orderNumber} — {formatPrice(order.total)}
          </p>
        </div>

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
          This is a demo payment flow. An admin will confirm your payment locally.
        </p>

        <Link href={`/account/orders/${order.id}`}>
          <Button className="w-full" variant="outline">
            View Order Status
          </Button>
        </Link>
      </div>
    </div>
  );
}
