import { ShopHeroSkeleton } from '@/components/store/skeletons/ShopHeroSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function StoreLoading() {
  return (
    <div className="flex flex-col">
      <ShopHeroSkeleton />

      <div className="border-b px-4 py-8">
        <div className="container mx-auto flex justify-center gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="h-16 w-16 rounded-full md:h-20 md:w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </div>

      <div className="border-y bg-gray-50 py-6">
        <div className="container mx-auto flex justify-center gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-12 rounded-full" />
          ))}
        </div>
      </div>

      <div className="bg-[#0057B8] py-14">
        <div className="container mx-auto px-4">
          <Skeleton className="mb-8 h-10 w-64 bg-white/20" />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-64 shrink-0 rounded-lg bg-white/20" />
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-12">
        <Skeleton className="mb-8 h-8 w-48" />
        <Skeleton className="h-[450px] w-full rounded-3xl" />
      </div>

      <div className="px-4 py-12">
        <Skeleton className="mb-8 h-8 w-56" />
        <Skeleton className="h-[600px] w-full" />
      </div>

      <div className="py-12">
        <Skeleton className="mx-auto mb-8 h-8 w-72" />
        <div className="flex gap-4 overflow-hidden px-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-80 shrink-0 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
