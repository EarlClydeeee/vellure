import { Suspense } from 'react';
import {
  getProductsPaginated,
  getProducts,
  ProductFilters,
} from '@/lib/services/products';
import { getCategoriesWithCounts } from '@/lib/services/categories';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ShopHero } from '@/components/store/ShopHero';
import { ShopSidebar } from '@/components/store/ShopSidebar';
import { ProductGrid } from '@/components/store/ProductGrid';
import { Pagination } from '@/components/store/Pagination';
import { RecommendationsCarousel } from '@/components/store/RecommendationsCarousel';
import { StoreSetupAlert } from '@/components/store/StoreSetupAlert';
import { PriceSortSelect } from '@/components/store/PriceSortSelect';
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

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
    !paginatedResult.success
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
      <ShopHero title="Shop" tagline="Give All You Need" showSearch />

      <div className="container mx-auto px-4 pb-8 pt-20 md:pt-24">
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
