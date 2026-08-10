import { Product } from '@/lib/types';
import { ProductGrid } from '@/components/store/ProductGrid';
import { NavLink } from '@/components/store/NavLink';

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="px-4 py-12">
      <div className="container mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-display text-2xl font-medium tracking-tight sm:text-3xl">
            Featured Products
          </h2>
          <NavLink
            href="/products"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            View all
          </NavLink>
        </div>
        <ProductGrid products={products} columns={4} />
      </div>
    </section>
  );
}
