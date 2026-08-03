'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signupSchema, SignupFormData } from '@/lib/validation/schemas';
import { signUp } from '@/lib/auth/customer';
import { cn } from '@/lib/utils';

export function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof SignupFormData, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const [formData, setFormData] = useState<SignupFormData>({
    fullName: '',
    email: '',
    password: '',
  });

  function handleChange(field: keyof SignupFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    const parsed = signupSchema.safeParse(formData);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof SignupFormData, string>> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof SignupFormData;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    const result = await signUp(parsed.data.email, parsed.data.password, parsed.data.fullName);

    if (!result.success) {
      setServerError(result.error);
      setIsLoading(false);
      return;
    }

    router.push('/');
    router.refresh();
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

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">
          Password <span className="text-destructive">*</span>
        </Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          placeholder="Enter your password (min 6 characters)"
          className={cn(errors.password && 'border-destructive')}
        />
        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Sign Up'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
