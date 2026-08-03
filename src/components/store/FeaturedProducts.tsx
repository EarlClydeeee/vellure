import { Product } from '@/lib/types';
import { ProductCard } from '@/components/store/ProductCard';

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="px-4 py-12">
      <div className="container mx-auto">
        <h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
