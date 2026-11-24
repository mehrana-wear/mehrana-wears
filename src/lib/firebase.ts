import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  updateProfile,
  User as FirebaseUser,
  AuthError
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  getDocs,
  setDoc, 
  updateDoc,
  deleteDoc,
  collection,
  onSnapshot,
  writeBatch,
  serverTimestamp,
  Unsubscribe 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { User, Product, Order, Review } from '../types';

// Initialize Firebase App singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const FIREBASE_PROJECT_ID = firebaseConfig.projectId;

// Authentication Instance
export const auth = getAuth(app);

// Firestore Instance using database ID specified in config
export const db = getFirestore(
  app, 
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)' 
    ? firebaseConfig.firestoreDatabaseId 
    : undefined
);

// Google Auth Provider setup
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * Deep sanitization helper to strip any `undefined` values that would cause Firestore setDoc() to fail.
 */
export function sanitizeForFirestore(obj: any): any {
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) {
    return obj
      .filter((item) => item !== undefined)
      .map((item) => sanitizeForFirestore(item));
  }
  if (typeof obj === 'object') {
    // Keep serverTimestamp objects intact
    if (obj.constructor && obj.constructor.name === 'FieldValue') {
      return obj;
    }
    const sanitized: Record<string, any> = {};
    for (const [key, val] of Object.entries(obj)) {
      if (val !== undefined) {
        sanitized[key] = sanitizeForFirestore(val);
      }
    }
    return sanitized;
  }
  return obj;
}

/**
 * Transforms Firebase User + Firestore document into app User object
 */
export async function syncUserProfile(fbUser: FirebaseUser, additionalData?: Partial<User>): Promise<User> {
  const userDocRef = doc(db, 'users', fbUser.uid);
  
  let firestoreData: any = {};
  try {
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      firestoreData = snap.data();
    }
  } catch (err) {
    console.warn('Could not read user profile from Firestore, using auth token data', err);
  }

  const isEmailAdmin = fbUser.email?.toLowerCase().includes('admin') ?? false;
  const role: 'admin' | 'customer' = firestoreData.role || (isEmailAdmin ? 'admin' : 'customer');

  const avatar = fbUser.photoURL || firestoreData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(fbUser.displayName || fbUser.email?.split('@')[0] || 'User')}&background=3F4C27&color=fff`;

  const userData: User = {
    id: fbUser.uid,
    name: fbUser.displayName || firestoreData.name || fbUser.email?.split('@')[0] || 'Customer',
    email: fbUser.email || '',
    avatar,
    authProvider: fbUser.providerData.some(p => p.providerId === 'google.com') ? 'google' : 'email',
    role,
    googlePhotoUrl: fbUser.photoURL || undefined,
    phone: firestoreData.phone || fbUser.phoneNumber || '+1 (555) 234-5678',
    address: firestoreData.address || {
      street: '142 Regent Boulevard, Suite 5A',
      city: 'London',
      state: 'Greater London',
      postalCode: 'W1B 5AH',
      country: 'United Kingdom',
    },
    ...additionalData,
  };

  // Upsert to Firestore
  try {
    const payload = sanitizeForFirestore({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar,
      authProvider: userData.authProvider,
      role: userData.role,
      phone: userData.phone || '',
      address: userData.address || {},
      lastLoginAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    await setDoc(userDocRef, payload, { merge: true });
  } catch (err) {
    console.warn('Failed to upsert user profile to Firestore:', err);
  }

  return userData;
}

/**
 * Sign in using official Google popup
 */
export async function logInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = await syncUserProfile(result.user);
    return user;
  } catch (error: any) {
    console.error('Google Sign In Error:', error);
    const authError = error as AuthError;
    if (authError.code === 'auth/unauthorized-domain') {
      const host = typeof window !== 'undefined' ? window.location.hostname : 'this domain';
      const domainError = new Error(
        `Domain "${host}" is not yet authorized in Firebase Authentication. Add "${host}" under Firebase Console → Authentication → Settings → Authorized domains.`
      ) as Error & { code?: string; hostname?: string };
      domainError.code = 'auth/unauthorized-domain';
      domainError.hostname = host;
      throw domainError;
    } else if (authError.code === 'auth/popup-closed-by-user') {
      throw new Error('Google sign-in popup was closed before completing.');
    } else if (authError.code === 'auth/popup-blocked') {
      throw new Error('Sign-in popup was blocked by browser. Please allow popups for this page.');
    } else if (authError.code === 'auth/cancelled-popup-request') {
      throw new Error('Popup request was superseded.');
    } else if (authError.code === 'auth/network-request-failed') {
      throw new Error('Network error while connecting to Google Sign-In. Please check your connection and try again.');
    }
    throw new Error(authError.message || 'Failed to sign in with Google.');
  }
}

/**
 * Sign in with email and password
 */
export async function logInWithEmail(email: string, password: string): Promise<User> {
  try {
    const result = await signInWithEmailAndPassword(auth, email.trim(), password);
    const user = await syncUserProfile(result.user);
    return user;
  } catch (error: any) {
    console.error('Email Log In Error:', error);
    const authError = error as AuthError;
    if (authError.code === 'auth/user-not-found' || authError.code === 'auth/invalid-credential') {
      throw new Error('Invalid email or password. Please check your credentials or sign up.');
    } else if (authError.code === 'auth/wrong-password') {
      throw new Error('Incorrect password. Please try again.');
    } else if (authError.code === 'auth/invalid-email') {
      throw new Error('Invalid email address format.');
    }
    throw new Error(authError.message || 'Failed to log in with email.');
  }
}

/**
 * Sign up with name, email and password
 */
export async function signUpWithEmail(name: string, email: string, password: string): Promise<User> {
  try {
    const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
    
    if (name.trim()) {
      await updateProfile(result.user, {
        displayName: name.trim(),
        photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=3F4C27&color=fff`
      });
    }

    const user = await syncUserProfile(result.user, { name: name.trim() });
    return user;
  } catch (error: any) {
    console.error('Email Sign Up Error:', error);
    const authError = error as AuthError;
    if (authError.code === 'auth/email-already-in-use') {
      throw new Error('An account already exists with this email. Please sign in instead.');
    } else if (authError.code === 'auth/weak-password') {
      throw new Error('Password should be at least 6 characters.');
    } else if (authError.code === 'auth/invalid-email') {
      throw new Error('Invalid email address format.');
    }
    throw new Error(authError.message || 'Failed to create account.');
  }
}

