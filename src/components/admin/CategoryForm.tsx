'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { categorySchema } from '@/lib/validation/schemas';
import { createCategoryAction, updateCategoryAction } from '@/app/(admin)/actions';

interface CategoryFormProps {
  initialData?: { id: string; name: string };
  onSuccess: () => void;
  onCancel: () => void;
}

export function CategoryForm({ initialData, onSuccess, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const validation = categorySchema.safeParse({ name });
    if (!validation.success) {
      setError(validation.error.issues[0]?.message ?? 'Invalid input');
      return;
    }

    setLoading(true);

    try {
      const result = initialData
        ? await updateCategoryAction(initialData.id, name)
        : await createCategoryAction(name);

      if (!result.success) {
        setError(result.error);
        return;
      }

      onSuccess();
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="categoryName">
          Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="categoryName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          disabled={loading}
        />
      </div>
      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading
            ? initialData
              ? 'Updating...'
              : 'Creating...'
            : initialData
              ? 'Update Category'
              : 'Create Category'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
