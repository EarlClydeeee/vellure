import { HeroBanner } from '@/components/store/HeroBanner';
import { CategoryCards } from '@/components/store/CategoryCards';
import { FeaturedProducts } from '@/components/store/FeaturedProducts';
import { getProducts } from '@/lib/services/products';
import { getCategories } from '@/lib/services/categories';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [categoriesResult, productsResult] = await Promise.all([
    getCategories(),
    getProducts({ activeOnly: true }),
  ]);

  const categories = categoriesResult.success ? categoriesResult.data : [];
  const products = productsResult.success
    ? productsResult.data.slice(0, 8)
    : [];

  return (
    <div className="flex flex-col">
      <HeroBanner />
      <CategoryCards categories={categories} />
      <FeaturedProducts products={products} />
    </div>
  );
}