/**
 * Save user profile updates to Firestore
 */
export async function updateUserProfile(userId: string, updates: Partial<User>): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, sanitizeForFirestore({
      ...updates,
      updatedAt: serverTimestamp(),
    }));
  } catch (err) {
    console.warn('Could not update profile in Firestore:', err);
  }
}

/**
 * Sign out current Firebase user
 */
export async function logOut(): Promise<void> {
  await firebaseSignOut(auth);
}

// ==========================================
// REAL-TIME FIRESTORE PRODUCT SYNCHRONIZATION
// ==========================================

/**
 * Real-time subscription to the products collection across all devices
 */
export function subscribeProducts(
  onUpdate: (products: Product[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const productsCol = collection(db, 'products');
  return onSnapshot(
    productsCol,
    (snapshot) => {
      const items: Product[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Product;
        items.push(data);
      });
      // Sort with newest on top
      items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      onUpdate(items);
    },
    (err) => {
      console.error('Error listening to products collection:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Save a new dress/cloth/item directly to Firestore
 */
export async function saveProductToFirestore(product: Product): Promise<void> {
  try {
    const prodDocRef = doc(db, 'products', product.id);
    const cleaned = sanitizeForFirestore({
      ...product,
      _syncedAt: serverTimestamp(),
    });
    await setDoc(prodDocRef, cleaned);
    console.log(`[Firestore] Successfully saved product "${product.name}" (ID: ${product.id}) to Cloud database.`);
  } catch (err) {
    console.error('Failed to save product to Firestore:', err);
    throw err;
  }
}

/**
 * Update an existing dress/cloth/item in Firestore
 */
export async function updateProductInFirestore(product: Product): Promise<void> {
  try {
    const prodDocRef = doc(db, 'products', product.id);
    const cleaned = sanitizeForFirestore({
      ...product,
      _syncedAt: serverTimestamp(),
    });
    await setDoc(prodDocRef, cleaned, { merge: true });
    console.log(`[Firestore] Successfully updated product "${product.name}" (ID: ${product.id}) in Cloud database.`);
  } catch (err) {
    console.error('Failed to update product in Firestore:', err);
    throw err;
  }
}

/**
 * Delete a product from Firestore
 */
export async function deleteProductFromFirestore(productId: string): Promise<void> {
  try {
    const prodDocRef = doc(db, 'products', productId);
    await deleteDoc(prodDocRef);
    console.log(`[Firestore] Successfully deleted product ID "${productId}" from Cloud database.`);
  } catch (err) {
    console.error('Failed to delete product from Firestore:', err);
    throw err;
  }
}

/**
 * Clear all products from Firestore (Admin action)
 */
export async function clearAllProductsInFirestore(): Promise<void> {
  try {
    const productsCol = collection(db, 'products');
    const snapshot = await getDocs(productsCol);
    const batch = writeBatch(db);
    snapshot.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });
    await batch.commit();
    console.log('[Firestore] Successfully cleared products catalog in Cloud database.');
  } catch (err) {
    console.error('Failed to clear products in Firestore:', err);
    throw err;
  }
}

/**
 * Bulk seed initial products into Firestore if database is empty
 */
export async function seedProductsToFirestore(products: Product[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    for (const prod of products) {
      const docRef = doc(db, 'products', prod.id);
      const cleaned = sanitizeForFirestore({
        ...prod,
        _syncedAt: serverTimestamp(),
      });
      batch.set(docRef, cleaned);
    }
    await batch.commit();
    console.log(`[Firestore] Seeded ${products.length} products to Cloud database.`);
  } catch (err) {
    console.error('Failed to seed products in Firestore:', err);
  }
}

// ==========================================
// REAL-TIME FIRESTORE ORDERS SYNCHRONIZATION
// ==========================================

/**
 * Real-time subscription to orders across all devices
 */
export function subscribeOrders(
  onUpdate: (orders: Order[]) => void
): Unsubscribe {
  const ordersCol = collection(db, 'orders');
  return onSnapshot(
    ordersCol,
    (snapshot) => {
      const items: Order[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as Order);
      });
      items.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
      onUpdate(items);
    },
    (err) => {
      console.warn('Error listening to orders in Firestore:', err);
    }
  );
}

/**
 * Save placed order to Firestore
 */
export async function saveOrderToFirestore(order: Order): Promise<void> {
  try {
    const orderDocRef = doc(db, 'orders', order.id);
    const cleaned = sanitizeForFirestore({
      ...order,
      _syncedAt: serverTimestamp(),
    });
    await setDoc(orderDocRef, cleaned);
  } catch (err) {
    console.error('Failed to save order to Firestore:', err);
  }
}

/**
 * Update order status in Firestore
 */
export async function updateOrderStatusInFirestore(orderId: string, status: Order['status']): Promise<void> {
  try {
    const orderDocRef = doc(db, 'orders', orderId);
    await updateDoc(orderDocRef, {
      status,
      _syncedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('Failed to update order status in Firestore:', err);
  }
}

// ==========================================
// REAL-TIME FIRESTORE REVIEWS SYNCHRONIZATION
// ==========================================

/**
 * Real-time subscription to reviews across all devices
 */
export function subscribeReviews(
  onUpdate: (reviewsMap: Record<string, Review[]>) => void
): Unsubscribe {
  const reviewsCol = collection(db, 'reviews');
  return onSnapshot(
    reviewsCol,
    (snapshot) => {
      const map: Record<string, Review[]> = {};
      snapshot.forEach((docSnap) => {
        const rev = docSnap.data() as Review;
        if (rev.productId) {
          if (!map[rev.productId]) {
            map[rev.productId] = [];
          }
          map[rev.productId].push(rev);
        }
      });
      onUpdate(map);
    },
    (err) => {
      console.warn('Error listening to reviews in Firestore:', err);
    }
  );
}

/**
 * Save a review to Firestore
 */
export async function saveReviewToFirestore(review: Review): Promise<void> {
  try {
    const reviewDocRef = doc(db, 'reviews', review.id);
    const cleaned = sanitizeForFirestore({
      ...review,
      _syncedAt: serverTimestamp(),
    });
    await setDoc(reviewDocRef, cleaned);
  } catch (err) {
    console.error('Failed to save review to Firestore:', err);
  }
}
