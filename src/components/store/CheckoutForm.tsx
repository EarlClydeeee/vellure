'use client';

import { useState, useTransition, useEffect } from 'react';
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
import {
  createOrderAction,
  calculateCheckoutTotalsAction,
} from '@/app/(store)/actions';
import { cn } from '@/lib/utils';
import { Order, ShippingZoneId } from '@/lib/types';
import { formatPrice } from '@/lib/format-price';
import { deliveryZones } from '@/lib/data/marketing-content';

interface CheckoutFormProps {
  userEmail: string;
  subtotal: number;
  onOrderComplete: (order: Order) => void;
  onTotalsChange?: (totals: {
    shippingFee: number;
    discount: number;
    total: number;
  }) => void;
}

export function CheckoutForm({
  userEmail,
  subtotal,
  onOrderComplete,
  onTotalsChange,
}: CheckoutFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [promoMessage, setPromoMessage] = useState('');
  const [totals, setTotals] = useState({
    shippingFee: 0,
    discount: 0,
    total: subtotal,
    estimatedDays: '',
  });

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    email: userEmail,
    contactNumber: '',
    deliveryAddress: '',
    shippingZone: 'ncr',
    paymentMethod: 'COD',
    promoCode: '',
    notes: '',
  });

  useEffect(() => {
    let cancelled = false;
    async function recalc() {
      const result = await calculateCheckoutTotalsAction(
        subtotal,
        formData.shippingZone as ShippingZoneId,
        formData.promoCode
      );
      if (cancelled) return;
      setTotals({
        shippingFee: result.shippingFee,
        discount: result.discount,
        total: result.total,
        estimatedDays: result.estimatedDays,
      });
      setPromoMessage(result.promoMessage);
      onTotalsChange?.({
        shippingFee: result.shippingFee,
        discount: result.discount,
        total: result.total,
      });
    }
    recalc();
    return () => {
      cancelled = true;
    };
  }, [subtotal, formData.shippingZone, formData.promoCode, onTotalsChange]);

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
      } else if (result.data.redirectToPayment) {
        router.push(`/checkout/payment/${result.data.id}`);
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

      <div className="space-y-2">
        <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className={cn(errors.email && 'border-destructive')}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactNumber">Contact Number <span className="text-destructive">*</span></Label>
        <Input
          id="contactNumber"
          value={formData.contactNumber}
          onChange={(e) => handleChange('contactNumber', e.target.value)}
          placeholder="09XX XXX XXXX"
          className={cn(errors.contactNumber && 'border-destructive')}
        />
        {errors.contactNumber && <p className="text-sm text-destructive">{errors.contactNumber}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="deliveryAddress">Delivery Address <span className="text-destructive">*</span></Label>
        <Textarea
          id="deliveryAddress"
          value={formData.deliveryAddress}
          onChange={(e) => handleChange('deliveryAddress', e.target.value)}
          placeholder="Street, barangay, city, province"
          className={cn(errors.deliveryAddress && 'border-destructive')}
        />
        {errors.deliveryAddress && <p className="text-sm text-destructive">{errors.deliveryAddress}</p>}
      </div>

      <div className="space-y-2">
        <Label>Shipping Zone <span className="text-destructive">*</span></Label>
        <Select
          value={formData.shippingZone}
          onValueChange={(value) => handleChange('shippingZone', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select region" />
          </SelectTrigger>
          <SelectContent>
            {deliveryZones.map((zone) => (
              <SelectItem key={zone.id} value={zone.id}>
                {zone.zone} — {zone.timeframe}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {totals.estimatedDays && (
          <p className="text-xs text-muted-foreground">{totals.estimatedDays}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="promoCode">Promo Code</Label>
        <Input
          id="promoCode"
          value={formData.promoCode ?? ''}
          onChange={(e) => handleChange('promoCode', e.target.value.toUpperCase())}
          placeholder="WELCOME10, FREESHIP"
        />
        {promoMessage && (
          <p className={cn('text-xs', promoMessage.includes('Invalid') || promoMessage.includes('Minimum') ? 'text-destructive' : 'text-green-600')}>
            {promoMessage}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Payment Method <span className="text-destructive">*</span></Label>
        <Select
          value={formData.paymentMethod}
          onValueChange={(value) => handleChange('paymentMethod', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="COD">Cash on Delivery</SelectItem>
            <SelectItem value="E-Wallet">E-Wallet</SelectItem>
            <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Order Notes (optional)</Label>
        <Textarea
          id="notes"
          value={formData.notes ?? ''}
          onChange={(e) => handleChange('notes', e.target.value)}
        />
      </div>

      <div className="rounded-lg border bg-muted/30 p-4 text-sm space-y-1">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{totals.shippingFee === 0 ? 'Free' : formatPrice(totals.shippingFee)}</span>
        </div>
        {totals.discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-{formatPrice(totals.discount)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold border-t pt-2">
          <span>Total</span>
          <span>{formatPrice(totals.total)}</span>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Placing Order...' : 'Place Order'}
      </Button>
    </form>
  );
}
