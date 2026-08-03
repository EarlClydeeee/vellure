import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ServiceResult } from '@/lib/types/service';

export interface DashboardMetrics {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalCustomers: number;
  totalSalesAmount: number;
}

export async function getDashboardMetrics(): Promise<
  ServiceResult<DashboardMetrics>
> {
  const supabase = await createServerSupabaseClient();

  const [productsRes, ordersRes, customersRes, completedOrdersRes] =
    await Promise.all([
      supabase
        .from('products')
        .select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('status'),
      supabase
        .from('customers')
        .select('*', { count: 'exact', head: true }),
      supabase
        .from('orders')
        .select('total')
        .eq('status', 'Completed'),
    ]);

  if (productsRes.error) {
    return {
      success: false,
      error: productsRes.error.message,
      code: 'QUERY_ERROR',
    };
  }
  if (ordersRes.error) {
    return {
      success: false,
      error: ordersRes.error.message,
      code: 'QUERY_ERROR',
    };
  }
  if (customersRes.error) {
    return {
      success: false,
      error: customersRes.error.message,
      code: 'QUERY_ERROR',
    };
  }
  if (completedOrdersRes.error) {
    return {
      success: false,
      error: completedOrdersRes.error.message,
      code: 'QUERY_ERROR',
    };
  }

  const orders = ordersRes.data ?? [];
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) => o.status === 'Pending'
  ).length;
  const completedOrders = (completedOrdersRes.data ?? []).length;
  const totalSalesAmount = (completedOrdersRes.data ?? []).reduce(
    (sum, o) => sum + Number(o.total),
    0
  );

  return {
    success: true,
    data: {
      totalProducts: productsRes.count ?? 0,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalCustomers: customersRes.count ?? 0,
      totalSalesAmount,
    },
  };
}
