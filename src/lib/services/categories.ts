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
