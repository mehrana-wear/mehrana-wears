import { Product, CartItem, Order, User, Review, MerchantPayoutSettings } from '../types';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS } from '../data/initialProducts';
import { getGoogleAvatarUrl } from './googleAvatar';

const STORAGE_KEYS = {
  PRODUCTS: 'mehrana_wear_products_v3',
  CART: 'mehrana_wear_cart_v3',
  WISHLIST: 'mehrana_wear_wishlist_v3',
  USER: 'mehrana_wear_user_v4',
  ORDERS: 'mehrana_wear_orders_v3',
  REVIEWS: 'mehrana_wear_reviews_v3',
  ADMIN_AUTH: 'mehrana_wear_admin_unlocked_v3',
};

export function getStoredProducts(): Product[] {
  try {
    // Clear old versions if existing
    localStorage.removeItem('mehrana_wear_products_v2');
    localStorage.removeItem('mehrana_wear_products_v1');
    localStorage.removeItem('mehrana_wear_cart_v2');
    localStorage.removeItem('mehrana_wear_wishlist_v2');

    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredProducts(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (err) {
    console.error('Failed to save products to localStorage', err);
  }
}

export function resetStoredProducts(): Product[] {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
}

export function getStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CART);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredCart(cart: CartItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  } catch (err) {
    console.error('Failed to save cart to localStorage', err);
  }
}

export function getStoredWishlist(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredWishlist(wishlistIds: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlistIds));
  } catch (err) {
    console.error('Failed to save wishlist', err);
  }
}

export function getStoredUser(): User | null {
  try {
    // Clear previous auto-login default versions
    localStorage.removeItem('mehrana_wear_user_v3');
    localStorage.removeItem('mehrana_wear_user_v2');
    localStorage.removeItem('mehrana_wear_user_v1');

    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) return null;
    const parsed: User = JSON.parse(raw);
    
    // Automatically update to Google Avatar if user is farukarim@gmail.com or has an old placeholder avatar
    if (parsed && parsed.email?.toLowerCase().includes('gmail.com')) {
      if (!parsed.avatar || parsed.avatar.includes('unsplash.com')) {
        parsed.avatar = getGoogleAvatarUrl(parsed.email, parsed.name);
        parsed.authProvider = 'google';
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(parsed));
      }
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveStoredUser(user: User | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  } catch (err) {
    console.error('Failed to save user', err);
  }
}

export function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredOrders(orders: Order[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  } catch (err) {
    console.error('Failed to save orders', err);
  }
}

export function getStoredReviews(): Record<string, Review[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
      return INITIAL_REVIEWS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_REVIEWS;
  }
}

export function saveStoredReviews(reviews: Record<string, Review[]>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  } catch (err) {
    console.error('Failed to save reviews', err);
  }
}

export const DEFAULT_MERCHANT_SETTINGS: MerchantPayoutSettings = {
  merchantName: 'Mehrana Wears (Faruk Karim)',
  merchantEmail: 'farukarim@gmail.com',
  googlePayMerchantId: 'BCR2DN6TZ4K9FARUK',
  businessUpiId: 'farukarim@okaxis',
  bankName: 'JPMorgan Chase / Standard Chartered Bank',
  accountNumber: '•••• •••• •••• 9102',
  accountHolder: 'Faruk Karim',
  routingNumber: '021000021',
  settlementMode: 'instant',
  isVerified: true,
  totalWithdrawn: 0,
};

const MERCHANT_SETTINGS_KEY = 'mehrana_wear_merchant_settings_v1';

export function getStoredMerchantSettings(): MerchantPayoutSettings {
  try {
    const raw = localStorage.getItem(MERCHANT_SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(MERCHANT_SETTINGS_KEY, JSON.stringify(DEFAULT_MERCHANT_SETTINGS));
      return DEFAULT_MERCHANT_SETTINGS;
    }
    return { ...DEFAULT_MERCHANT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_MERCHANT_SETTINGS;
  }
}

export function saveStoredMerchantSettings(settings: MerchantPayoutSettings): void {
  try {
    localStorage.setItem(MERCHANT_SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save merchant settings', err);
  }
}
