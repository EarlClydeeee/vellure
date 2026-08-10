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
        <Link href={`/products/${product.id}`} className="cursor-pointer hover:underline">
          <h3 className="line-clamp-2 text-sm font-semibold">{product.name}</h3>
        </Link>

        <StarRating rating={product.averageRating} count={product.reviewCount} />

        <div className="mt-auto flex items-baseline gap-2">
          <p className="text-lg font-bold">{formatPrice(product.price)}</p>
          {onSale && product.compareAtPrice && (
            <p className="text-sm text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice)}
            </p>
          )}
        </div>

        <div className="flex gap-1 pt-1">
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
