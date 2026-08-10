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
  shippingZone: z.enum(['ncr', 'luzon', 'vismin']),
  paymentMethod: z.enum(['COD', 'GCash', 'Maya', 'Bank Transfer', 'E-Wallet', 'Card']),
  promoCode: z.string().optional(),
  notes: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be a positive number'),
  compareAtPrice: z.number().positive().optional().nullable(),
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
  specs: z.record(z.string(), z.string()).optional(),
  imageUrls: z.array(z.string()).optional(),
});

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
});

export const addressSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  fullName: z.string().min(1, 'Full name is required'),
  contactNumber: z.string().min(1, 'Contact number is required'),
  addressLine: z.string().min(1, 'Address is required'),
  shippingZone: z.enum(['ncr', 'luzon', 'vismin']),
  isDefault: z.boolean().optional(),
});

export const reviewSchema = z.object({
  productId: z.string().uuid(),
  orderId: z.string().uuid().optional(),
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  body: z.string().min(10, 'Review must be at least 10 characters'),
});

export const returnRequestSchema = z.object({
  orderId: z.string().uuid(),
  reason: z.string().min(10, 'Please describe your reason'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type ReturnRequestFormData = z.infer<typeof returnRequestSchema>;
