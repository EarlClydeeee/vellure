'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  GalleryImage,
  PUBLIC_GALLERY_IMAGES,
  distributeImagesToColumns,
} from '@/lib/assets/public-gallery';

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
}: {
  images: GalleryImage[];
  duration: number;
  direction: 'normal' | 'reverse';
}) {
  return (
    <div
      className="relative min-w-0 overflow-hidden"
      style={{
        maskImage:
          'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
      }}
    >
      <div
        className="flex flex-col gap-2"
        style={{
          animation: `masonryScroll ${duration}s linear infinite`,
          animationDirection: direction,
        }}
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
  const columns = distributeImagesToColumns(images, columnCount);

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
      `}</style>
      <div className="container mx-auto">
        <h2 className="mb-8 text-2xl font-bold tracking-tight text-vellure-text sm:text-3xl">
          {title}
        </h2>
        <div
          className="grid h-[600px] gap-2 overflow-hidden sm:h-[800px] md:h-[1000px]"
          style={{
            gridTemplateColumns: `repeat(${Math.min(columnCount, 4)}, 1fr)`,
          }}
        >
          {columns.map((col, i) => (
            <MasonryColumn
              key={i}
              images={col}
              duration={COLUMN_DURATIONS[i % COLUMN_DURATIONS.length]}
              direction={i % 2 === 0 ? 'normal' : 'reverse'}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
