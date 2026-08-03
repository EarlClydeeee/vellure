'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function PriceSortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get('sort') ?? '';

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set('sort', e.target.value);
    } else {
      params.delete('sort');
    }
    router.push(`/products?${params.toString()}`);
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      className="h-10 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <option value="">Default</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
    </select>
  );
}
