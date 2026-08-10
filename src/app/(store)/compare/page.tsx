import { ComparePageClient } from '@/components/store/ComparePageClient';

export default function ComparePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Compare Products</h1>
      <ComparePageClient />
    </div>
  );
}
