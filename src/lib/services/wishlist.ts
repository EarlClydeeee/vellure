import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { WishlistItem, ProductStatus } from '@/lib/types';
import { ServiceResult } from '@/lib/types/service';

function mapWishlistItem(row: Record<string, unknown>): WishlistItem {
  const product = row.products as Record<string, unknown> | null;
  return {
    id: row.id as string,
    customerId: row.customer_id as string,
    productId: row.product_id as string,
    product: product
      ? {
          id: product.id as string,
          name: product.name as string,
          description: (product.description as string) ?? null,
          price: Number(product.price),
          compareAtPrice:
            product.compare_at_price != null ? Number(product.compare_at_price) : null,
          specs: (product.specs as Record<string, string>) ?? {},
          stockQuantity: product.stock_quantity as number,
          salesCount: (product.sales_count as number) ?? 0,
          imageUrl: (product.image_url as string) ?? null,
          categoryId: (product.category_id as string) ?? null,
          status: product.status as ProductStatus,
          createdAt: new Date(product.created_at as string),
          updatedAt: new Date(product.updated_at as string),
        }
      : undefined,
    createdAt: new Date(row.created_at as string),
  };
}

export async function getWishlistItems(
  customerId: string
): Promise<ServiceResult<WishlistItem[]>> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('wishlist_items')
    .select('*, products(*)')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (error) {
    return { success: false, error: error.message, code: 'QUERY_ERROR' };
  }

  return { success: true, data: (data ?? []).map(mapWishlistItem) };
}

export async function toggleWishlist(
  customerId: string,
  productId: string
): Promise<ServiceResult<{ added: boolean }>> {
  const supabase = await createServerSupabaseClient();

  const { data: existing } = await supabase
    .from('wishlist_items')
    .select('id')
    .eq('customer_id', customerId)
    .eq('product_id', productId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('id', existing.id);

    if (error) {
      return { success: false, error: error.message, code: 'DELETE_ERROR' };
    }

    revalidatePath('/account/wishlist');
    return { success: true, data: { added: false } };
  }

  const { error } = await supabase.from('wishlist_items').insert({
    customer_id: customerId,
    product_id: productId,
  });

  if (error) {
    return { success: false, error: error.message, code: 'INSERT_ERROR' };
  }

  revalidatePath('/account/wishlist');
  return { success: true, data: { added: true } };
}

export async function isInWishlist(
  customerId: string,
  productId: string
): Promise<boolean> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('wishlist_items')
    .select('id')
    .eq('customer_id', customerId)
    .eq('product_id', productId)
    .maybeSingle();

  return !!data;
}
