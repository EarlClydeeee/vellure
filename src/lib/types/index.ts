export type ProductStatus = 'Active' | 'Inactive' | 'Out of Stock';
export type OrderStatus = 'Pending' | 'Confirmed' | 'Preparing' | 'Shipped' | 'Completed' | 'Cancelled';
export type PaymentMethod = 'COD' | 'E-Wallet' | 'Bank Transfer';

export interface Category {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stockQuantity: number;
  imageUrl: string | null;
  categoryId: string | null;
  category?: Category;
  status: ProductStatus;
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
