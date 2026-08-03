import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const checkoutSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email format'),
  contactNumber: z.string().min(1, 'Contact number is required'),
  deliveryAddress: z.string().min(1, 'Delivery address is required'),
  paymentMethod: z.enum(['COD', 'E-Wallet', 'Bank Transfer']),
  notes: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be a positive number'),
  stockQuantity: z.number().int().min(0, 'Stock must be zero or positive'),
  imageUrl: z
    .string()
    .refine(
      (val) =>
        val === '' ||
        val.startsWith('/') ||
        z.string().url().safeParse(val).success,
      'Must be a valid URL or path starting with /'
    )
    .optional()
    .or(z.literal('')),
  categoryId: z.string().uuid().optional().or(z.literal('')),
  status: z.enum(['Active', 'Inactive', 'Out of Stock']),
});

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
