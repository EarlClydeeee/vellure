import { ShopHero } from '@/components/store/ShopHero';
import { CategoryCards } from '@/components/store/CategoryCards';
import { ServiceBadges } from '@/components/store/ServiceBadges';
import { DealsSection } from '@/components/store/DealsSection';
import { ExpandingGallery } from '@/components/store/ExpandingGallery';
import { MasonryWrapperLanding } from '@/components/store/MasonryWrapperLanding';
import { TestimonialWall } from '@/components/store/TestimonialWall';
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
  const products = productsResult.success ? productsResult.data : [];

  return (
    <div className="flex flex-col">
      <ShopHero title="Branda" tagline="Give All You Need" showSearch />

      <div className="pt-16 md:pt-20">
        <CategoryCards categories={categories} variant="abenson" />
      </div>

      <ServiceBadges />

      <DealsSection products={products.slice(0, 8)} />

      <ExpandingGallery />

      <MasonryWrapperLanding />

      <TestimonialWall />
    </div>
  );
}
