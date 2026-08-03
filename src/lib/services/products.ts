import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Product, ProductStatus } from '@/lib/types';
import { ServiceResult } from '@/lib/types/service';

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  status?: ProductStatus;
  sortBy?: 'price_asc' | 'price_desc' | 'newest';
  activeOnly?: boolean;
  page?: number;
  pageSize?: number;
}

export interface PaginatedProducts {
  products: Product[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyProductFilters(query: any, filters?: ProductFilters) {
  let q = query;

  if (filters?.search) {
    q = q.ilike('name', `%${filters.search}%`);
  }
  if (filters?.categoryId) {
    q = q.eq('category_id', filters.categoryId);
  }
  if (filters?.status) {
    q = q.eq('status', filters.status);
  }
  if (filters?.activeOnly) {
    q = q.eq('status', 'Active');
  }
  if (filters?.sortBy === 'price_asc') {
    q = q.order('price', { ascending: true });
  } else if (filters?.sortBy === 'price_desc') {
    q = q.order('price', { ascending: false });
  } else {
    q = q.order('created_at', { ascending: false });
  }

  return q;
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
  query = applyProductFilters(query, filters);

  const { data, error } = await query;

  if (error) {
    return { success: false, error: error.message, code: 'QUERY_ERROR' };
  }

  return { success: true, data: (data ?? []).map(mapProduct) };
}

export async function getProductsPaginated(
  filters?: ProductFilters
): Promise<ServiceResult<PaginatedProducts>> {
  const supabase = await createServerSupabaseClient();
  const page = Math.max(1, filters?.page ?? 1);
  const pageSize = filters?.pageSize ?? 9;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('products')
    .select('*, categories(*)', { count: 'exact' });
  query = applyProductFilters(query, filters);

  const { data, error, count } = await query.range(from, to);

  if (error) {
    return { success: false, error: error.message, code: 'QUERY_ERROR' };
  }

  const totalCount = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return {
    success: true,
    data: {
      products: (data ?? []).map(mapProduct),
      totalCount,
      page,
      pageSize,
      totalPages,
    },
  };
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
