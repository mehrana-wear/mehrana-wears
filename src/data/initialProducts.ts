import { Product, Review } from '../types';

export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_REVIEWS: Record<string, Review[]> = {};

export const PROMO_CODES: Record<string, { discountPercent?: number; fixedDiscount?: number; freeShipping?: boolean; description: string }> = {
  'MEHRANA15': { discountPercent: 15, description: '15% Off Your Entire Order' },
  'WELCOME10': { discountPercent: 10, description: '10% New Customer Discount' },
  'FREESHIP': { freeShipping: true, description: 'Free Express Shipping' },
  'VIP25': { discountPercent: 25, description: '25% VIP Club Savings' },
};

