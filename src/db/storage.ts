import { Category, Order, Product, Reservation, Review, User } from '../types';
import { initialCategories, initialProducts, initialReviews } from '../data/seedData';

// Cryptographic hash helper using Web Crypto API
export async function hashPassword(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(`${salt}:${password}:lagman-food-secret`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function generateSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

interface StoredUserCredential {
  userId: string;
  passwordHash: string;
  salt: string;
}

const STORAGE_KEYS = {
  USERS: 'lf_db_users',
  CREDENTIALS: 'lf_db_credentials',
  SESSION: 'lf_db_session',
  PRODUCTS: 'lf_db_products',
  CATEGORIES: 'lf_db_categories',
  ORDERS: 'lf_db_orders',
  RESERVATIONS: 'lf_db_reservations',
  REVIEWS: 'lf_db_reviews',
  LANGUAGE: 'lf_app_language',
  CART: 'lf_app_cart',
};

// Initialize default seed data
export async function initializeDatabase(): Promise<void> {
  if (typeof window === 'undefined') return;

  // Initialize categories
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(initialCategories));
  }

  // Initialize products
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
  }

  // Initialize reviews
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(initialReviews));
  }

  // Initialize users & credentials with hashed passwords
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const adminUser: User = {
      id: 'admin-01',
      name: 'Lagman Food General Manager',
      email: 'admin@lagmanfood.kz',
      phone: '+7 (701) 987-6543',
      birthDate: '1992-05-14',
      age: 34,
      role: 'admin',
      address: 'Dostyk Ave 105, Almaty',
      createdAt: '2026-01-01T00:00:00Z',
    };

    const guestUser: User = {
      id: 'guest-01',
      name: 'Сұлтан Берікұлы',
      email: 'guest@lagmanfood.kz',
      phone: '+7 (777) 123-4567',
      birthDate: '2000-08-20',
      age: 26,
      role: 'customer',
      address: 'Al-Farabi Ave 77, Apt 42, Almaty',
      createdAt: '2026-02-15T00:00:00Z',
    };

    const users: User[] = [adminUser, guestUser];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    const adminSalt = generateSalt();
    const adminHash = await hashPassword('LagmanAdmin2026!', adminSalt);

    const guestSalt = generateSalt();
    const guestHash = await hashPassword('LagmanFood18+', guestSalt);

    const creds: StoredUserCredential[] = [
      { userId: adminUser.id, passwordHash: adminHash, salt: adminSalt },
      { userId: guestUser.id, passwordHash: guestHash, salt: guestSalt },
    ];
    localStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(creds));

    // Seed demo orders for the guest user
    const initialOrders: Order[] = [
      {
        id: 'ord-seed-01',
        orderNumber: 'LF-84920',
        userId: guestUser.id,
        customerName: guestUser.name,
        email: guestUser.email,
        phone: guestUser.phone,
        deliveryType: 'delivery',
        deliveryAddress: 'Al-Farabi Ave 77, Apt 42, Almaty',
        paymentMethod: 'card_courier',
        comment: 'Please bring hot chili lajan sauce on the side',
        items: [
          {
            productId: 'lf-01',
            name: 'Royal Guyru Lagman',
            price: 3600,
            quantity: 2,
            image: '/src/assets/images/lagman_signature_dish_1791006033068.jpg',
          },
          {
            productId: 'lf-06',
            name: 'Crispy Caramelized Eggplant Saisai',
            price: 2600,
            quantity: 1,
            image: '/src/assets/images/hero_lagman_restaurant_1791006018027.jpg',
          },
          {
            productId: 'lf-12',
            name: 'Alpine Samovar Herbal Tea (1000 ml)',
            price: 1800,
            quantity: 1,
            image: '/src/assets/images/restaurant_atmosphere_luxury_1791006045461.jpg',
          },
        ],
        subtotal: 11600,
        deliveryFee: 0,
        total: 11600,
        status: 'Preparing',
        createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
        estimatedDeliveryTime: '45-60 min',
      },
      {
        id: 'ord-seed-02',
        orderNumber: 'LF-73812',
        userId: guestUser.id,
        customerName: guestUser.name,
        email: guestUser.email,
        phone: guestUser.phone,
        deliveryType: 'delivery',
        deliveryAddress: 'Al-Farabi Ave 77, Apt 42, Almaty',
        paymentMethod: 'cash',
        items: [
          {
            productId: 'lf-04',
            name: 'Royal Steamed Manti (5 pcs)',
            price: 3200,
            quantity: 1,
            image: '/src/assets/images/manti_dumplings_dish_1791006058597.jpg',
          },
          {
            productId: 'lf-10',
            name: 'Emerald Pistachio & Wild Honey Baklava',
            price: 2400,
            quantity: 1,
            image: '/src/assets/images/baklava_dessert_dish_1791006101725.jpg',
          },
        ],
        subtotal: 5600,
        deliveryFee: 1200,
        total: 6800,
        status: 'Completed',
        createdAt: new Date(Date.now() - 86400 * 1000 * 3).toISOString(),
        estimatedDeliveryTime: 'Delivered',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(initialOrders));

    // Seed demo reservation
    const initialReservations: Reservation[] = [
      {
        id: 'res-seed-01',
        reservationNumber: 'RES-10492',
        userId: guestUser.id,
        guestName: guestUser.name,
        email: guestUser.email,
        phone: guestUser.phone,
        date: new Date(Date.now() + 86400 * 1000 * 2).toISOString().split('T')[0],
        time: '19:30',
        guestsCount: 4,
        seatingArea: 'terrace',
        comment: 'Window table with a view of the mountains if possible',
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(initialReservations));
  }
}

