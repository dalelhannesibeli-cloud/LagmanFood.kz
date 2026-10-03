import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, comment?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, deltaOrQuantity: number, isAbsolute?: boolean) => void;
  clearCart: () => void;
  subtotal: number;
  deliveryFee: number;
  total: number;
  totalCount: number;
  recentAddedItem: Product | null;
  clearRecentAdded: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_DELIVERY_THRESHOLD = 10000;
const STANDARD_DELIVERY_FEE = 1200;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lf_app_cart');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  const [recentAddedItem, setRecentAddedItem] = useState<Product | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lf_app_cart', JSON.stringify(items));
    }
  }, [items]);

  const addToCart = (product: Product, quantity = 1, comment = '') => {
    setItems(prev => {
      const existingIdx = prev.findIndex(item => item.product.id === product.id);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        if (comment) updated[existingIdx].comment = comment;
        return updated;
      }
      return [...prev, { product, quantity, comment }];
    });
    setRecentAddedItem(product);
    setTimeout(() => {
      setRecentAddedItem(null);
    }, 3000);
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, deltaOrQuantity: number, isAbsolute = false) => {
    setItems(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = isAbsolute ? deltaOrQuantity : item.quantity + deltaOrQuantity;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(item => item.quantity > 0);
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const clearRecentAdded = () => {
    setRecentAddedItem(null);
  };

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = items.length === 0 ? 0 : subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;
  const total = subtotal + deliveryFee;
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        deliveryFee,
        total,
        totalCount,
        recentAddedItem,
        clearRecentAdded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
