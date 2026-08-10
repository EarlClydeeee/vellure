'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart, GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/format-price';
import { addToGuestCart } from '@/lib/cart/guest-cart';
import { addToCartAction, toggleWishlistAction } from '@/app/(store)/actions';
import { useCart } from '@/components/store/CartProvider';
import { addToCompare } from '@/lib/cart/compare';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'deal';
  isLoggedIn?: boolean;
}

function StarRating({ rating, count }: { rating?: number; count?: number }) {
  if (!rating || !count) return null;
  return (
    <p className="text-xs text-muted-foreground">
      ★ {rating.toFixed(1)} ({count})
    </p>
  );
}

function StockLabel({ product }: { product: Product }) {
  const isOutOfStock =
    product.stockQuantity === 0 || product.status === 'Out of Stock';
  const isInactive = product.status === 'Inactive';

  if (isInactive) {
    return <p className="text-xs text-muted-foreground">Unavailable</p>;
  }
  if (isOutOfStock) {
    return <p className="text-xs text-destructive">Out of stock</p>;
  }
  return (
    <p className="text-xs text-muted-foreground">
      {product.stockQuantity} in stock
    </p>
  );
}

export function ProductCard({ product, variant = 'default', isLoggedIn = false }: ProductCardProps) {
  const router = useRouter();
  const { refreshCartCount } = useCart();
  const [loading, setLoading] = useState<'cart' | 'buy' | null>(null);
  const isOutOfStock =
    product.stockQuantity === 0 || product.status === 'Out of Stock';
  const isInactive = product.status === 'Inactive';
  const disabled = isOutOfStock || isInactive;
  const isDeal = variant === 'deal' || (product.compareAtPrice != null && product.compareAtPrice > product.price);
  const onSale = product.compareAtPrice != null && product.compareAtPrice > product.price;

  async function handleAddToCart() {
    setLoading('cart');
    try {
      const result = await addToCartAction(product.id, 1);
      if (result && 'requiresAuth' in result && result.requiresAuth) {
        addToGuestCart(product.id, 1);
      } else {
        router.refresh();
      }
      refreshCartCount();
    } finally {
      setLoading(null);
    }
  }

  async function handleBuyNow() {
    setLoading('buy');
    try {
      const result = await addToCartAction(product.id, 1);
      if (result && 'requiresAuth' in result && result.requiresAuth) {
        addToGuestCart(product.id, 1);
        refreshCartCount();
        router.push('/login?returnTo=/checkout');
      } else {
        router.refresh();
        router.push('/checkout');
      }
    } finally {
      setLoading(null);
    }
  }

  async function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    await toggleWishlistAction(product.id);
    router.refresh();
  }

  function handleCompare(e: React.MouseEvent) {
    e.preventDefault();
    addToCompare(product.id);
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-[#e5e7eb] bg-white transition-shadow hover:shadow-md">
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
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <span className="text-sm">No Image</span>
          </div>
        )}
        {isDeal && !disabled && (
          <span className="absolute left-1.5 top-1.5 rounded-sm bg-red-500 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white sm:left-3 sm:top-3 sm:rounded-full sm:px-2.5 sm:py-1 sm:text-xs">
            Sale
          </span>
        )}
        {product.category && !isDeal && (
          <span className="absolute right-1.5 top-1.5 max-w-[calc(100%-0.75rem)] truncate rounded-sm bg-white/90 px-1.5 py-0.5 text-[10px] font-medium text-foreground shadow-sm sm:right-3 sm:top-3 sm:rounded-full sm:px-2.5 sm:py-1 sm:text-xs">
            {product.category.name}
          </span>
        )}
        {disabled && (
          <span className="absolute left-1.5 top-1.5 rounded-sm bg-red-500 px-1.5 py-0.5 text-[10px] font-medium text-white sm:left-3 sm:top-3 sm:rounded-full sm:px-2.5 sm:py-1 sm:text-xs">
            {isOutOfStock ? 'Out of Stock' : 'Unavailable'}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1 p-2 sm:gap-2 sm:p-4">
        <Link href={`/products/${product.id}`} className="cursor-pointer hover:underline">
          <h3 className="line-clamp-2 text-xs font-semibold leading-snug sm:text-sm">{product.name}</h3>
        </Link>

        {product.category && (
          <p className="hidden text-xs text-muted-foreground sm:block">{product.category.name}</p>
        )}

        <StarRating rating={product.averageRating} count={product.reviewCount} />

        <div className="mt-auto flex flex-wrap items-baseline gap-1 sm:gap-2">
          <p className="text-sm font-bold text-vellure-primary sm:text-lg">{formatPrice(product.price)}</p>
          {onSale && product.compareAtPrice && (
            <p className="text-[10px] text-muted-foreground line-through sm:text-sm">
              {formatPrice(product.compareAtPrice)}
            </p>
          )}
        </div>

        <div className="hidden sm:block">
          <StockLabel product={product} />
        </div>

        <div className="hidden gap-1 pt-1 sm:flex">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleWishlist}
            aria-label="Add to wishlist"
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleCompare}
            aria-label="Compare"
          >
            <GitCompare className="h-4 w-4" />
          </Button>
        </div>

        {!isDeal && (
          <div className="hidden flex-col gap-2 pt-1 sm:flex">
            <Link href={`/products/${product.id}`} className="w-full">
              <Button
                variant="outline"
                size="sm"
                className="w-full rounded-full border-vellure-primary text-xs"
              >
                View Details
              </Button>
            </Link>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={disabled || loading !== null}
                onClick={handleAddToCart}
                className="flex-1 rounded-full border-vellure-primary text-xs"
              >
                {loading === 'cart' ? 'Adding...' : 'Add to Cart'}
              </Button>
              <Button
                size="sm"
                disabled={disabled || loading !== null}
                onClick={handleBuyNow}
                className={cn(
                  'flex-1 rounded-full bg-vellure-primary text-xs hover:bg-vellure-primary/90'
                )}
              >
                {loading === 'buy' ? 'Processing...' : 'Buy Now'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
