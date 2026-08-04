'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/types';
import { addToCartAction } from '@/app/(store)/actions';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'deal';
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<'cart' | 'buy' | null>(null);
  const isOutOfStock =
    product.stockQuantity === 0 || product.status === 'Out of Stock';
  const isInactive = product.status === 'Inactive';
  const disabled = isOutOfStock || isInactive;
  const isDeal = variant === 'deal';

  async function handleAddToCart() {
    setLoading('cart');
    try {
      await addToCartAction(product.id, 1);
    } catch {
      // user may not be logged in
    } finally {
      setLoading(null);
    }
  }

  async function handleBuyNow() {
    setLoading('buy');
    try {
      await addToCartAction(product.id, 1);
      router.push('/checkout');
    } catch {
      router.push(`/products/${product.id}`);
    } finally {
      setLoading(null);
    }
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-[#e5e7eb] bg-white transition-shadow hover:shadow-md">
      <Link
        href={`/products/${product.id}`}
        className="relative aspect-square cursor-pointer bg-muted"
      >
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <span className="text-sm">No Image</span>
          </div>
        )}
        {isDeal && !disabled && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
            Sale
          </span>
        )}
        {product.category && !isDeal && (
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm">
            {product.category.name}
          </span>
        )}
        {disabled && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-medium text-white">
            {isOutOfStock ? 'Out of Stock' : 'Unavailable'}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link
          href={`/products/${product.id}`}
          className="cursor-pointer hover:underline"
        >
          <h3 className="line-clamp-2 text-sm font-semibold">{product.name}</h3>
        </Link>

        <p className="mt-auto text-lg font-bold">${product.price.toFixed(2)}</p>

        {!isDeal && (
          <div className="flex gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              disabled={disabled || loading !== null}
              onClick={handleAddToCart}
              className="flex-1 rounded-full border-[#111111] text-xs"
            >
              {loading === 'cart' ? 'Adding...' : 'Add to Cart'}
            </Button>
            <Button
              size="sm"
              disabled={disabled || loading !== null}
              onClick={handleBuyNow}
              className={cn(
                'flex-1 rounded-full bg-[#111111] text-xs hover:bg-[#111111]/90'
              )}
            >
              {loading === 'buy' ? 'Processing...' : 'Buy Now'}
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}
