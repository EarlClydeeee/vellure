import { Package } from 'lucide-react';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/store/ProductCard';
import { EmptyState } from '@/components/shared/EmptyState';

interface ProductGridProps {
  products: Product[];
  columns?: 3 | 4;
  isLoggedIn?: boolean;
}

export function ProductGrid({ products, columns = 4, isLoggedIn = false }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        title="No products found"
        description="Try adjusting your search or filter criteria."
        icon={<Package className="h-12 w-12" />}
      />
    );
  }

  const gridClass =
    columns === 3
      ? 'grid grid-cols-2 gap-2 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4';

  return (
    <div className={gridClass}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} isLoggedIn={isLoggedIn} />
      ))}
    </div>
  );
}
