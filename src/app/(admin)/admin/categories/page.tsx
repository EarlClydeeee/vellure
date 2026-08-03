import { Metadata } from 'next';
import { getCategories } from '@/lib/services/categories';
import { CategoriesPageClient } from '@/components/admin/CategoriesPageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Categories - Vellure Admin',
};

export default async function AdminCategoriesPage() {
  const result = await getCategories();
  const categories = result.success ? result.data : [];

  return <CategoriesPageClient categories={categories} />;
}
