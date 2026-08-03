'use client';

import { useState, useTransition } from 'react';
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
import { checkoutSchema, CheckoutFormData } from '@/lib/validation/schemas';
import { createOrderAction } from '@/app/(store)/actions';
import { cn } from '@/lib/utils';
import { Order } from '@/lib/types';

interface CheckoutFormProps {
  userEmail: string;
  onOrderComplete: (order: Order) => void;
}

export function CheckoutForm({ userEmail, onOrderComplete }: CheckoutFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    email: userEmail,
    contactNumber: '',
    deliveryAddress: '',
    paymentMethod: 'COD',
    notes: '',
  });

  function handleChange(field: keyof CheckoutFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    const parsed = checkoutSchema.safeParse(formData);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof CheckoutFormData, string>> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof CheckoutFormData;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    startTransition(async () => {
      const result = await createOrderAction(parsed.data);
      if (!result.success) {
        setServerError(result.error);
      } else {
        onOrderComplete(result.data);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {serverError && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
          {serverError}
        </div>
      )}

      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="fullName">
          Full Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="fullName"
          value={formData.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          placeholder="Enter your full name"
          className={cn(errors.fullName && 'border-destructive')}
        />
        {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">
          Email <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="Enter your email"
          className={cn(errors.email && 'border-destructive')}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>

      {/* Contact Number */}
      <div className="space-y-2">
        <Label htmlFor="contactNumber">
          Contact Number <span className="text-destructive">*</span>
        </Label>
        <Input
          id="contactNumber"
          value={formData.contactNumber}
          onChange={(e) => handleChange('contactNumber', e.target.value)}
          placeholder="Enter your contact number"
          className={cn(errors.contactNumber && 'border-destructive')}
        />
        {errors.contactNumber && <p className="text-sm text-destructive">{errors.contactNumber}</p>}
      </div>

      {/* Delivery Address */}
      <div className="space-y-2">
        <Label htmlFor="deliveryAddress">
          Delivery Address <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="deliveryAddress"
          value={formData.deliveryAddress}
          onChange={(e) => handleChange('deliveryAddress', e.target.value)}
          placeholder="Enter your delivery address"
          className={cn(errors.deliveryAddress && 'border-destructive')}
        />
        {errors.deliveryAddress && <p className="text-sm text-destructive">{errors.deliveryAddress}</p>}
      </div>

      {/* Payment Method */}
      <div className="space-y-2">
        <Label htmlFor="paymentMethod">
          Payment Method <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.paymentMethod}
          onValueChange={(value) => handleChange('paymentMethod', value)}
        >
          <SelectTrigger className={cn(errors.paymentMethod && 'border-destructive')}>
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="COD">Cash on Delivery</SelectItem>
            <SelectItem value="E-Wallet">E-Wallet</SelectItem>
            <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
          </SelectContent>
        </Select>
        {errors.paymentMethod && <p className="text-sm text-destructive">{errors.paymentMethod}</p>}
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Order Notes (optional)</Label>
        <Textarea
          id="notes"
          value={formData.notes ?? ''}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Any special instructions or notes"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Placing Order...' : 'Place Order'}
      </Button>
    </form>
  );
}
