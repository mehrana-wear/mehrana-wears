export type ProductCategory = 'All' | 'Women' | 'Men' | 'Kids' | 'Modest' | 'Festive' | 'Accessories';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  image_url: string;
  additional_images?: string[];
  description: string;
  fabric: string;
  careInstructions?: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  stock: number;
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  tags?: string[];
  sku: string;
  createdAt: string;
}

export interface CartItem {
  id: string; // unique item id: product.id + size + color
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image_url: string;
  selectedSize: string;
  selectedColor: { name: string; hex: string };
  qty: number;
  maxStock: number;
  category: ProductCategory;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  helpfulCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'customer';
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  phone?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  image_url: string;
  selectedSize: string;
  selectedColor: string;
  qty: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  deliveryMethod: 'standard' | 'express';
  paymentMethod: 'card' | 'cod' | 'googlepay' | 'applepay' | 'paypal';
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  tax: number;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingNumber: string;
  estimatedDelivery: string;
}

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'AED' | 'PKR' | 'CAD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number; // relative to USD
  position: 'prefix' | 'suffix';
}

export interface FilterOptions {
  category: ProductCategory;
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  sizes: string[];
  colors: string[];
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
}
