'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryTable } from '@/components/admin/CategoryTable';
import { CategoryForm } from '@/components/admin/CategoryForm';
import { Category } from '@/lib/types';

interface CategoriesPageClientProps {
  categories: Category[];
}

export function CategoriesPageClient({ categories }: CategoriesPageClientProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  function handleEdit(category: Category) {
    setEditingCategory(category);
    setShowForm(true);
  }

  function handleSuccess() {
    setShowForm(false);
    setEditingCategory(null);
    router.refresh();
  }

  function handleCancel() {
    setShowForm(false);
    setEditingCategory(null);
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        )}
      </div>

      {showForm && (
        <div className="mb-6 rounded-md border p-4">
          <h2 className="text-lg font-semibold mb-4">
            {editingCategory ? 'Edit Category' : 'New Category'}
          </h2>
          <CategoryForm
            initialData={
              editingCategory
                ? { id: editingCategory.id, name: editingCategory.name }
                : undefined
            }
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      )}

      <CategoryTable categories={categories} onEdit={handleEdit} />
    </div>
  );
}
