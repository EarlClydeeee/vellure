'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface GalleryItem {
  src: string;
  title: string;
  description: string;
  href: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    src: 'https://images.unsplash.com/photo-1633885274964-d5a5d914bcb3?q=80&w=687&auto=format&fit=crop',
    title: 'Abstract Art',
    description: 'Explore vibrant colors and modern geometric designs',
    href: '/products',
  },
  {
    src: 'https://images.unsplash.com/photo-1589194837807-30a2f9540ad9?q=80&w=687&auto=format&fit=crop',
    title: 'Nature Photography',
    description: 'Breathtaking landscapes and natural wonders',
    href: '/products',
  },
  {
    src: 'https://images.unsplash.com/photo-1582644826651-f71401f0f3f6?q=80&w=687&auto=format&fit=crop',
    title: 'Urban Design',
    description: 'Modern architecture and city life captured beautifully',
    href: '/products',
  },
  {
    src: 'https://images.unsplash.com/photo-1614679967638-fe153775eff6?q=80&w=765&auto=format&fit=crop',
    title: 'Creative Workspace',
    description: 'Inspiring workspaces for creative professionals',
    href: '/products',
  },
  {
    src: 'https://images.unsplash.com/photo-1617195737496-bc30194e3a19?q=80&w=735&auto=format&fit=crop',
    title: 'Digital Innovation',
    description: 'The future of technology and creative tools',
    href: '/products',
  },
];

interface ExpandingGalleryProps {
  items?: GalleryItem[];
  title?: string;
  className?: string;
}

export function ExpandingGallery({
  items = GALLERY_ITEMS,
  title = 'Explore iPhone 17',
  className,
}: ExpandingGalleryProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleColumnClick = useCallback(
    (index: number, e: React.MouseEvent) => {
      const isExpanded = expandedIndex === index;

      if (!isExpanded) {
        e.preventDefault();
        setExpandedIndex(index);
      } else {
        setExpandedIndex(null);
      }
    },
    [expandedIndex]
  );

  return (
    <section className={cn('px-4 py-12', className)}>
      <style jsx global>{`
        .expanding-gallery-wrapper {
          display: flex;
          gap: 12px;
          height: 450px;
          overflow: hidden;
        }

        .expanding-gallery-column {
          flex: 1;
          height: 100%;
          border-radius: 24px;
          overflow: hidden;
          transition: flex 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
        }

        .expanding-gallery-column img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          border-radius: 24px;
          transition: transform 0.8s ease, filter 0.8s ease;
        }

        .expanding-gallery-column:hover img {
          transform: scale(1.1);
        }

        .expanding-gallery-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.2) 0%,
            rgba(0, 0, 0, 0.12) 40%,
            transparent 100%
          );
          padding: 30px 20px;
          transform: translateY(100%);
          opacity: 0;
          transition:
            transform 0.8s cubic-bezier(0.4, 0, 0.2, 1),
            opacity 0.8s ease;
        }

        .expanding-gallery-overlay h3 {
          margin: 0 0 8px;
          font-family: 'Courier New', system-ui, sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .expanding-gallery-overlay p {
          margin: 0;
          font-family: 'Courier New', system-ui, sans-serif;
          font-size: 14px;
          line-height: 1.5;
          color: #ffffff;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .expanding-gallery-wrapper:hover .expanding-gallery-column {
          flex: 0.5;
        }

        .expanding-gallery-wrapper .expanding-gallery-column:hover {
          flex: 3;
        }

        .expanding-gallery-column:hover .expanding-gallery-overlay,
        .expanding-gallery-column.is-expanded .expanding-gallery-overlay {
          transform: translateY(0);
          opacity: 1;
        }

        .expanding-gallery-column.is-expanded {
          flex: 3 !important;
        }

        .expanding-gallery-wrapper.has-expanded
          .expanding-gallery-column:not(.is-expanded):not(:hover) {
          flex: 0.5;
        }

        @media (max-width: 768px) {
          .expanding-gallery-wrapper {
            flex-direction: column;
            height: auto;
          }

          .expanding-gallery-wrapper:hover .expanding-gallery-column,
          .expanding-gallery-wrapper .expanding-gallery-column:hover {
            flex: none;
          }

          .expanding-gallery-column {
            height: 120px;
            flex: none !important;
            transition: height 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .expanding-gallery-column.is-expanded {
            height: 350px;
          }

          .expanding-gallery-column .expanding-gallery-overlay {
            transform: translateY(100%);
            opacity: 0;
          }

          .expanding-gallery-column.is-expanded .expanding-gallery-overlay {
            transform: translateY(0);
            opacity: 1;
          }

          .expanding-gallery-overlay h3 {
            font-size: 18px;
          }

          .expanding-gallery-overlay p {
            font-size: 13px;
          }
        }
      `}</style>

      <div className="container mx-auto">
        <h2 className="mb-8 text-2xl font-bold tracking-tight text-vellure-text sm:text-3xl">
          {title}
        </h2>
        <div
          className={cn(
            'expanding-gallery-wrapper',
            expandedIndex !== null && 'has-expanded'
          )}
        >
          {items.map((item, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div
                key={item.title}
                className={cn(
                  'expanding-gallery-column',
                  isExpanded && 'is-expanded'
                )}
                onClick={(e) => handleColumnClick(index, e)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleColumnClick(index, e as unknown as React.MouseEvent);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
              >
                <Link href={item.href} className="relative block h-full w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.src} alt={item.title} />
                  <div className="expanding-gallery-overlay">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
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
