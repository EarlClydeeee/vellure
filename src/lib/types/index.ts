export type ProductStatus = 'Active' | 'Inactive' | 'Out of Stock';
export type OrderStatus = 'Pending' | 'Confirmed' | 'Preparing' | 'Shipped' | 'Completed' | 'Cancelled';
export type PaymentMethod = 'COD' | 'GCash' | 'Maya' | 'Bank Transfer' | 'E-Wallet' | 'Card';
export type PaymentStatus = 'pending' | 'paid' | 'cod_pending' | 'failed' | 'refunded';
export type ShippingZoneId = 'ncr' | 'luzon' | 'vismin';
export type ReturnStatus = 'requested' | 'approved' | 'rejected' | 'refunded';
export type ReviewStatus = 'pending' | 'published' | 'rejected';

export interface Category {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  specs: Record<string, string>;
  stockQuantity: number;
  salesCount: number;
  imageUrl: string | null;
  images?: ProductImage[];
  categoryId: string | null;
  category?: Category;
  status: ProductStatus;
  averageRating?: number;
  reviewCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  fullName: string | null;
  email: string;
  contactNumber: string | null;
  createdAt: Date;
}

export interface CustomerAddress {
  id: string;
  customerId: string;
  label: string;
  fullName: string;
  contactNumber: string;
  addressLine: string;
  shippingZone: ShippingZoneId;
  isDefault: boolean;
  createdAt: Date;
}

export interface CartItem {
  id: string;
  customerId: string;
  productId: string;
  product?: Product;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  orderNumber: number;
  customerId: string;
  fullName: string;
  email: string;
  contactNumber: string;
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentReference: string | null;
  shippingZone: ShippingZoneId | null;
  shippingFee: number;
  discount: number;
  promoCode: string | null;
  trackingNumber: string | null;
  status: OrderStatus;
  notes: string | null;
  subtotal: number;
  total: number;
  items?: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  subtotal: number;
}

export interface ProductReview {
  id: string;
  productId: string;
  customerId: string;
  orderId: string | null;
  rating: number;
  title: string | null;
  body: string;
  status: ReviewStatus;
  customerName?: string;
  createdAt: Date;
}

export interface WishlistItem {
  id: string;
  customerId: string;
  productId: string;
  product?: Product;
  createdAt: Date;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  customerId: string;
  reason: string;
  status: ReturnStatus;
  adminNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Promotion {
  id: string;
  code: string;
  description: string | null;
  discountType: 'percent' | 'fixed' | 'free_shipping';
  discountValue: number;
  minSpend: number;
  active: boolean;
}

export interface ShippingZone {
  id: ShippingZoneId;
  name: string;
  fee: number;
  freeShippingThreshold: number | null;
  estimatedDays: string;
}
