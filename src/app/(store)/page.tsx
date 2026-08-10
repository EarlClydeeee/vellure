import { CategoryCards } from '@/components/store/CategoryCards';
import { DealsSection } from '@/components/store/DealsSection';
import { ExpandingGallery } from '@/components/store/ExpandingGallery';
import { MasonryWrapperLanding } from '@/components/store/MasonryWrapperLanding';
import { TestimonialWall } from '@/components/store/TestimonialWall';
import { LandingHero } from '@/components/store/marketing/LandingHero';
import { IphoneModelShowcase } from '@/components/store/marketing/IphoneModelShowcase';
import { IphoneFeaturePress } from '@/components/store/marketing/IphoneFeaturePress';
import { VellureMissionBand } from '@/components/store/marketing/VellureMissionBand';
import { PromoVouchers } from '@/components/store/marketing/PromoVouchers';
import { NewsletterCapture } from '@/components/store/marketing/NewsletterCapture';
import { BlogTeaserSection } from '@/components/store/marketing/BlogTeaserSection';
import { FaqSection } from '@/components/store/marketing/FaqSection';
import { FinalCtaBand } from '@/components/store/marketing/FinalCtaBand';
import { StickyShopCta } from '@/components/store/marketing/StickyShopCta';
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
      <LandingHero />

      <IphoneModelShowcase />

      <IphoneFeaturePress />

      <VellureMissionBand />

      <CategoryCards categories={categories} variant="abenson" />

      <DealsSection products={products.slice(0, 8)} />

      <ExpandingGallery />

      <PromoVouchers />

      <MasonryWrapperLanding />

      <TestimonialWall />

      <NewsletterCapture />

      <BlogTeaserSection />

      <FaqSection />

      <FinalCtaBand />

      <StickyShopCta />
    </div>
  );
}
