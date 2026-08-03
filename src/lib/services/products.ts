import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Product, ProductStatus } from '@/lib/types';
import { ServiceResult } from '@/lib/types/service';

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  status?: ProductStatus;
  sortBy?: 'price_asc' | 'price_desc';
  activeOnly?: boolean;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  categoryId?: string;
  status: ProductStatus;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}

function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    description: (row.description as string) ?? null,
    price: Number(row.price),
    stockQuantity: row.stock_quantity as number,
    imageUrl: (row.image_url as string) ?? null,
    categoryId: (row.category_id as string) ?? null,
    category: row.categories
      ? {
          id: (row.categories as Record<string, unknown>).id as string,
          name: (row.categories as Record<string, unknown>).name as string,
          createdAt: new Date(
            (row.categories as Record<string, unknown>).created_at as string
          ),
          updatedAt: new Date(
            (row.categories as Record<string, unknown>).updated_at as string
          ),
        }
      : undefined,
    status: row.status as ProductStatus,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

export async function getProducts(
  filters?: ProductFilters
): Promise<ServiceResult<Product[]>> {
  const supabase = await createServerSupabaseClient();

  let query = supabase.from('products').select('*, categories(*)');

  if (filters?.search) {
    query = query.ilike('name', `%${filters.search}%`);
  }
  if (filters?.categoryId) {
    query = query.eq('category_id', filters.categoryId);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.activeOnly) {
    query = query.eq('status', 'Active');
  }
  if (filters?.sortBy === 'price_asc') {
    query = query.order('price', { ascending: true });
  } else if (filters?.sortBy === 'price_desc') {
    query = query.order('price', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    return { success: false, error: error.message, code: 'QUERY_ERROR' };
  }

  return { success: true, data: (data ?? []).map(mapProduct) };
}

export async function getProductById(
  id: string
): Promise<ServiceResult<Product | null>> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return { success: true, data: null };
    }
    return { success: false, error: error.message, code: 'QUERY_ERROR' };
  }

  return { success: true, data: mapProduct(data) };
}

export async function getProductsByCategory(
  categoryId: string
): Promise<ServiceResult<Product[]>> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('category_id', categoryId)
    .eq('status', 'Active')
    .order('created_at', { ascending: false });

  if (error) {
    return { success: false, error: error.message, code: 'QUERY_ERROR' };
  }

  return { success: true, data: (data ?? []).map(mapProduct) };
}

export async function createProduct(
  input: CreateProductInput
): Promise<ServiceResult<Product>> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('products')
    .insert({
      name: input.name,
      description: input.description ?? null,
      price: input.price,
      stock_quantity: input.stockQuantity,
      image_url: input.imageUrl ?? null,
      category_id: input.categoryId ?? null,
      status: input.status,
    })
    .select('*, categories(*)')
    .single();

  if (error) {
    return { success: false, error: error.message, code: 'INSERT_ERROR' };
  }

  revalidatePath('/products');
  revalidatePath('/');

  return { success: true, data: mapProduct(data) };
}

export async function updateProduct(
  id: string,
  input: UpdateProductInput
): Promise<ServiceResult<Product>> {
  const supabase = await createServerSupabaseClient();

  const updateData: Record<string, unknown> = {};
  if (input.name !== undefined) updateData.name = input.name;
  if (input.description !== undefined)
    updateData.description = input.description ?? null;
  if (input.price !== undefined) updateData.price = input.price;
  if (input.stockQuantity !== undefined)
    updateData.stock_quantity = input.stockQuantity;
  if (input.imageUrl !== undefined)
    updateData.image_url = input.imageUrl ?? null;
  if (input.categoryId !== undefined)
    updateData.category_id = input.categoryId ?? null;
  if (input.status !== undefined) updateData.status = input.status;

  const { data, error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', id)
    .select('*, categories(*)')
    .single();

  if (error) {
    return { success: false, error: error.message, code: 'UPDATE_ERROR' };
  }

  revalidatePath('/products');
  revalidatePath('/');

  return { success: true, data: mapProduct(data) };
}

export async function deleteProduct(
  id: string
): Promise<ServiceResult<void>> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) {
    return { success: false, error: error.message, code: 'DELETE_ERROR' };
  }

  revalidatePath('/products');
  revalidatePath('/');

  return { success: true, data: undefined };
}
