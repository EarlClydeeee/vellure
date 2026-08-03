'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { deleteCategoryAction } from '@/app/(admin)/actions';
import { Category } from '@/lib/types';

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
}

export function CategoryTable({ categories, onEdit }: CategoryTableProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    setDeleteError('');

    const result = await deleteCategoryAction(deleteId);

    if (!result.success) {
      setDeleteError(result.error);
      setDeleting(false);
      return;
    }

    setDeleting(false);
    setDeleteId(null);
    router.refresh();
  }

  return (
    <>
      <div className="relative w-full overflow-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
                  No categories found.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(category)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setDeleteError('');
                          setDeleteId(category.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteId(null);
            setDeleteError('');
          }
        }}
        title="Delete Category"
        description={
          deleteError
            ? deleteError
            : 'Are you sure you want to delete this category? This action cannot be undone.'
        }
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  );
}
