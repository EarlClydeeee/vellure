import { ShopSidebarSkeleton } from '@/components/store/skeletons/ShopSidebarSkeleton';
import { ProductGridSkeleton } from '@/components/store/skeletons/ProductGridSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductsLoading() {
  return (
    <div>
      <div className="container mx-auto px-4 pb-8 pt-8 md:pt-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Skeleton className="h-9 w-24" />
            <Skeleton className="mt-2 h-4 w-36" />
          </div>
          <Skeleton className="h-11 w-full rounded-full sm:max-w-md" />
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <ShopSidebarSkeleton />
          <div className="min-w-0 flex-1 space-y-8">
            <ProductGridSkeleton count={9} />
            <div className="flex justify-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-9 rounded-full" />
              ))}
            </div>
            <div className="space-y-4 pt-4">
              <Skeleton className="h-7 w-64" />
              <div className="flex gap-4 overflow-hidden">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 w-48 shrink-0 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
