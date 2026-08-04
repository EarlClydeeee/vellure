import Link from 'next/link';
import { SearchBar } from '@/components/store/SearchBar';
import { Button } from '@/components/ui/button';
import { heroCopy } from '@/lib/data/marketing-content';
import { cn } from '@/lib/utils';

interface ShopHeroProps {
  title?: string;
  subtitle?: string;
  tagline?: string;
  showSearch?: boolean;
  showMarketingCtas?: boolean;
}

export function ShopHero({
  title = heroCopy.title,
  subtitle = heroCopy.subtitle,
  tagline = heroCopy.tagline,
  showSearch = false,
  showMarketingCtas = true,
}: ShopHeroProps) {
  return (
    <section className="relative pb-16 md:pb-20">
      <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden sm:min-h-[380px] md:min-h-[420px]">
        <div
          className="absolute inset-0 scale-105 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.25)), url('/images/shop-hero.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative z-10 px-4 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto mt-3 max-w-xl text-base text-white/90 sm:text-lg md:text-xl">
              {subtitle}
            </p>
          )}
          {showMarketingCtas && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="cursor-pointer rounded-full bg-vellure-cta px-8 text-white hover:bg-vellure-cta/90"
              >
                <Link href={heroCopy.primaryCta.href}>{heroCopy.primaryCta.label}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="cursor-pointer rounded-full border-white/80 bg-white/10 px-8 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/20"
              >
                <Link href={heroCopy.secondaryCta.href}>{heroCopy.secondaryCta.label}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {(showSearch || tagline) && (
        <div className="absolute bottom-0 left-0 right-0 z-10 translate-y-1/2 px-4">
          <div className="container mx-auto">
            <div
              className={cn(
                'flex flex-col items-stretch gap-4 rounded-2xl border border-gray-100 bg-white px-5 py-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] sm:px-8 sm:py-6',
                showSearch
                  ? 'md:flex-row md:items-center md:justify-between'
                  : 'md:items-center md:justify-center'
              )}
            >
              {tagline && (
                <p className="shrink-0 text-lg font-semibold tracking-tight text-vellure-text md:text-xl">
                  {tagline}
                </p>
              )}
              {showSearch && <SearchBar variant="hero" className="md:max-w-lg" />}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
