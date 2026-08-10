import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ProductReview, ReviewStatus } from '@/lib/types';
import { ServiceResult } from '@/lib/types/service';

function mapReview(row: Record<string, unknown>): ProductReview {
  const customer = row.customers as Record<string, unknown> | null;
  return {
    id: row.id as string,
    productId: row.product_id as string,
    customerId: row.customer_id as string,
    orderId: (row.order_id as string) ?? null,
    rating: row.rating as number,
    title: (row.title as string) ?? null,
    body: row.body as string,
    status: row.status as ReviewStatus,
    customerName: customer ? (customer.full_name as string) ?? 'Customer' : undefined,
    createdAt: new Date(row.created_at as string),
  };
}

export async function getProductReviews(
  productId: string
): Promise<ServiceResult<ProductReview[]>> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('product_reviews')
    .select('*, customers(full_name)')
    .eq('product_id', productId)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    return { success: false, error: error.message, code: 'QUERY_ERROR' };
  }

  return { success: true, data: (data ?? []).map(mapReview) };
}

export async function getProductRatingSummary(
  productId: string
): Promise<ServiceResult<{ averageRating: number; reviewCount: number }>> {
  const result = await getProductReviews(productId);
  if (!result.success) return result;

  const reviews = result.data;
  if (reviews.length === 0) {
    return { success: true, data: { averageRating: 0, reviewCount: 0 } };
  }

  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return {
    success: true,
    data: {
      averageRating: Math.round((sum / reviews.length) * 10) / 10,
      reviewCount: reviews.length,
    },
  };
}

export async function createReview(input: {
  productId: string;
  customerId: string;
  orderId?: string;
  rating: number;
  title?: string;
  body: string;
}): Promise<ServiceResult<ProductReview>> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('product_reviews')
    .insert({
      product_id: input.productId,
      customer_id: input.customerId,
      order_id: input.orderId ?? null,
      rating: input.rating,
      title: input.title ?? null,
      body: input.body,
      status: 'published',
    })
    .select('*, customers(full_name)')
    .single();

  if (error) {
    return { success: false, error: error.message, code: 'INSERT_ERROR' };
  }

  revalidatePath(`/products/${input.productId}`);
  revalidatePath('/products');

  return { success: true, data: mapReview(data) };
}
