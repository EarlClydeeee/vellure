import { Suspense } from 'react';
import { getProducts, ProductFilters } from '@/lib/services/products';
import { getCategories } from '@/lib/services/categories';
import { SearchBar } from '@/components/store/SearchBar';
import { CategoryFilter } from '@/components/store/CategoryFilter';
import { PriceSortSelect } from '@/components/store/PriceSortSelect';
import { ProductGrid } from '@/components/store/ProductGrid';

export const dynamic = 'force-dynamic';

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sort?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  const filters: ProductFilters = {
    search: params.search,
    categoryId: params.category,
    sortBy: params.sort as ProductFilters['sortBy'],
    activeOnly: true,
  };

  const [productsResult, categoriesResult] = await Promise.all([
    getProducts(filters),
    getCategories(),
  ]);

  const products = productsResult.success ? productsResult.data : [];
  const categories = categoriesResult.success ? categoriesResult.data : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Products</h1>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Suspense fallback={null}>
          <SearchBar />
        </Suspense>
        <div className="flex gap-2">
          <Suspense fallback={null}>
            <CategoryFilter categories={categories} selected={params.category} />
          </Suspense>
          <Suspense fallback={null}>
            <PriceSortSelect />
          </Suspense>
        </div>
      </div>

      <ProductGrid products={products} />
    </div>
  );
}