// User & Authentication Services
export async function getStoredUsers(): Promise<User[]> {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
}

export async function getStoredCredentials(): Promise<StoredUserCredential[]> {
  const data = localStorage.getItem(STORAGE_KEYS.CREDENTIALS);
  return data ? JSON.parse(data) : [];
}

export async function authenticateUser(emailOrPhone: string, plainPassword: string): Promise<User | null> {
  const users = await getStoredUsers();
  const credentials = await getStoredCredentials();

  const user = users.find(
    u => u.email.toLowerCase() === emailOrPhone.trim().toLowerCase() || u.phone === emailOrPhone.trim()
  );

  if (!user) return null;

  const cred = credentials.find(c => c.userId === user.id);
  if (!cred) return null;

  const computedHash = await hashPassword(plainPassword, cred.salt);
  if (computedHash === cred.passwordHash) {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
    return user;
  }

  return null;
}

export async function registerNewUser(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  birthDate: string;
}): Promise<{ success: boolean; user?: User; error?: string }> {
  // Validate age (strictly 18+)
  const birth = new Date(data.birthDate);
  if (isNaN(birth.getTime())) {
    return { success: false, error: 'Invalid birth date.' };
  }

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  if (age < 18) {
    return { success: false, error: 'You must be at least 18 years old to register.' };
  }

  const users = await getStoredUsers();
  const credentials = await getStoredCredentials();

  const emailExists = users.some(u => u.email.toLowerCase() === data.email.trim().toLowerCase());
  if (emailExists) {
    return { success: false, error: 'An account with this email address already exists.' };
  }

  const newUser: User = {
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    birthDate: data.birthDate,
    age,
    role: 'customer',
    createdAt: new Date().toISOString(),
  };

  const salt = generateSalt();
  const passwordHash = await hashPassword(data.password, salt);

  users.push(newUser);
  credentials.push({ userId: newUser.id, passwordHash, salt });

  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  localStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(credentials));
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(newUser));

  return { success: true, user: newUser };
}

export function getCurrentSession(): User | null {
  if (typeof window === 'undefined') return null;
  const session = localStorage.getItem(STORAGE_KEYS.SESSION);
  return session ? JSON.parse(session) : null;
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}

