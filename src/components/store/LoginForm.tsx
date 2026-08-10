'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginSchema, LoginFormData } from '@/lib/validation/schemas';
import { signIn } from '@/lib/auth/customer';
import { mergeGuestCartAction, completeStoreLoginAction } from '@/app/(store)/actions';
import { getGuestCart, clearGuestCart } from '@/lib/cart/guest-cart';
import { cn } from '@/lib/utils';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') ?? '/';
  const isCheckout = returnTo.startsWith('/checkout');

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  function handleChange(field: keyof LoginFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    const parsed = loginSchema.safeParse(formData);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginFormData;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    const result = await signIn(parsed.data.email, parsed.data.password);

    if (!result.success) {
      setServerError(result.error);
      setIsLoading(false);
      return;
    }

    const loginResult = await completeStoreLoginAction(
      parsed.data.email,
      parsed.data.password,
      returnTo
    );

    if (!loginResult.success) {
      setServerError(loginResult.error);
      setIsLoading(false);
      return;
    }

    if (!loginResult.isAdmin) {
      const guestItems = getGuestCart();
      if (guestItems.length > 0) {
        await mergeGuestCartAction(guestItems);
        clearGuestCart();
      }
    }

    router.push(loginResult.redirectTo);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isCheckout && (
        <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
          Sign in to complete your order. Your cart items will be saved.
        </div>
      )}

      {serverError && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
          {serverError}
        </div>
      )}

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

      <div className="space-y-2">
        <Label htmlFor="password">
          Password <span className="text-destructive">*</span>
        </Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          placeholder="Enter your password"
          className={cn(errors.password && 'border-destructive')}
        />
        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Log In'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link
          href={`/signup${returnTo !== '/' ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`}
          className="font-medium text-primary hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
