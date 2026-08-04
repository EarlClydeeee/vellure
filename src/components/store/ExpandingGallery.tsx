'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  ExpandingGalleryItem,
  IPHONE_GALLERY_ITEMS,
} from '@/lib/assets/public-gallery';

interface ExpandingGalleryProps {
  items?: ExpandingGalleryItem[];
  title?: string;
  className?: string;
}

export function ExpandingGallery({
  items = IPHONE_GALLERY_ITEMS,
  title = 'Explore iPhone 17',
  className,
}: ExpandingGalleryProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  function handleClick(index: number, e: React.MouseEvent) {
    if (expandedIndex !== index) {
      e.preventDefault();
      setExpandedIndex(index);
    } else {
      setExpandedIndex(null);
    }
  }

  return (
    <section className={cn('px-4 py-12', className)}>
      <div className="container mx-auto">
        <h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h2>
        <div
          className={cn(
            'flex h-auto flex-col gap-3 overflow-hidden md:h-[450px] md:flex-row',
            expandedIndex !== null && 'has-expanded'
          )}
        >
          {items.map((item, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div
                key={item.title}
                className={cn(
                  'group relative h-[120px] cursor-pointer overflow-hidden rounded-3xl transition-all duration-700 ease-out md:h-full',
                  isExpanded ? 'md:flex-[3]' : 'md:flex-1',
                  expandedIndex !== null && !isExpanded && 'md:flex-[0.5]'
                )}
                onClick={(e) => handleClick(index, e)}
              >
                <Link href={item.href} className="relative block h-full w-full">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <div
                    className={cn(
                      'absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-5 transition-all duration-700',
                      isExpanded
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-full opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100'
                    )}
                  >
                    <h3 className="truncate text-lg font-bold text-white md:text-xl">
                      {item.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-white/90">
                      {item.description}
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
