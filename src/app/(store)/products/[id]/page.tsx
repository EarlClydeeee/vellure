import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getProductById, getProductsByCategory } from '@/lib/services/products';
import { getProductReviews, getProductRatingSummary } from '@/lib/services/reviews';
import { Badge } from '@/components/ui/badge';
import { ProductGrid } from '@/components/store/ProductGrid';
import { ProductDetailsClient } from './ProductDetailsClient';
import { ProductGallery } from '@/components/store/ProductGallery';
import { ProductReviews } from '@/components/store/ProductReviews';
import { formatPrice } from '@/lib/format-price';

export const dynamic = 'force-dynamic';

interface ProductDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const result = await getProductById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const product = result.data;
  const isOutOfStock = product.stockQuantity === 0 || product.status === 'Out of Stock';
  const onSale =
    product.compareAtPrice != null && product.compareAtPrice > product.price;

  const [reviewsResult, ratingResult] = await Promise.all([
    getProductReviews(id),
    getProductRatingSummary(id),
  ]);
  const reviews = reviewsResult.success ? reviewsResult.data : [];
  const rating = ratingResult.success
    ? ratingResult.data
    : { averageRating: 0, reviewCount: 0 };

  const galleryImages = product.images?.length
    ? product.images.map((img) => ({ url: img.url, alt: product.name }))
    : product.imageUrl
      ? [{ url: product.imageUrl, alt: product.name }]
      : [];

  let relatedProducts: typeof product[] = [];
  if (product.categoryId) {
    const relatedResult = await getProductsByCategory(product.categoryId);
    if (relatedResult.success) {
      relatedProducts = relatedResult.data
        .filter((p) => p.id !== product.id)
        .slice(0, 4);
    }
  }

  const specEntries = Object.entries(product.specs ?? {});

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <ProductGallery images={galleryImages} />

        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {product.name}
            </h1>
            {product.category && (
              <Badge variant="outline" className="mt-2">
                {product.category.name}
              </Badge>
            )}
          </div>

          {rating.reviewCount > 0 && (
            <p className="text-sm text-yellow-600">
              ★ {rating.averageRating.toFixed(1)} ({rating.reviewCount} reviews)
            </p>
          )}

          <div className="flex items-baseline gap-3">
            <p className="text-3xl font-bold">{formatPrice(product.price)}</p>
            {onSale && product.compareAtPrice && (
              <p className="text-lg text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </p>
            )}
          </div>

          {product.description && (
            <p className="text-muted-foreground">{product.description}</p>
          )}

          <div className="flex items-center gap-2">
            {isOutOfStock ? (
              <Badge variant="destructive">Out of Stock</Badge>
            ) : (
              <span className="text-sm text-muted-foreground">
                {product.stockQuantity} in stock
              </span>
            )}
          </div>

          <ProductDetailsClient
            productId={product.id}
            maxStock={product.stockQuantity}
            disabled={isOutOfStock}
          />
        </div>
      </div>

      {specEntries.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4">Specifications</h2>
          <div className="rounded-lg border overflow-hidden max-w-xl">
            <table className="w-full text-sm">
              <tbody>
                {specEntries.map(([key, value]) => (
                  <tr key={key} className="border-b last:border-0">
                    <td className="bg-muted/50 px-4 py-3 font-medium w-1/3">{key}</td>
                    <td className="px-4 py-3">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <ProductReviews
        reviews={reviews}
        averageRating={rating.averageRating}
        reviewCount={rating.reviewCount}
      />

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-8 text-2xl font-bold tracking-tight">Related Products</h2>
          <ProductGrid products={relatedProducts} isLoggedIn={!!user} />
        </section>
      )}
    </div>
  );
}
