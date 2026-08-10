import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Category } from '@/lib/types';
import { ServiceResult } from '@/lib/types/service';

function mapCategory(row: Record<string, unknown>): Category {
  return {
    id: row.id as string,
    name: row.name as string,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

export async function getCategories(): Promise<ServiceResult<Category[]>> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    return { success: false, error: error.message, code: 'QUERY_ERROR' };
  }

  return { success: true, data: (data ?? []).map(mapCategory) };
}

export interface CategoryWithCount extends Category {
  productCount: number;
}

export async function getCategoriesWithCounts(): Promise<
  ServiceResult<CategoryWithCount[]>
> {
  const supabase = await createServerSupabaseClient();

  const [categoriesResult, productsResult] = await Promise.all([
    supabase.from('categories').select('*').order('name', { ascending: true }),
    supabase
      .from('products')
      .select('category_id')
      .eq('status', 'Active'),
  ]);

  if (categoriesResult.error) {
    return {
      success: false,
      error: categoriesResult.error.message,
      code: 'QUERY_ERROR',
    };
  }

  if (productsResult.error) {
    return {
      success: false,
      error: productsResult.error.message,
      code: 'QUERY_ERROR',
    };
  }

  const countMap = new Map<string, number>();
  let totalActive = 0;

  for (const row of productsResult.data ?? []) {
    totalActive++;
    const categoryId = row.category_id as string | null;
    if (categoryId) {
      countMap.set(categoryId, (countMap.get(categoryId) ?? 0) + 1);
    }
  }

  const categories = (categoriesResult.data ?? []).map((row) => ({
    ...mapCategory(row),
    productCount: countMap.get(row.id as string) ?? 0,
  }));

  return {
    success: true,
    data: [
      {
        id: 'all',
        name: 'All Product',
        productCount: totalActive,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      ...categories,
    ],
  };
}

export async function createCategory(
  name: string
): Promise<ServiceResult<Category>> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('categories')
    .insert({ name })
    .select('*')
    .single();

  if (error) {
    return { success: false, error: error.message, code: 'INSERT_ERROR' };
  }

  revalidatePath('/admin/categories');
  revalidatePath('/products');
  revalidatePath('/');

  return { success: true, data: mapCategory(data) };
}

export async function updateCategory(
  id: string,
  name: string
): Promise<ServiceResult<Category>> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('categories')
    .update({ name, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    return { success: false, error: error.message, code: 'UPDATE_ERROR' };
  }

  revalidatePath('/admin/categories');
  revalidatePath('/products');
  revalidatePath('/');

  return { success: true, data: mapCategory(data) };
}

export async function categoryHasProducts(
  id: string
): Promise<ServiceResult<boolean>> {
  const supabase = await createServerSupabaseClient();

  const { count, error } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', id);

  if (error) {
    return { success: false, error: error.message, code: 'QUERY_ERROR' };
  }

  return { success: true, data: (count ?? 0) > 0 };
}

export async function deleteCategory(
  id: string
): Promise<ServiceResult<void>> {
  // Check if category has products first
  const hasProducts = await categoryHasProducts(id);
  if (!hasProducts.success) {
    return { success: false, error: hasProducts.error, code: hasProducts.code };
  }
  if (hasProducts.data) {
    return {
      success: false,
      error: 'Cannot delete category with assigned products',
      code: 'CATEGORY_HAS_PRODUCTS',
    };
  }

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from('categories').delete().eq('id', id);

  if (error) {
    return { success: false, error: error.message, code: 'DELETE_ERROR' };
  }

  revalidatePath('/admin/categories');
  revalidatePath('/products');
  revalidatePath('/');

  return { success: true, data: undefined };
}
