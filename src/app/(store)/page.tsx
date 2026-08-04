import { ShopHero } from '@/components/store/ShopHero';
import { CategoryCards } from '@/components/store/CategoryCards';
import { ServiceBadges } from '@/components/store/ServiceBadges';
import { DealsSection } from '@/components/store/DealsSection';
import { ExpandingGallery } from '@/components/store/ExpandingGallery';
import { MasonryWrapperLanding } from '@/components/store/MasonryWrapperLanding';
import { TestimonialWall } from '@/components/store/TestimonialWall';
import { AnnouncementBar } from '@/components/store/marketing/AnnouncementBar';
import { TrustStatsBar } from '@/components/store/marketing/TrustStatsBar';
import { PromoBannerGrid } from '@/components/store/marketing/PromoBannerGrid';
import { PaymentTrustStrip } from '@/components/store/marketing/PaymentTrustStrip';
import { PromoVouchers } from '@/components/store/marketing/PromoVouchers';
import { WhyVellure } from '@/components/store/marketing/WhyVellure';
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
      <AnnouncementBar />

      <ShopHero showSearch />

      <TrustStatsBar />

      <div className="pt-16 md:pt-20">
        <CategoryCards categories={categories} variant="abenson" />
      </div>

      <PromoBannerGrid />

      <ServiceBadges />

      <PaymentTrustStrip />

      <DealsSection products={products.slice(0, 8)} />

      <WhyVellure />

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
