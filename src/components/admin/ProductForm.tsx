'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { productSchema, ProductFormData } from '@/lib/validation/schemas';
import { createProductAction, updateProductAction } from '@/app/(admin)/actions';
import { Category, Product, ProductStatus } from '@/lib/types';

interface ProductFormProps {
  categories: Category[];
  product?: Product;
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');

  const [name, setName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [price, setPrice] = useState(product?.price?.toString() ?? '');
  const [compareAtPrice, setCompareAtPrice] = useState(
    product?.compareAtPrice?.toString() ?? ''
  );
  const [specsText, setSpecsText] = useState(
    product?.specs ? Object.entries(product.specs).map(([k, v]) => `${k}: ${v}`).join('\n') : ''
  );
  const [extraImages, setExtraImages] = useState(
    product?.images?.map((i) => i.url).join('\n') ?? ''
  );
  const [stockQuantity, setStockQuantity] = useState(
    product?.stockQuantity?.toString() ?? '0'
  );
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? '');
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? '');
  const [status, setStatus] = useState<ProductStatus>(product?.status ?? 'Active');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setServerError('');

    const specs: Record<string, string> = {};
    specsText.split('\n').forEach((line) => {
      const idx = line.indexOf(':');
      if (idx > 0) {
        specs[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
      }
    });
    const imageUrls = extraImages
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const formData = {
      name,
      description: description || undefined,
      price: parseFloat(price) || 0,
      compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
      specs: Object.keys(specs).length ? specs : undefined,
      stockQuantity: parseInt(stockQuantity) || 0,
      imageUrl: imageUrl || '',
      imageUrls: imageUrls.length ? imageUrls : undefined,
      categoryId: categoryId === 'none' ? '' : categoryId || '',
      status,
    };

    const validation = productSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        const key = issue.path[0]?.toString();
        if (key) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      const result = product
        ? await updateProductAction(product.id, validation.data)
        : await createProductAction(validation.data);

      if (!result.success) {
        setServerError(result.error);
        return;
      }

      router.push('/admin/products');
      router.refresh();
    } catch {
      setServerError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {serverError && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {serverError}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">
          Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">
            Price <span className="text-destructive">*</span>
          </Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            disabled={loading}
          />
          {errors.price && (
            <p className="text-sm text-destructive">{errors.price}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="stockQuantity">
            Stock Quantity <span className="text-destructive">*</span>
          </Label>
          <Input
            id="stockQuantity"
            type="number"
            min="0"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            disabled={loading}
          />
          {errors.stockQuantity && (
            <p className="text-sm text-destructive">{errors.stockQuantity}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="compareAtPrice">Compare-at Price (sale)</Label>
          <Input
            id="compareAtPrice"
            type="number"
            step="0.01"
            min="0"
            value={compareAtPrice}
            onChange={(e) => setCompareAtPrice(e.target.value)}
            disabled={loading}
            placeholder="Original price for strikethrough"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="specs">Specs (one per line: Key: Value)</Label>
        <Textarea
          id="specs"
          value={specsText}
          onChange={(e) => setSpecsText(e.target.value)}
          placeholder={'Storage: 256GB\nColor: Midnight'}
          disabled={loading}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Primary Image URL or path</Label>
        <Input
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="/iphone/iphone17/iphone_17__fb1277oq3eaa_large.jpg"
          disabled={loading}
        />
        {errors.imageUrl && (
          <p className="text-sm text-destructive">{errors.imageUrl}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="extraImages">Gallery Images (one URL per line)</Label>
        <Textarea
          id="extraImages"
          value={extraImages}
          onChange={(e) => setExtraImages(e.target.value)}
          placeholder="/iphone/iphone17/iphone_17pro__t1j902iw6kya_large.jpg"
          disabled={loading}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Category</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && (
            <p className="text-sm text-destructive">{errors.categoryId}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>
            Status <span className="text-destructive">*</span>
          </Label>
          <Select value={status} onValueChange={(val) => setStatus(val as ProductStatus)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Out of Stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-sm text-destructive">{errors.status}</p>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading
            ? product
              ? 'Updating...'
              : 'Creating...'
            : product
              ? 'Update Product'
              : 'Create Product'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/products')}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
