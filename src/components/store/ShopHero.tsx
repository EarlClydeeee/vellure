import { SearchBar } from '@/components/store/SearchBar';
import { cn } from '@/lib/utils';

interface ShopHeroProps {
  title?: string;
  tagline?: string;
  showSearch?: boolean;
}

export function ShopHero({
  title = 'Shop',
  tagline = 'Give All You Need',
  showSearch = false,
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

        <h1 className="relative z-10 px-4 text-center text-6xl font-bold tracking-tight text-white sm:text-7xl md:text-8xl lg:text-9xl">
          {title}
        </h1>
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
                <p className="shrink-0 text-lg font-semibold tracking-tight text-[#111111] md:text-xl">
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
