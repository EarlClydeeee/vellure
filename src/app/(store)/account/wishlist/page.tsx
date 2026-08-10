import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getWishlistItems } from '@/lib/services/wishlist';
import { formatPrice } from '@/lib/format-price';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';

export default async function AccountWishlistPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login?returnTo=/account/wishlist');

  const result = await getWishlistItems(user.id);
  const items = result.success ? result.data : [];

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your wishlist is empty"
        description="Save items you love by tapping the heart icon."
        icon={<Heart className="h-12 w-12" />}
        action={
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Wishlist</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const product = item.product;
          if (!product) return null;
          return (
            <Link
              key={item.id}
              href={`/products/${product.id}`}
              className="flex gap-4 rounded-lg border p-4 hover:bg-muted/50"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
                {product.imageUrl && (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                )}
              </div>
              <div>
                <p className="font-medium text-sm line-clamp-2">{product.name}</p>
                <p className="text-sm font-bold mt-1">{formatPrice(product.price)}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
