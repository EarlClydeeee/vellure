import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Product, ProductImage, ProductStatus } from '@/lib/types';
import { ServiceResult } from '@/lib/types/service';

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  status?: ProductStatus;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'bestseller';
  filter?: 'discount' | 'bestseller';
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

export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  compareAtPrice?: number | null;
  specs?: Record<string, string>;
  stockQuantity: number;
  imageUrl?: string;
  imageUrls?: string[];
  categoryId?: string;
  status: ProductStatus;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}

function mapProductImage(row: Record<string, unknown>): ProductImage {
  return {
    id: row.id as string,
    productId: row.product_id as string,
    url: row.url as string,
    sortOrder: row.sort_order as number,
  };
}

function mapProduct(row: Record<string, unknown>): Product {
  const imagesRaw = row.product_images as Record<string, unknown>[] | null;
  const images = imagesRaw?.map(mapProductImage).sort((a, b) => a.sortOrder - b.sortOrder);
  const specsRaw = row.specs as Record<string, string> | null;

  return {
    id: row.id as string,
    name: row.name as string,
    description: (row.description as string) ?? null,
    price: Number(row.price),
    compareAtPrice: row.compare_at_price != null ? Number(row.compare_at_price) : null,
    specs: specsRaw ?? {},
    stockQuantity: row.stock_quantity as number,
    salesCount: (row.sales_count as number) ?? 0,
    imageUrl: (row.image_url as string) ?? null,
    images,
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
    averageRating: row.average_rating != null ? Number(row.average_rating) : undefined,
    reviewCount: row.review_count != null ? Number(row.review_count) : undefined,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyProductFilters(query: any, filters?: ProductFilters) {
  let q = query;

  if (filters?.search) {
    const term = filters.search.replace(/%/g, '');
    q = q.or(`name.ilike.%${term}%,description.ilike.%${term}%`);
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
  if (filters?.filter === 'discount' || filters?.sortBy === 'price_desc') {
    // discount filter handled post-query if compare_at_price column missing; try filter
  }
  if (filters?.filter === 'discount') {
    q = q.not('compare_at_price', 'is', null).gt('compare_at_price', 0);
  }

  const sortBy = filters?.sortBy ?? (filters?.filter === 'bestseller' ? 'bestseller' : 'newest');

  if (sortBy === 'price_asc') {
    q = q.order('price', { ascending: true });
  } else if (sortBy === 'price_desc') {
    q = q.order('price', { ascending: false });
  } else if (sortBy === 'bestseller') {
    q = q.order('sales_count', { ascending: false });
  } else {
    q = q.order('created_at', { ascending: false });
  }

  return q;
}

const PRODUCT_SELECT = '*, categories(*), product_images(*)';

async function syncProductImages(productId: string, imageUrls: string[]) {
  const supabase = await createServerSupabaseClient();
  await supabase.from('product_images').delete().eq('product_id', productId);
  if (imageUrls.length === 0) return;

  await supabase.from('product_images').insert(
    imageUrls.map((url, index) => ({
      product_id: productId,
      url,
      sort_order: index,
    }))
  );
}

export async function getProducts(
  filters?: ProductFilters
): Promise<ServiceResult<Product[]>> {
  const supabase = await createServerSupabaseClient();

  let query = supabase.from('products').select(PRODUCT_SELECT);
  query = applyProductFilters(query, filters);

  const { data, error } = await query;

  if (error) {
    return { success: false, error: error.message, code: 'QUERY_ERROR' };
  }

  let products = (data ?? []).map(mapProduct);
  if (filters?.filter === 'discount') {
    products = products.filter(
      (p) => p.compareAtPrice != null && p.compareAtPrice > p.price
    );
  }

  return { success: true, data: products };
}

export async function getProductsPaginated(
  filters?: ProductFilters
): Promise<ServiceResult<PaginatedProducts>> {
  const supabase = await createServerSupabaseClient();
  const page = Math.max(1, filters?.page ?? 1);
  const pageSize = filters?.pageSize ?? 9;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from('products').select(PRODUCT_SELECT, { count: 'exact' });
  query = applyProductFilters(query, filters);

  const { data, error, count } = await query.range(from, to);

  if (error) {
    return { success: false, error: error.message, code: 'QUERY_ERROR' };
  }

  let products = (data ?? []).map(mapProduct);
  if (filters?.filter === 'discount') {
    products = products.filter(
      (p) => p.compareAtPrice != null && p.compareAtPrice > p.price
    );
  }

  const totalCount = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return {
    success: true,
    data: { products, totalCount, page, pageSize, totalPages },
  };
}

export async function getProductById(
  id: string
): Promise<ServiceResult<Product | null>> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
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

export async function getProductsByIds(
  ids: string[]
): Promise<ServiceResult<Product[]>> {
  if (ids.length === 0) return { success: true, data: [] };

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .in('id', ids);

  if (error) {
    return { success: false, error: error.message, code: 'QUERY_ERROR' };
  }

  return { success: true, data: (data ?? []).map(mapProduct) };
}

export async function getProductsByCategory(
  categoryId: string
): Promise<ServiceResult<Product[]>> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
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
      compare_at_price: input.compareAtPrice ?? null,
      specs: input.specs ?? {},
      stock_quantity: input.stockQuantity,
      image_url: input.imageUrl ?? null,
      category_id: input.categoryId ?? null,
      status: input.status,
    })
    .select(PRODUCT_SELECT)
    .single();

  if (error) {
    return { success: false, error: error.message, code: 'INSERT_ERROR' };
  }

  if (input.imageUrls?.length) {
    await syncProductImages(data.id as string, input.imageUrls);
  }

  revalidatePath('/products');
  revalidatePath('/');

  const refreshed = await getProductById(data.id as string);
  return refreshed.success && refreshed.data
    ? { success: true, data: refreshed.data }
    : { success: true, data: mapProduct(data) };
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
  if (input.compareAtPrice !== undefined)
    updateData.compare_at_price = input.compareAtPrice ?? null;
  if (input.specs !== undefined) updateData.specs = input.specs;
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
    .select(PRODUCT_SELECT)
    .single();

  if (error) {
    return { success: false, error: error.message, code: 'UPDATE_ERROR' };
  }

  if (input.imageUrls !== undefined) {
    await syncProductImages(id, input.imageUrls);
  }

  revalidatePath('/products');
  revalidatePath(`/products/${id}`);
  revalidatePath('/');

  const refreshed = await getProductById(id);
  return refreshed.success && refreshed.data
    ? { success: true, data: refreshed.data }
    : { success: true, data: mapProduct(data) };
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
