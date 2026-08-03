import { ProductCardSkeleton } from '@/components/store/skeletons/ProductCardSkeleton';

interface ProductGridSkeletonProps {
  count?: number;
}

export function ProductGridSkeleton({ count = 9 }: ProductGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
