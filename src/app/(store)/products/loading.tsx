import { ShopHeroSkeleton } from '@/components/store/skeletons/ShopHeroSkeleton';
import { ShopSidebarSkeleton } from '@/components/store/skeletons/ShopSidebarSkeleton';
import { ProductGridSkeleton } from '@/components/store/skeletons/ProductGridSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductsLoading() {
  return (
    <div>
      <ShopHeroSkeleton />
      <div className="container mx-auto px-4 pb-8 pt-20 md:pt-24">
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
