import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/services/products';
import { getCategories } from '@/lib/services/categories';
import { ProductForm } from '@/components/admin/ProductForm';

export const metadata: Metadata = {
  title: 'Edit Product - Vellure Admin',
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  const [productResult, categoriesResult] = await Promise.all([
    getProductById(id),
    getCategories(),
  ]);

  if (!productResult.success || !productResult.data) {
    notFound();
  }

  const categories = categoriesResult.success ? categoriesResult.data : [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      <ProductForm categories={categories} product={productResult.data} />
    </div>
  );
}
