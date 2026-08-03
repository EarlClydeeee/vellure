import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getProductById, getProductsByCategory } from '@/lib/services/products';
import { Badge } from '@/components/ui/badge';
import { ProductGrid } from '@/components/store/ProductGrid';
import { ProductDetailsClient } from './ProductDetailsClient';

export const dynamic = 'force-dynamic';

interface ProductDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const { id } = await params;
  const result = await getProductById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const product = result.data;
  const isOutOfStock = product.stockQuantity === 0 || product.status === 'Out of Stock';

  // Fetch related products (same category, excluding self)
  let relatedProducts: typeof product[] = [];
  if (product.categoryId) {
    const relatedResult = await getProductsByCategory(product.categoryId);
    if (relatedResult.success) {
      relatedProducts = relatedResult.data
        .filter((p) => p.id !== product.id)
        .slice(0, 4);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <span className="text-lg">No Image</span>
            </div>
          )}
        </div>

        {/* Product Info */}
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

          <p className="text-3xl font-bold">${product.price.toFixed(2)}</p>

          {product.description && (
            <p className="text-muted-foreground">{product.description}</p>
          )}

          {/* Stock info */}
          <div className="flex items-center gap-2">
            {isOutOfStock ? (
              <Badge variant="destructive">Out of Stock</Badge>
            ) : (
              <span className="text-sm text-muted-foreground">
                {product.stockQuantity} in stock
              </span>
            )}
          </div>

          {/* Client-side quantity selector and add to cart */}
          <ProductDetailsClient
            productId={product.id}
            maxStock={product.stockQuantity}
            disabled={isOutOfStock}
          />
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-8 text-2xl font-bold tracking-tight">
            Related Products
          </h2>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  );
}
