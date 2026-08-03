import { ShopHero } from '@/components/store/ShopHero';
import { CategoryCards } from '@/components/store/CategoryCards';
import { FeaturedProducts } from '@/components/store/FeaturedProducts';
import { getProducts } from '@/lib/services/products';
import { getCategoriesWithCounts } from '@/lib/services/categories';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [categoriesResult, productsResult] = await Promise.all([
    getCategoriesWithCounts(),
    getProducts({ activeOnly: true }),
  ]);

  const categories = categoriesResult.success
    ? categoriesResult.data.filter((c) => c.id !== 'all')
    : [];
  const products = productsResult.success
    ? productsResult.data.slice(0, 8)
    : [];

  return (
    <div className="flex flex-col">
      <ShopHero title="Branda" tagline="Give All You Need" showSearch />
      <div className="pt-16 md:pt-20">
        <CategoryCards categories={categories} />
      </div>
      <FeaturedProducts products={products} />
    </div>
  );
}
