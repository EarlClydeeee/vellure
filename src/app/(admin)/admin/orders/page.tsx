import { Metadata } from 'next';
import { getOrders } from '@/lib/services/orders';
import { OrderTable } from '@/components/admin/OrderTable';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Orders - Vellure Admin',
};

export default async function AdminOrdersPage() {
  const result = await getOrders();
  const orders = result.success ? result.data : [];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Orders</h1>
      <OrderTable orders={orders} />
    </div>
  );
}
