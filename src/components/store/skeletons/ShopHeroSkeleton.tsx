import { Skeleton } from '@/components/ui/skeleton';

export function ShopHeroSkeleton() {
  return (
    <div className="relative pb-16 md:pb-20">
      <Skeleton className="h-[320px] w-full rounded-none sm:h-[380px] md:h-[420px]" />
      <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col gap-4 rounded-2xl border bg-white p-6 shadow-lg md:flex-row md:items-center md:justify-between">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-11 w-full max-w-md rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