export async function updateUserProfile(updatedUser: Partial<User> & { id: string }): Promise<User> {
  const users = await getStoredUsers();
  const index = users.findIndex(u => u.id === updatedUser.id);
  if (index === -1) throw new Error('User not found');

  const merged = { ...users[index], ...updatedUser };
  users[index] = merged;
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

  const current = getCurrentSession();
  if (current && current.id === merged.id) {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(merged));
  }

  return merged;
}

// Products & Categories
export async function getProducts(): Promise<Product[]> {
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  return data ? JSON.parse(data) : initialProducts;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find(p => p.id === id || p.slug === id);
}

export async function saveProduct(product: Product): Promise<Product> {
  const products = await getProducts();
  const idx = products.findIndex(p => p.id === product.id);
  if (idx >= 0) {
    products[idx] = product;
  } else {
    products.unshift(product);
  }
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  return product;
}

export async function getCategories(): Promise<Category[]> {
  const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  return data ? JSON.parse(data) : initialCategories;
}

// Orders Service
export async function getOrders(userId?: string): Promise<Order[]> {
  const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
  const allOrders: Order[] = data ? JSON.parse(data) : [];
  if (userId) {
    return allOrders.filter(o => o.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  return allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>): Promise<Order> {
  const allOrders = await getOrders();
  const orderNumber = `LF-${Math.floor(10000 + Math.random() * 90000)}`;

  const newOrder: Order = {
    ...orderData,
    id: `ord-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    orderNumber,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };

  allOrders.unshift(newOrder);
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(allOrders));
  return newOrder;
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
  const allOrders = await getOrders();
  const order = allOrders.find(o => o.id === orderId);
  if (!order) throw new Error('Order not found');

  order.status = status;
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(allOrders));
  return order;
}

// Reservations Service
export async function getReservations(userId?: string): Promise<Reservation[]> {
  const data = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
  const all: Reservation[] = data ? JSON.parse(data) : [];
  if (userId) {
    return all.filter(r => r.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createReservation(resData: Omit<Reservation, 'id' | 'reservationNumber' | 'createdAt' | 'status'>): Promise<Reservation> {
  const all = await getReservations();
  const reservationNumber = `RES-${Math.floor(10000 + Math.random() * 90000)}`;

  const newReservation: Reservation = {
    ...resData,
    id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    reservationNumber,
    status: 'Confirmed',
    createdAt: new Date().toISOString(),
  };

  all.unshift(newReservation);
  localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(all));
  return newReservation;
}

export async function updateReservationStatus(resId: string, status: Reservation['status']): Promise<Reservation> {
  const all = await getReservations();
  const res = all.find(r => r.id === resId);
  if (!res) throw new Error('Reservation not found');

  res.status = status;
  localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(all));
  return res;
}

// Reviews Service
export async function getReviews(dishId?: string): Promise<Review[]> {
  const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
  const all: Review[] = data ? JSON.parse(data) : initialReviews;
  if (dishId) {
    return all.filter(r => r.dishId === dishId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  return all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function addReview(reviewData: Omit<Review, 'id' | 'date' | 'likes'>): Promise<Review> {
  const all = await getReviews();
  const newReview: Review = {
    ...reviewData,
    id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    date: new Date().toISOString().split('T')[0],
    likes: 0,
  };

  all.unshift(newReview);
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(all));

  // If dishId is specified, re-calculate product rating and reviewsCount
  if (newReview.dishId) {
    const products = await getProducts();
    const product = products.find(p => p.id === newReview.dishId);
    if (product) {
      const dishReviews = all.filter(r => r.dishId === product.id);
      const totalRating = dishReviews.reduce((sum, r) => sum + r.rating, 0);
      product.rating = Number((totalRating / dishReviews.length).toFixed(2));
      product.reviewsCount = dishReviews.length;
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    }
  }

  return newReview;
}

export async function likeReview(reviewId: string): Promise<Review> {
  const all = await getReviews();
  const review = all.find(r => r.id === reviewId);
  if (!review) throw new Error('Review not found');

  review.likes += 1;
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(all));
  return review;
}
