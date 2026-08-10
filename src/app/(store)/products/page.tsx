import { Suspense } from 'react';
import {
  getProductsPaginated,
  getProducts,
  ProductFilters,
} from '@/lib/services/products';
import { getCategoriesWithCounts } from '@/lib/services/categories';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { ShopSidebar } from '@/components/store/ShopSidebar';
import { ProductGrid } from '@/components/store/ProductGrid';
import { Pagination } from '@/components/store/Pagination';
import { RecommendationsCarousel } from '@/components/store/RecommendationsCarousel';
import { StoreSetupAlert } from '@/components/store/StoreSetupAlert';
import { PriceSortSelect } from '@/components/store/PriceSortSelect';
import { SearchBar } from '@/components/store/SearchBar';
import { ShopSidebarSkeleton } from '@/components/store/skeletons/ShopSidebarSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 9;

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sort?: string;
    filter?: string;
    page?: string;
  }>;
}

function resolveSort(
  sort?: string,
  filter?: string
): ProductFilters['sortBy'] {
  if (sort === 'price_asc' || sort === 'price_desc') return sort;
  if (filter === 'bestseller') return 'bestseller';
  return 'newest';
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1);

  let user = null;
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    ({
      data: { user },
    } = await supabase.auth.getUser());
  }

  const filters: ProductFilters = {
    search: params.search,
    categoryId: params.category,
    sortBy: resolveSort(params.sort, params.filter),
    filter: params.filter === 'discount' || params.filter === 'bestseller'
      ? params.filter
      : undefined,
    activeOnly: true,
    page,
    pageSize: PAGE_SIZE,
  };

  const [paginatedResult, categoriesResult, recommendationsResult] =
    await Promise.all([
      getProductsPaginated(filters),
      getCategoriesWithCounts(),
      getProducts({ activeOnly: true }),
    ]);

  const dbError =
    !isSupabaseConfigured()
      ? 'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart the dev server.'
      : !paginatedResult.success
      ? paginatedResult.error
      : !categoriesResult.success
        ? categoriesResult.error
        : undefined;

  const paginated = paginatedResult.success
    ? paginatedResult.data
    : { products: [], totalCount: 0, page: 1, pageSize: PAGE_SIZE, totalPages: 1 };
  const categories = categoriesResult.success ? categoriesResult.data : [];
  const recommendations = recommendationsResult.success
    ? recommendationsResult.data.slice(0, 8)
    : [];

  const showEmptySetup =
    !dbError &&
    paginated.products.length === 0 &&
    !params.search &&
    !params.category;

  return (
    <div>
      <div className="container mx-auto px-2 pb-8 pt-6 sm:px-4 md:pt-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-medium text-vellure-text md:text-4xl">
              Shop
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Give All You Need</p>
          </div>
          <SearchBar className="w-full sm:max-w-md" />
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <Suspense fallback={<ShopSidebarSkeleton />}>
            <ShopSidebar
              categories={categories}
              selectedCategory={params.category}
              selectedFilter={params.filter}
            />
          </Suspense>

          <div className="min-w-0 flex-1 space-y-8">
            <div className="flex justify-end">
              <Suspense fallback={<Skeleton className="h-9 w-40" />}>
                <PriceSortSelect />
              </Suspense>
            </div>

            <StoreSetupAlert error={dbError} empty={showEmptySetup} />

            {!dbError && (
              <>
                <ProductGrid
                  products={paginated.products}
                  columns={3}
                  isLoggedIn={!!user}
                />

                <Suspense fallback={<Skeleton className="mx-auto h-9 w-64" />}>
                  <Pagination
                    currentPage={paginated.page}
                    totalPages={paginated.totalPages}
                  />
                </Suspense>

                <RecommendationsCarousel products={recommendations} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
