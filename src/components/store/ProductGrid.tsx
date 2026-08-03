import { Package } from 'lucide-react';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/store/ProductCard';
import { EmptyState } from '@/components/shared/EmptyState';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        title="No products found"
        description="Try adjusting your search or filter criteria."
        icon={<Package className="h-12 w-12" />}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
