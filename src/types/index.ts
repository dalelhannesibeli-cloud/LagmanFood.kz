export type Language = 'KZ' | 'RU' | 'EN';

export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string; // YYYY-MM-DD
  age: number;
  role: UserRole;
  avatarUrl?: string;
  address?: string;
  createdAt: string;
}

export type CategoryId = 'lagman' | 'manti' | 'salads' | 'soups' | 'desserts' | 'beverages';

export interface Category {
  id: CategoryId;
  name: Record<Language, string>;
  description: Record<Language, string>;
  icon: string;
}

export interface Product {
  id: string;
  slug: string;
  categoryId: CategoryId;
  name: Record<Language, string>;
  description: Record<Language, string>;
  ingredients: Record<Language, string[]>;
  price: number; // in Kazakhstani Tenge (₸)
  originalPrice?: number;
  image: string;
  rating: number;
  reviewsCount: number;
  isPopular?: boolean;
  isSignature?: boolean;
  spicyLevel: 0 | 1 | 2 | 3; // 0 = mild, 3 = extra hot
  prepTimeMinutes: number;
  calories: number;
  portionGrams: number;
  allergens: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  comment?: string;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';

export interface OrderItemRecord {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  email: string;
  phone: string;
  deliveryType: 'delivery' | 'pickup';
  deliveryAddress: string;
  paymentMethod: 'cash' | 'card_courier' | 'online';
  comment?: string;
  items: OrderItemRecord[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  estimatedDeliveryTime: string;
}

export type ReservationStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export type SeatingArea = 'main' | 'vip' | 'terrace';

export interface Reservation {
  id: string;
  reservationNumber: string;
  userId: string;
  guestName: string;
  email: string;
  phone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  guestsCount: number;
  seatingArea: SeatingArea;
  comment?: string;
  status: ReservationStatus;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1 to 5
  text: string;
  dishId?: string;
  dishName?: string;
  date: string;
  verifiedPurchase: boolean;
  likes: number;
}
