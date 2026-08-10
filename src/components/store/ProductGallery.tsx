'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: { url: string; alt: string }[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const list = images.length > 0 ? images : [{ url: '', alt: 'No image' }];
  const current = list[active] ?? list[0];

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        {current.url ? (
          <Image
            src={current.url}
            alt={current.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
      </div>
      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {list.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                'relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2',
                i === active ? 'border-[#111111]' : 'border-transparent'
              )}
            >
              <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
