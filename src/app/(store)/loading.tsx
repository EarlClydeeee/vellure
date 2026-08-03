import { Skeleton } from '@/components/ui/skeleton';

export default function StoreLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="mb-8 h-10 w-48" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}
