'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Category } from '@/lib/types';

interface CategoryFilterProps {
  categories: Category[];
  selected?: string;
}

export function CategoryFilter({ categories, selected }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set('category', e.target.value);
    } else {
      params.delete('category');
    }
    router.push(`/products?${params.toString()}`);
  }

  return (
    <select
      value={selected ?? ''}
      onChange={handleChange}
      className="h-10 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <option value="">All Categories</option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.name}
        </option>
      ))}
    </select>
  );
}
