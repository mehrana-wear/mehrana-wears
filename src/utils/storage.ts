import { Product, CartItem, Order, User, Review } from '../types';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS } from '../data/initialProducts';

const STORAGE_KEYS = {
  PRODUCTS: 'mehrana_wear_products_v2',
  CART: 'mehrana_wear_cart_v2',
  WISHLIST: 'mehrana_wear_wishlist_v2',
  USER: 'mehrana_wear_user_v2',
  ORDERS: 'mehrana_wear_orders_v2',
  REVIEWS: 'mehrana_wear_reviews_v2',
  ADMIN_AUTH: 'mehrana_wear_admin_unlocked_v2',
};

export function getStoredProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PRODUCTS;
  } catch {
    return INITIAL_PRODUCTS;
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

const DEFAULT_USER: User = {
  id: 'usr-faruk-1',
  name: 'Faruk Karim',
  email: 'farukarim@gmail.com',
  role: 'customer',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
  address: {
    street: '142 Regent Boulevard, Suite 5A',
    city: 'London',
    state: 'Greater London',
    postalCode: 'W1B 5AH',
    country: 'United Kingdom',
  },
  phone: '+44 7700 900077',
};

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : DEFAULT_USER;
  } catch {
    return DEFAULT_USER;
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
