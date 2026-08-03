import { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getProducts, ProductFilters } from '@/lib/services/products';
import { getCategories } from '@/lib/services/categories';
import { ProductTable } from '@/components/admin/ProductTable';
import { ProductFilters as ProductFiltersComponent } from '@/components/admin/ProductFilters';
import { ProductStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Products - Vellure Admin',
};

interface Props {
  searchParams: Promise<{
    search?: string;
    category?: string;
    status?: string;
  }>;
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const params = await searchParams;

  const filters: ProductFilters = {};
  if (params.search) filters.search = params.search;
  if (params.category && params.category !== 'all') filters.categoryId = params.category;
  if (params.status && params.status !== 'all') filters.status = params.status as ProductStatus;

  const [productsResult, categoriesResult] = await Promise.all([
    getProducts(filters),
    getCategories(),
  ]);

  const products = productsResult.success ? productsResult.data : [];
  const categories = categoriesResult.success ? categoriesResult.data : [];

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        <ProductFiltersComponent categories={categories} />
        <ProductTable products={products} />
      </div>
    </div>
  );
}
