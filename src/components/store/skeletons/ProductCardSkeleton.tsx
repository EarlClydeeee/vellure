import { Skeleton } from '@/components/ui/skeleton';

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-card">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="space-y-2 p-2 sm:space-y-3 sm:p-4">
        <Skeleton className="h-3 w-full sm:h-4" />
        <Skeleton className="hidden h-3 w-1/2 sm:block" />
        <Skeleton className="h-4 w-1/3 sm:h-5" />
        <div className="hidden gap-2 pt-1 sm:flex">
          <Skeleton className="h-9 flex-1 rounded-full" />
          <Skeleton className="h-9 flex-1 rounded-full" />
        </div>
      </div>
    </div>
  );
}
