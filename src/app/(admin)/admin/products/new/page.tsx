import { Metadata } from 'next';
import { getCategories } from '@/lib/services/categories';
import { ProductForm } from '@/components/admin/ProductForm';

export const metadata: Metadata = {
  title: 'New Product - Vellure Admin',
};

export default async function NewProductPage() {
  const categoriesResult = await getCategories();
  const categories = categoriesResult.success ? categoriesResult.data : [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">New Product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
