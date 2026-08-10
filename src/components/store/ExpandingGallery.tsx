'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import {
  EXPLORE_IPHONE_GALLERY_ITEMS,
  type ExpandingGalleryItem,
} from '@/lib/assets/public-gallery';
import { locale } from '@/lib/data/marketing-content';
import { cn } from '@/lib/utils';

interface ExpandingGalleryProps {
  items?: ExpandingGalleryItem[];
  title?: string;
  className?: string;
}

function formatPrice(amount: number): string {
  return `${locale.symbol}${amount.toLocaleString(locale.country === 'PH' ? 'en-PH' : 'en-US')}`;
}

export function ExpandingGallery({
  items = EXPLORE_IPHONE_GALLERY_ITEMS,
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
            rgba(0, 0, 0, 0.55) 0%,
            rgba(0, 0, 0, 0.25) 50%,
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
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: 22px;
          font-weight: 500;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .expanding-gallery-overlay .expanding-gallery-description {
          margin: 0;
          font-family: var(--font-sans), 'Nunito Sans', system-ui, sans-serif;
          font-size: 14px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.9);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .expanding-gallery-price {
          margin: 12px 0 0;
          font-family: var(--font-sans), 'Nunito Sans', system-ui, sans-serif;
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .expanding-gallery-compare {
          font-size: 14px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.65);
          text-decoration: line-through;
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

          .expanding-gallery-overlay .expanding-gallery-description {
            font-size: 13px;
          }

          .expanding-gallery-price {
            font-size: 16px;
          }
        }
      `}</style>

      <div className="container mx-auto">
        <h2 className="font-display mb-8 text-2xl font-medium tracking-tight text-vellure-text sm:text-3xl">
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
                    <p className="expanding-gallery-description">{item.description}</p>
                    {isExpanded && (
                      <p className="expanding-gallery-price">
                        {formatPrice(item.price)}
                        {item.compareAtPrice != null && (
                          <span className="expanding-gallery-compare">
                            {formatPrice(item.compareAtPrice)}
                          </span>
                        )}
                      </p>
                    )}
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
