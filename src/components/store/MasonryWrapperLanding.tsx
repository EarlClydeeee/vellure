'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  GalleryImage,
  PUBLIC_GALLERY_IMAGES,
  distributeImagesToColumns,
} from '@/lib/assets/public-gallery';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface MasonryWrapperLandingProps {
  images?: GalleryImage[];
  title?: string;
  columnCount?: number;
  className?: string;
}

const COLUMN_DURATIONS = [100, 120, 80, 110];

function MasonryColumn({
  images,
  duration,
  direction,
  animate,
}: {
  images: GalleryImage[];
  duration: number;
  direction: 'normal' | 'reverse';
  animate: boolean;
}) {
  return (
    <div
      className="relative min-w-0 overflow-hidden"
      style={
        animate
          ? {
              maskImage:
                'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
            }
          : undefined
      }
    >
      <div
        className="flex flex-col gap-2"
        style={
          animate
            ? {
                animation: `masonryScroll ${duration}s linear infinite`,
                animationDirection: direction,
              }
            : undefined
        }
      >
        {images.map((image, i) => (
          <MasonryTile key={`${image.src}-${i}`} image={image} />
        ))}
      </div>
    </div>
  );
}

function MasonryTile({ image }: { image: GalleryImage }) {
  const content = (
    <>
      <Image
        src={image.src}
        alt={image.alt}
        width={400}
        height={500}
        className="block h-auto w-full transition-transform duration-700 group-hover:scale-110"
      />
      {(image.title || image.subtitle) && (
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {image.title && (
            <h3 className="text-lg font-bold text-white">{image.title}</h3>
          )}
          {image.subtitle && (
            <p className="text-sm text-white/90">{image.subtitle}</p>
          )}
        </div>
      )}
    </>
  );

  const className =
    'group relative block cursor-pointer overflow-hidden bg-[#1a1a1a] focus:outline-none focus-visible:ring-2 focus-visible:ring-vellure-primary';

  if (image.href) {
    return (
      <Link href={image.href} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}

export function MasonryWrapperLanding({
  images = PUBLIC_GALLERY_IMAGES,
  title = 'The Vellure Collection',
  columnCount = 4,
  className,
}: MasonryWrapperLandingProps) {
  const reduced = useReducedMotion();
  const animate = !reduced;
  const columns = distributeImagesToColumns(images, columnCount);
  const staticColumns = animate
    ? columns
    : columns.map((col) => col.slice(0, Math.ceil(col.length / 2)));

  return (
    <section className={cn('px-4 py-12', className)}>
      <style jsx global>{`
        @keyframes masonryScroll {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*='masonryScroll'] {
            animation: none !important;
          }
        }
      `}</style>
      <div className="container mx-auto">
        <h2 className="mb-8 text-2xl font-bold tracking-tight text-vellure-text sm:text-3xl">
          {title}
        </h2>
        <div
          className={cn(
            'grid gap-2 overflow-hidden',
            animate ? 'h-[600px] sm:h-[800px] md:h-[1000px]' : 'h-auto'
          )}
          style={{
            gridTemplateColumns: `repeat(${Math.min(columnCount, 4)}, 1fr)`,
          }}
        >
          {staticColumns.map((col, i) => (
            <MasonryColumn
              key={i}
              images={col}
              duration={COLUMN_DURATIONS[i % COLUMN_DURATIONS.length]}
              direction={i % 2 === 0 ? 'normal' : 'reverse'}
              animate={animate}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
