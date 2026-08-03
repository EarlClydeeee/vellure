import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Category } from '@/lib/types';

interface CategoryCardsProps {
  categories: Category[];
}

export function CategoryCards({ categories }: CategoryCardsProps) {
  if (categories.length === 0) return null;

  return (
    <section className="px-4 py-12">
      <div className="container mx-auto">
        <h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/products?category=${category.id}`}>
              <Card className="group cursor-pointer transition-shadow hover:shadow-md">
                <CardContent className="flex items-center justify-center p-8">
                  <span className="text-lg font-medium text-center group-hover:text-primary transition-colors">
                    {category.name}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
