import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { promoBanners } from '@/lib/data/marketing-content';

export function PromoBannerGrid() {
  const [large, ...small] = promoBanners;

  return (
    <section className="container mx-auto px-4 py-10 md:py-14">
      <h2 className="mb-6 text-2xl font-bold text-vellure-text md:text-3xl">
        Featured Promos
      </h2>
      <div className="grid gap-4 md:grid-cols-2 md:grid-rows-2 md:gap-5">
        <Link
          href={large.href}
          className="group relative flex min-h-[280px] cursor-pointer overflow-hidden rounded-2xl md:col-start-1 md:row-span-2 md:min-h-[360px]"
        >
          <Image
            src={large.image}
            alt={large.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white md:p-8">
            <p className="text-sm font-medium text-sky-200">{large.subtitle}</p>
            <h3 className="mt-1 text-2xl font-bold md:text-3xl">{large.title}</h3>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-orange-400 transition-colors duration-200 group-hover:text-orange-300">
              Shop now <ArrowRight className="h-4 w-4" aria-hidden />
            </span>
          </div>
        </Link>

        <div className="flex flex-col gap-4 md:col-start-2 md:row-span-2 md:gap-5">
          {small.map((banner) => (
            <Link
              key={banner.id}
              href={banner.href}
              className="group relative flex min-h-[160px] flex-1 cursor-pointer overflow-hidden rounded-2xl md:min-h-[170px]"
            >
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
              <div className="relative flex h-full flex-col justify-center p-5 text-white md:p-6">
                <p className="text-xs font-medium text-sky-200 md:text-sm">
                  {banner.subtitle}
                </p>
                <h3 className="mt-0.5 text-lg font-bold md:text-xl">
                  {banner.title}
                </h3>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-orange-400 transition-colors duration-200 group-hover:text-orange-300">
                  Explore <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
