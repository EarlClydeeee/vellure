import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Customer } from '@/lib/types';
import { ServiceResult } from '@/lib/types/service';

export interface CustomerWithAggregates extends Customer {
  totalOrders: number;
  totalPurchaseAmount: number;
}

function mapCustomer(row: Record<string, unknown>): Customer {
  return {
    id: row.id as string,
    fullName: (row.full_name as string) ?? null,
    email: row.email as string,
    contactNumber: (row.contact_number as string) ?? null,
    createdAt: new Date(row.created_at as string),
  };
}

export async function getCustomers(): Promise<
  ServiceResult<CustomerWithAggregates[]>
> {
  const supabase = await createServerSupabaseClient();

  // Get all customers
  const { data: customers, error: customersError } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });

  if (customersError) {
    return {
      success: false,
      error: customersError.message,
      code: 'QUERY_ERROR',
    };
  }

  // Get order aggregates per customer
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('customer_id, total');

  if (ordersError) {
    return {
      success: false,
      error: ordersError.message,
      code: 'QUERY_ERROR',
    };
  }

  // Build aggregate map
  const aggregates = new Map<
    string,
    { totalOrders: number; totalPurchaseAmount: number }
  >();
  for (const order of orders ?? []) {
    const customerId = order.customer_id as string;
    const existing = aggregates.get(customerId) ?? {
      totalOrders: 0,
      totalPurchaseAmount: 0,
    };
    existing.totalOrders += 1;
    existing.totalPurchaseAmount += Number(order.total);
    aggregates.set(customerId, existing);
  }

  const result: CustomerWithAggregates[] = (customers ?? []).map((row) => {
    const customer = mapCustomer(row);
    const agg = aggregates.get(customer.id) ?? {
      totalOrders: 0,
      totalPurchaseAmount: 0,
    };
    return { ...customer, ...agg };
  });

  return { success: true, data: result };
}

export async function getCustomerById(
  id: string
): Promise<ServiceResult<Customer | null>> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return { success: true, data: null };
    }
    return { success: false, error: error.message, code: 'QUERY_ERROR' };
  }

  return { success: true, data: mapCustomer(data) };
}
