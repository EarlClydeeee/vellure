import { Skeleton } from '@/components/ui/skeleton';

export function ShopSidebarSkeleton() {
  return (
    <aside className="w-full shrink-0 space-y-6 lg:w-60">
      <div className="space-y-3">
        <Skeleton className="h-5 w-24" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-5 w-8 rounded-full" />
          </div>
        ))}
      </div>
      <div className="space-y-3 border-t pt-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-24" />
        ))}
      </div>
    </aside>
  );
}
