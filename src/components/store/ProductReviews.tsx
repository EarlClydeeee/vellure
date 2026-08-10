import { ProductReview } from '@/lib/types';

interface ProductReviewsProps {
  reviews: ProductReview[];
  averageRating: number;
  reviewCount: number;
}

export function ProductReviews({
  reviews,
  averageRating,
  reviewCount,
}: ProductReviewsProps) {
  if (reviewCount === 0) {
    return (
      <section className="mt-12">
        <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
        <p className="text-muted-foreground text-sm">No reviews yet. Be the first to review!</p>
      </section>
    );
  }

  return (
    <section className="mt-12">
      <div className="flex items-baseline gap-3 mb-6">
        <h2 className="text-xl font-bold">Customer Reviews</h2>
        <span className="text-yellow-500 font-medium">
          ★ {averageRating.toFixed(1)}
        </span>
        <span className="text-sm text-muted-foreground">({reviewCount} reviews)</span>
      </div>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-yellow-500">
                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
              </span>
              <span className="text-sm font-medium">
                {review.customerName ?? 'Customer'}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(review.createdAt).toLocaleDateString('en-PH')}
              </span>
            </div>
            {review.title && <p className="font-medium text-sm">{review.title}</p>}
            <p className="text-sm text-muted-foreground mt-1">{review.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
