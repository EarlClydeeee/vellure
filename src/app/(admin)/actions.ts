'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { isAdminAuthenticated } from '@/lib/auth/admin';
import { createProduct, updateProduct, deleteProduct } from '@/lib/services/products';
import { createCategory, updateCategory, deleteCategory } from '@/lib/services/categories';
import { updateOrderStatus } from '@/lib/services/orders';
import { ProductFormData } from '@/lib/validation/schemas';
import { OrderStatus } from '@/lib/types';

async function requireAdmin() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect('/admin/login');
  }
}

export async function createProductAction(formData: ProductFormData) {
  await requireAdmin();

  const result = await createProduct({
    name: formData.name,
    description: formData.description || undefined,
    price: formData.price,
    stockQuantity: formData.stockQuantity,
    imageUrl: formData.imageUrl || undefined,
    categoryId: formData.categoryId || undefined,
    status: formData.status,
  });

  if (result.success) {
    revalidatePath('/admin/products');
    revalidatePath('/admin/dashboard');
    revalidatePath('/products');
    revalidatePath('/');
  }

  return result;
}

export async function updateProductAction(id: string, formData: ProductFormData) {
  await requireAdmin();

  const result = await updateProduct(id, {
    name: formData.name,
    description: formData.description || undefined,
    price: formData.price,
    stockQuantity: formData.stockQuantity,
    imageUrl: formData.imageUrl || undefined,
    categoryId: formData.categoryId || undefined,
    status: formData.status,
  });

  if (result.success) {
    revalidatePath('/admin/products');
    revalidatePath('/admin/dashboard');
    revalidatePath('/products');
    revalidatePath(`/products/${id}`);
    revalidatePath('/');
  }

  return result;
}

export async function deleteProductAction(id: string) {
  await requireAdmin();

  const result = await deleteProduct(id);

  if (result.success) {
    revalidatePath('/admin/products');
    revalidatePath('/admin/dashboard');
    revalidatePath('/products');
    revalidatePath('/');
  }

  return result;
}

export async function createCategoryAction(name: string) {
  await requireAdmin();

  const result = await createCategory(name);

  if (result.success) {
    revalidatePath('/admin/categories');
    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');
  }

  return result;
}

export async function updateCategoryAction(id: string, name: string) {
  await requireAdmin();

  const result = await updateCategory(id, name);

  if (result.success) {
    revalidatePath('/admin/categories');
    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');
  }

  return result;
}

export async function deleteCategoryAction(id: string) {
  await requireAdmin();

  const result = await deleteCategory(id);

  if (result.success) {
    revalidatePath('/admin/categories');
    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');
  }

  return result;
}

export async function updateOrderStatusAction(id: string, status: OrderStatus) {
  await requireAdmin();

  const result = await updateOrderStatus(id, status);

  if (result.success) {
    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${id}`);
    revalidatePath('/admin/dashboard');
    revalidatePath('/orders');
  }

  return result;
}
