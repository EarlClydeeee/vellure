'use client';

import Link from 'next/link';
import {
  MASONRY_IPHONE_TILES,
  distributeMasonryToColumns,
  type MasonryTileData,
} from '@/lib/assets/public-gallery';
import { cn } from '@/lib/utils';

const COLUMN_DIRECTIONS = ['normal', 'reverse', 'normal'] as const;

function MasonryTile({ tile }: { tile: MasonryTileData }) {
  const content = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={tile.src}
        alt={tile.alt}
        loading="lazy"
        className="block h-full min-h-[220px] w-full object-contain p-6 transition-transform duration-700 group-hover:scale-105"
      />
      <div className="overlay-bg absolute inset-0 flex flex-col justify-end p-6 opacity-0 transition-opacity duration-300 ease-in-out [background:linear-gradient(to_top,rgba(0,0,0,0.75)_0%,transparent_55%)]">
        <div className="overlay-content translate-y-5 opacity-0 transition-all duration-300 ease-in-out">
          <h3 className="mb-1 text-lg font-bold text-white">{tile.title}</h3>
          <p className="text-sm text-white/90">{tile.subtitle}</p>
        </div>
      </div>
    </>
  );

  const className =
    'group relative mb-5 block min-h-[220px] cursor-pointer overflow-hidden rounded-xl bg-slate-100';

  if (tile.href) {
    return (
      <Link href={tile.href} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}

function ScrollColumn({
  tiles,
  direction,
}: {
  tiles: MasonryTileData[];
  direction: 'normal' | 'reverse';
}) {
  const loop = [...tiles, ...tiles, ...tiles, ...tiles];

  return (
    <div
      className="scroll-column relative h-full min-w-0 overflow-hidden"
      style={{
        maskImage:
          'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
      }}
    >
      <div
        className="scroll-track flex flex-col leading-[0]"
        style={{
          animation: 'scrollVertical 100s linear infinite',
          animationDirection: direction,
        }}
      >
        {loop.map((tile, i) => (
          <MasonryTile key={`${tile.alt}-${i}`} tile={tile} />
        ))}
      </div>
    </div>
  );
}

interface MasonryWrapperLandingProps {
  title?: string;
  className?: string;
}

const COLUMNS = distributeMasonryToColumns(MASONRY_IPHONE_TILES, 3).map(
  (tiles, index) => ({
    tiles,
    direction: COLUMN_DIRECTIONS[index] ?? ('normal' as const),
  })
);

export function MasonryWrapperLanding({
  title = 'The Vellure Collection',
  className,
}: MasonryWrapperLandingProps) {
  return (
    <section className={cn('px-4 py-12', className)}>
      <style jsx global>{`
@keyframes scrollVertical {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
.group:hover .overlay-bg {
    opacity: 1 !important;
}
.group:hover .overlay-content {
    opacity: 1 !important;
    transform: translateY(0) scale(1) !important;
}
      `}</style>
      <div className="container mx-auto">
        <h2 className="font-display mb-8 text-2xl font-medium tracking-tight text-vellure-text sm:text-3xl">
          {title}
        </h2>
        <div
          className="grid h-[600px] gap-5 overflow-hidden"
          style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}
        >
          {COLUMNS.map((col, i) => (
            <ScrollColumn key={i} tiles={col.tiles} direction={col.direction} />
          ))}
        </div>
    </div>
    </section>
  );
}
