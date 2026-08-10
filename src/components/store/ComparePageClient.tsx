'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCompareList, removeFromCompare } from '@/lib/cart/compare';
import { formatPrice } from '@/lib/format-price';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export function ComparePageClient() {
  const [ids, setIds] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const list = getCompareList();
      setIds(list);
      if (list.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }
      const res = await fetch('/api/cart/guest-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: list }),
      });
      const data = await res.json();
      setProducts(data.products ?? []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <p className="text-muted-foreground">Loading compare...</p>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-muted-foreground">No products to compare.</p>
        <Link href="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  const allSpecKeys = Array.from(
    new Set(products.flatMap((p) => Object.keys(p.specs ?? {})))
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr>
            <th className="border p-3 text-left bg-muted/50 w-32">Product</th>
            {products.map((p) => (
              <th key={p.id} className="border p-3 align-top">
                <div className="relative mx-auto mb-2 h-24 w-24">
                  {p.imageUrl && (
                    <Image src={p.imageUrl} alt={p.name} fill className="object-cover rounded" sizes="96px" />
                  )}
                </div>
                <Link href={`/products/${p.id}`} className="font-medium hover:underline">
                  {p.name}
                </Link>
                <p className="font-bold mt-1">{formatPrice(p.price)}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    removeFromCompare(p.id);
                    setIds(getCompareList());
                    setProducts((prev) => prev.filter((x) => x.id !== p.id));
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-3 font-medium bg-muted/50">Price</td>
            {products.map((p) => (
              <td key={p.id} className="border p-3">{formatPrice(p.price)}</td>
            ))}
          </tr>
          <tr>
            <td className="border p-3 font-medium bg-muted/50">Stock</td>
            {products.map((p) => (
              <td key={p.id} className="border p-3">{p.stockQuantity}</td>
            ))}
          </tr>
          {allSpecKeys.map((key) => (
            <tr key={key}>
              <td className="border p-3 font-medium bg-muted/50">{key}</td>
              {products.map((p) => (
                <td key={p.id} className="border p-3">
                  {p.specs?.[key] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
