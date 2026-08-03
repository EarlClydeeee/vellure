'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/lib/types';
import { addToCartAction } from '@/app/(store)/actions';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [loading, setLoading] = useState(false);
  const isOutOfStock = product.stockQuantity === 0 || product.status === 'Out of Stock';
  const isInactive = product.status === 'Inactive';

  async function handleAddToCart() {
    setLoading(true);
    try {
      await addToCartAction(product.id, 1);
    } catch {
      // Silently handle — user may not be logged in
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <Link href={`/products/${product.id}`} className="relative aspect-square bg-muted">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <span className="text-sm">No Image</span>
          </div>
        )}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {isOutOfStock && (
            <Badge variant="destructive">Out of Stock</Badge>
          )}
          {isInactive && (
            <Badge variant="secondary">Inactive</Badge>
          )}
        </div>
      </Link>
      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/products/${product.id}`} className="hover:underline">
          <h3 className="font-semibold line-clamp-2">{product.name}</h3>
        </Link>
        {product.category && (
          <Badge variant="outline" className="w-fit text-xs">
            {product.category.name}
          </Badge>
        )}
        <p className="mt-auto text-lg font-bold">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        <Link href={`/products/${product.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            View Details
          </Button>
        </Link>
        <Button
          size="sm"
          disabled={isOutOfStock || isInactive || loading}
          onClick={handleAddToCart}
          className="flex-1"
        >
          <ShoppingCart className="h-4 w-4" />
          {loading ? 'Adding...' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
}
