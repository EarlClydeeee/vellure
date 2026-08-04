'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface MasonryTileData {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  href?: string;
}

const COLUMN_ONE: MasonryTileData[] = [
  {
    src: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&auto=format&fit=crop&q=60',
    alt: 'Modern Living',
    title: 'Modern Living',
    subtitle: 'Clean lines and soft light',
  },
  {
    src: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60',
    alt: 'Workspace',
    title: 'Workspace',
    subtitle: 'Productivity essentials',
  },
  {
    src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60',
    alt: 'Minimalist Hall',
    title: 'Minimalist Hall',
    subtitle: 'Architectural symmetry',
  },
];

const COLUMN_TWO: MasonryTileData[] = [
  {
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=60',
    alt: 'Portrait Mode',
    title: 'Portrait Mode',
    subtitle: 'Capturing the moment',
  },
  {
    src: 'https://images.unsplash.com/photo-1621600411688-4be93cd68504?w=800&auto=format&fit=crop&q=60',
    alt: 'Abstract Art',
    title: 'Abstract Art',
    subtitle: 'Fluid shapes and colors',
  },
  {
    src: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&auto=format&fit=crop&q=60',
    alt: 'Morning Fog',
    title: 'Morning Fog',
    subtitle: "Nature's silence",
  },
];

const COLUMN_THREE: MasonryTileData[] = [
  {
    src: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=800&auto=format&fit=crop&q=60',
    alt: 'Ocean Waves',
    title: 'Ocean Waves',
    subtitle: 'Serenity in motion',
  },
  {
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=60',
    alt: 'Yosemite',
    title: 'Yosemite',
    subtitle: 'Valley view',
  },
  {
    src: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop&q=60',
    alt: 'Urban Architecture',
    title: 'Urban Architecture',
    subtitle: 'City perspectives',
  },
];

const COLUMNS = [
  { tiles: COLUMN_ONE, direction: 'normal' as const },
  { tiles: COLUMN_TWO, direction: 'reverse' as const },
  { tiles: COLUMN_THREE, direction: 'normal' as const },
];

function MasonryTile({ tile }: { tile: MasonryTileData }) {
  const content = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={tile.src}
        alt={tile.alt}
        className="block h-auto w-full transition-all duration-700 group-hover:scale-110"
      />
      <div className="overlay-bg absolute inset-0 flex flex-col justify-end p-6 opacity-0 transition-opacity duration-300 ease-in-out [background:linear-gradient(to_top,rgba(0,0,0,0.8)_0%,transparent_100%)]">
        <div className="overlay-content translate-y-5 opacity-0 transition-all duration-300 ease-in-out">
          <h3 className="mb-1 text-lg font-bold text-white">{tile.title}</h3>
          <p className="text-sm text-white/90">{tile.subtitle}</p>
        </div>
      </div>
    </>
  );

  const className =
    'group relative mb-5 block cursor-pointer overflow-hidden bg-[#1a1a1a]';

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
        <h2 className="mb-8 text-2xl font-bold tracking-tight text-vellure-text sm:text-3xl">
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
